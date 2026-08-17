<?php
/**
 * Credit Freeze Letters, Joomla content plugin.
 *
 * Replaces {credit_freeze} in any article with a working credit freeze letter
 * generator. The widget runs entirely in the visitor's browser and makes no
 * network calls once the page has loaded.
 *
 * @copyright  Copyright (C) 2026 Klagge Law, PLLC
 * @license    GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Application\CMSApplicationInterface;

/**
 * Swaps the {credit_freeze} marker for the widget container and loads the
 * script once per page, however many markers there are.
 */
class PlgContentCreditfreeze extends CMSPlugin
{
	/**
	 * Load the plugin language files automatically.
	 *
	 * @var boolean
	 */
	protected $autoloadLanguage = true;

	/**
	 * The application, injected by Joomla.
	 *
	 * @var CMSApplicationInterface
	 */
	protected $app;

	/**
	 * The marker authors type into an article.
	 */
	private const MARKER = '/\{credit_freeze\}/i';

	/**
	 * Replace the marker wherever it appears in article text.
	 *
	 * @param   string  $context  The context of the content being prepared.
	 * @param   object  $article  The article object.
	 * @param   mixed   $params   The article params.
	 * @param   integer $page     The 'page' number.
	 *
	 * @return  void
	 */
	public function onContentPrepare($context, &$article, &$params, $page = 0)
	{
		if ($context === 'com_finder.indexer') {
			return;
		}

		if (empty($article->text) || stripos($article->text, '{credit_freeze}') === false) {
			return;
		}

		$count = 0;
		$article->text = preg_replace_callback(
			self::MARKER,
			function () {
				return $this->container();
			},
			$article->text,
			-1,
			$count
		);

		if ($count > 0) {
			$this->loadScript();
		}
	}

	/**
	 * Build the widget container, carrying any colour overrides as CSS custom
	 * properties the widget reads off its own element.
	 *
	 * @return  string
	 */
	private function container(): string
	{
		$map = [
			'brand' => '--sufz-brand',
			'text'  => '--sufz-fg',
			'muted' => '--sufz-mut',
			'line'  => '--sufz-line',
		];

		$style = '';

		foreach ($map as $key => $prop) {
			$value = trim((string) $this->params->get($key, ''));

			if ($value === '') {
				continue;
			}

			// Only accept a colour. Anything else is dropped rather than escaped,
			// so nothing author-supplied can extend the style attribute.
			if (!preg_match('/^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([0-9.,%\s\/]+\)|[a-z]{3,20})$/i', $value)) {
				continue;
			}

			$style .= $prop . ':' . $value . ';';
		}

		// The Joomla Extensions Directory requires a visible backlink to be
		// removable by the site owner, so the credit line is a setting rather
		// than something baked in. It defaults to on.
		$credit = (int) $this->params->get('showcredit', 1) === 1
			? ''
			: ' data-sufz-credit="off"';

		return '<div data-stepup-freeze class="cfl-widget"' . $credit
			. ($style !== '' ? ' style="' . htmlspecialchars($style, ENT_QUOTES, 'UTF-8') . '"' : '')
			. '></div>';
	}

	/**
	 * Queue the bundled widget script once.
	 *
	 * @return  void
	 */
	private function loadScript(): void
	{
		static $done = false;

		if ($done) {
			return;
		}

		$done = true;

		// Not every context that prepares content has a document. The CLI
		// application and the API application both return null here, and
		// calling getWebAssetManager() on that is a fatal error, so a content
		// plugin must never assume one exists.
		$document = $this->app->getDocument();

		if (!$document || !method_exists($document, 'getWebAssetManager')) {
			return;
		}

		$document->getWebAssetManager()
			->registerAndUseScript(
				'plg_content_creditfreeze.widget',
				'plg_content_creditfreeze/credit-freeze.js',
				[],
				['defer' => true]
			);
	}
}
