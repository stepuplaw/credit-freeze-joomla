# Credit Freeze Letters for Joomla

Joomla content plugin. Type `{credit_freeze}` into any article and a working
credit freeze letter generator appears there.

It writes the mail-in letters that Equifax, Experian and TransUnion each
require. A security freeze is free under 15 U.S.C. 1681c-1 and is not shared
between bureaus, so placing one properly takes three separate letters.

It also covers the protected-consumer freeze, the one placed for someone who
cannot place it themselves. A guardian, a conservator, or an agent under a
power of attorney can do it, and no bureau accepts that request by phone or
web form, because it has to see the document granting authority.

## Install

Download the zip from [Releases](../../releases) and install it through
Extensions, then Manage, then Install. Enable the plugin under Plugins, search
for "Credit Freeze".

## Settings

- **Show credit line.** On by default. A one line credit under the disclaimer
  naming the author with a link. It is a request rather than a licence
  condition, so you may turn it off. The disclaimer itself always stays.
- **Colours.** Four fields matching the widget to your template.

## Privacy

The widget makes no network calls once the page has loaded. No analytics, no
tracking pixel, no cookie, no form submission. Names and addresses stay in the
visitor's browser and are gone when the tab closes. An attached photo of a
court document is read locally and never uploaded. It never asks for a Social
Security number.

The widget file ships inside the plugin, so nothing is fetched from another
host at runtime.

Nothing is written to your Joomla database. The plugin creates no tables.

## Licence

The plugin is GPL-2.0-or-later. The bundled widget, `media/js/credit-freeze.js`,
is MIT and carries its own notice.

Source for the underlying library is at
[elder-fraud-toolkit](https://github.com/stepuplaw/elder-fraud-toolkit), also on
npm.

## Disclaimer

This produces template correspondence from published federal law and published
bureau procedures. It is general information, not legal advice, and installing
it creates no attorney-client relationship.
