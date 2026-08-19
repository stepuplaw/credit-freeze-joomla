/*!
 * Fraud alert and credit freeze letters, embeddable widget
 * Klagge Law, PLLC  https://stepuplaw.com/credit-freeze-letter-generator
 *
 * Drop this anywhere:
 *   <div data-stepup-freeze></div>
 *   <script src="https://stepuplaw.com/embed/credit-freeze.js" async></script>
 *
 * Everything runs in the visitor's browser. The widget makes no network calls
 * after this file loads: no analytics, no tracking, nothing typed into it is
 * transmitted anywhere, and it never asks for a Social Security number. An
 * attached photo of a document is read locally and never uploaded.
 *
 * MIT licensed, which asks nothing of you. We do ask, without requiring it,
 * that you keep the credit line and its followable link to stepuplaw.com. That
 * link is how corrections reach the people running this, and it is what makes
 * maintaining it worth doing.
 * https://github.com/stepuplaw/elder-fraud-toolkit/blob/main/ATTRIBUTION.md
 *
 * Bureau addresses, enclosure lists and phone numbers verified against each
 * bureau's own published pages and forms on the VERIFIED date below. They do
 * change. Load this file from stepuplaw.com rather than copying it, and your
 * embed stays current automatically.
 */
(function () {
  'use strict';

  var HOME = 'https://stepuplaw.com';
  var TOOL = HOME + '/credit-freeze-letter-generator';
  var VERIFIED = 'August 12, 2026';

  var CAPACITY = {
    'power-of-attorney': { label: 'agent under a valid durable power of attorney', doc: 'durable power of attorney' },
    guardian: { label: 'court-appointed guardian', doc: 'letters of guardianship' },
    conservator: { label: 'court-appointed conservator', doc: 'letters of conservatorship' }
  };

  /* Fraud alert lines, as published by the FTC and the bureaus. Note Equifax
     uses a different number for alerts than it does for freezes. */
  var ALERT_LINES = [
    { name: 'Equifax', tel: '8006851111', shown: '(800) 685-1111' },
    { name: 'Experian', tel: '8883973742', shown: '(888) 397-3742' },
    { name: 'TransUnion', tel: '8889098872', shown: '(888) 909-8872' }
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Fraud lines for the largest US banks and brokerages, each verified on that
     institution's own published page on the VERIFIED date. Populated from
     research; every entry carries the number the institution publishes for
     REPORTING FRAUD where it publishes a distinct one. */
  var BANKS = [
    { n: 'Ally', t: '8332261520', s: '(833) 226-1520', h: '24/7' },
    { n: 'Bank of America', t: '8773378357', s: '(877) 337-8357', h: 'Wire fraud line. Cards and Zelle (800) 432-1000' },
    { n: 'Capital One', t: '8884640727', s: '(888) 464-0727', h: 'Live agents 8am to 11pm ET' },
    { n: 'Charles Schwab', t: '8778626352', s: '(877) 862-6352', h: 'Hours not published' },
    { n: 'Chase', t: '8009359935', s: '(800) 935-9935, option 8', h: 'NOT 24/7. Weekdays to midnight ET, weekends 9am to 6pm' },
    { n: 'Citibank', t: '8009505114', s: '(800) 950-5114', h: 'No separate fraud line' },
    { n: 'Citizens', t: '8009742260', s: '(800) 974-2260', h: 'Hours not published' },
    { n: 'Fidelity', t: '8005446666', s: '(800) 544-6666', h: 'General service line, no separate fraud line' },
    { n: 'Fifth Third', t: '8009723030', s: '(800) 972-3030', h: 'Weekdays 8am to 6pm ET, Sat 10am to 4pm, closed Sunday' },
    { n: 'PNC', t: '8887622265', s: '(888) 762-2265', h: 'Weekdays 8am to 9pm ET, weekends 8am to 5pm' },
    { n: 'Regions', t: '8007344667', s: '(800) 734-4667', h: 'General line only' },
    { n: 'TD Bank', t: '8008938554', s: '(800) 893-8554', h: '24/7' },
    { n: 'Truist', t: '8444878478', s: '(844) 487-8478, option 1 then 4', h: '24/7' },
    { n: 'U.S. Bank', t: '8775956256', s: '(877) 595-6256', h: 'Fraud Liaison Center, covers wires and ACH. 8am to 9pm Central' },
    { n: 'Vanguard', t: '8772236977', s: '(877) 223-6977', h: 'Hours not published' },
    { n: 'Wells Fargo', t: '8008693557', s: '(800) 869-3557', h: '24/7, and its own page says this covers elder fraud' }
  ];

  function bankOptions() {
    return '<option value="">Look up a bank fraud line</option>' +
      BANKS.map(function (b, i) { return '<option value="' + i + '">' + esc(b.n) + '</option>'; }).join('');
  }

  /* Addresses, enclosures and cautions verified on the VERIFIED date against
     each bureau's own live pages and forms. The three differ more than any
     circulating template admits, which is why this is a data table. */
  var BUREAUS = {
    Equifax: {
      self: {
        to: ['Equifax Information Services LLC', 'P.O. Box 105788', 'Atlanta, GA 30348-5788'],
        encl: ['A copy of one document showing your Social Security number, meaning your Social Security card, a pay stub showing the number, or a W2 or 1099',
          'A copy of one document showing your current address, such as a driver license, a lease or deed, a pay stub, or a utility or phone bill'],
        caution: 'Equifax routes every mail request to its own form and never says a plain letter is enough, so enclose the Equifax freeze form with this letter. Equifax also does not accept a driver license as proof of identity, only as proof of address.'
      },
      fiduciary: {
        to: ['Equifax Information Services LLC', 'P.O. Box 105788', 'Atlanta, GA 30348-5788'],
        caution: 'Equifax calls this an Incapacitated Adult freeze and publishes a form for it, so enclose that form too. It is also the only bureau that wants both the Social Security card and the birth certificate of the person you are protecting.'
      }
    },
    Experian: {
      self: {
        to: ['Experian Security Freeze', 'P.O. Box 9554', 'Allen, TX 75013'],
        encl: ['A copy of a government-issued photo ID, such as a driver license',
          'A copy of a utility bill or bank statement showing your name, current mailing address, and issue date'],
        caution: 'Experian accepts a plain letter and wants your Social Security number, date of birth, and every address from the past two years in the letter itself. Fill in the blanks before mailing.'
      },
      fiduciary: {
        to: ['Experian', 'PO Box 9554', 'Allen, TX 75013'],
        caution: 'Experian publishes a mail procedure only for minors and court-appointed guardians, and nothing at all for a power of attorney or an adult conservatorship. Call (888) 397-3742 before mailing and ask where to send it.'
      }
    },
    TransUnion: {
      self: {
        to: ['TransUnion', 'P.O. Box 160', 'Woodlyn, PA 19094'],
        encl: ['Nothing is required. TransUnion asks only for your name, address, and Social Security number in the letter itself',
          'Optional, and it speeds things up: one proof of identity and two proofs of your current address'],
        caution: 'TransUnion needs no form and no enclosures for your own freeze. Use P.O. Box 160 for this one, not Box 380.'
      },
      fiduciary: {
        to: ['TransUnion', 'P.O. Box 380', 'Woodlyn, PA 19094'],
        caution: 'Box 380 covers a minor or an incapacitated adult. If the person can still manage their own affairs and you simply hold a power of attorney, TransUnion publishes a different address, P.O. Box 2000, Chester, PA 19016. Send copies only.'
      }
    }
  };

  function fiduciaryEnclosures(bureau, docLabel, personName) {
    if (bureau === 'Equifax') return ['A copy of your ' + docLabel, 'A copy of your own identification',
      'A copy of the Social Security card of ' + personName, 'A copy of the birth certificate of ' + personName];
    if (bureau === 'Experian') return ['A copy of your government-issued photo ID',
      'Proof of your address, such as a bank statement, utility bill, or insurance statement', 'A copy of your ' + docLabel];
    return ['A copy of your ' + docLabel,
      'Proof of identification for ' + personName + ', meaning a Social Security card, a certified birth certificate, or a government-issued ID',
      'Proof of identification for the person signing below'];
  }

  var CSS = [
    /* --sufz-line is the hairline used inside the card. --sufz-edge is the
       heavier one used for the outer frame and the tab strip, so an embedder
       can strengthen the outline without darkening every internal divider. */
    '.sufz{--sufz-fg:#14201A;--sufz-mut:#475569;--sufz-brand:#1F4D3A;--sufz-line:rgba(71,85,105,.22);',
    '--sufz-edge:rgba(45,60,72,.62);',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;',
    'color:var(--sufz-fg);font-size:16px;line-height:1.55;max-width:640px;border:2px solid var(--sufz-edge);',
    'border-radius:14px;background:#fff;box-sizing:border-box;overflow:hidden;',
    'box-shadow:0 1px 2px rgba(20,32,26,.07),0 8px 24px rgba(20,32,26,.09)}',
    '.sufz *,.sufz *:before,.sufz *:after{box-sizing:inherit}',
    /* Tabs read as tabs: a recessed strip, hard dividers between them, and the
       selected one lifted to the pane colour with a thick brand underline. */
    '.sufz-top{display:flex;border-bottom:2px solid var(--sufz-edge);background:#EDEAE0}',
    '.sufz-top button{flex:1;border:0;border-right:1px solid var(--sufz-edge);background:transparent;',
    'font:inherit;font-size:15px;font-weight:700;letter-spacing:.005em;',
    'color:var(--sufz-mut);padding:13px 10px 10px;cursor:pointer;border-bottom:3px solid transparent;',
    'transition:background .12s ease,color .12s ease}',
    '.sufz-top button:last-child{border-right:0}',
    '.sufz-top button:hover{background:rgba(255,255,255,.55);color:var(--sufz-fg)}',
    '.sufz-top button:focus-visible{outline:2px solid var(--sufz-brand);outline-offset:-3px}',
    '.sufz-top button[aria-selected="true"]{background:#fff;color:var(--sufz-brand);',
    'border-bottom-color:var(--sufz-brand)}',
    '.sufz-top button small{display:block;font-weight:500;font-size:12px;opacity:.9;margin-top:2px;',
    'letter-spacing:0}',
    /* The stolen-funds tab has to be findable at a glance by someone reading at
       11pm who has hours, not days. */
    '.sufz-top button.urgent{background:rgba(176,141,46,.18);color:#6B520F}',
    '.sufz-top button.urgent:hover{background:rgba(176,141,46,.26);color:#5A450C}',
    '.sufz-top button.urgent[aria-selected="true"]{background:#fff;color:#7A5E12;border-bottom-color:#B08D2E}',
    '.sufz-step{display:flex;gap:10px;padding:11px 0;border-top:1px solid var(--sufz-line)}',
    '.sufz-step:first-of-type{border-top:0}',
    '.sufz-step b{flex:0 0 22px;height:22px;border-radius:50%;background:var(--sufz-brand);color:#fff;',
    'font-size:12px;display:flex;align-items:center;justify-content:center;margin-top:1px}',
    '.sufz-step div{flex:1;font-size:14px;line-height:1.55}',
    '.sufz-step div strong{display:block;font-size:14.5px}',
    '.sufz-step a{color:var(--sufz-brand);font-weight:600}',
    '.sufz-banks{margin-top:8px;border:1px solid var(--sufz-line);border-radius:9px;overflow:hidden}',
    '.sufz-banks select{border:0;border-radius:0;font-size:14px}',
    '.sufz-bankout{padding:10px 12px;font-size:14px;background:#F7F5EF;display:none}',
    '.sufz-bankout a{font-size:19px;font-weight:700;color:var(--sufz-brand);text-decoration:none}',
    '.sufz-bankout span{display:block;font-size:12.5px;color:var(--sufz-mut);margin-top:2px}',
    '.sufz-pane{padding:18px 20px}',
    '.sufz-h{margin:0 0 4px;font-size:18px;font-weight:700;line-height:1.3}',
    '.sufz-sub{margin:0 0 14px;font-size:14px;color:var(--sufz-mut)}',
    '.sufz-call{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}',
    '.sufz-call a{flex:1 1 30%;text-align:center;text-decoration:none;border:1px solid var(--sufz-brand);',
    'border-radius:9px;padding:9px 6px;color:var(--sufz-brand);font-weight:600;font-size:14px}',
    '.sufz-call a span{display:block;font-size:12.5px;font-weight:400;color:var(--sufz-mut)}',
    '.sufz-call a:hover{background:#F7F5EF}',
    '.sufz-key{border-left:3px solid var(--sufz-brand);background:#F7F5EF;border-radius:0 8px 8px 0;',
    'padding:10px 12px;margin:12px 0;font-size:14px;line-height:1.55}',
    '.sufz-seg{display:inline-flex;background:#F7F5EF;border-radius:10px;padding:3px;margin-bottom:10px}',
    '.sufz-seg button{border:0;background:none;font:inherit;font-size:14px;font-weight:600;color:var(--sufz-mut);',
    'padding:7px 13px;border-radius:8px;cursor:pointer}',
    '.sufz-seg button[aria-pressed="true"]{background:#fff;color:var(--sufz-brand);box-shadow:0 1px 2px rgba(0,0,0,.10)}',
    '.sufz-note{margin:0 0 14px;font-size:13.5px;color:var(--sufz-mut)}',
    '.sufz-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}',
    '.sufz-f{display:block}.sufz-f.c6{grid-column:span 6}.sufz-f.c3{grid-column:span 3}',
    '.sufz-f.c2{grid-column:span 2}.sufz-f.c1{grid-column:span 1}',
    '@media(max-width:479px){.sufz-f.c3{grid-column:span 6}}',
    '.sufz-f span{display:block;font-size:12.5px;font-weight:600;margin-bottom:4px}',
    '.sufz-f em{font-style:normal;font-weight:400;color:var(--sufz-mut)}',
    '.sufz input,.sufz select{width:100%;font:inherit;font-size:15px;padding:8px 10px;border:1px solid var(--sufz-line);',
    'border-radius:8px;background:#fff;color:inherit}',
    '.sufz input:focus,.sufz select:focus{outline:0;border-color:var(--sufz-brand);box-shadow:0 0 0 3px rgba(31,77,58,.14)}',
    '.sufz-fid{background:#F7F5EF;border-radius:10px;padding:12px;margin-top:10px}',
    '.sufz-fid>p{margin:0 0 8px;font-size:12.5px;font-weight:600}',
    '.sufz-file{margin-top:12px;border:1px dashed var(--sufz-line);border-radius:10px;padding:12px}',
    '.sufz-file input[type=file]{border:0;padding:6px 0;font-size:13px;background:none}',
    '.sufz-file p{margin:6px 0 0;font-size:12.5px;color:var(--sufz-mut);line-height:1.5}',
    '.sufz-act{margin-top:14px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.sufz-btn{font:inherit;font-size:15px;font-weight:600;border:0;border-radius:9px;padding:10px 16px;',
    'background:var(--sufz-brand);color:#fff;cursor:pointer}',
    '.sufz-btn:hover{background:#16382A}',
    '.sufz-btn.alt{background:#fff;color:var(--sufz-brand);border:1px solid var(--sufz-brand)}',
    '.sufz-btn.alt:hover{background:#F7F5EF}',
    '.sufz-priv{font-size:12.5px;color:var(--sufz-mut)}',
    '.sufz-err{margin:10px 0 0;font-size:13.5px;font-weight:600;color:#B91C1C}',
    '.sufz-out{margin-top:14px;display:none}',
    '.sufz-tabs{display:inline-flex;gap:4px;margin-bottom:10px;flex-wrap:wrap}',
    '.sufz-tabs button{font:inherit;font-size:13.5px;font-weight:600;border:1px solid var(--sufz-line);',
    'background:#fff;color:var(--sufz-mut);padding:6px 12px;border-radius:8px;cursor:pointer}',
    '.sufz-tabs button[aria-selected="true"]{background:var(--sufz-brand);color:#fff;border-color:var(--sufz-brand)}',
    '.sufz-caution{border:1px solid rgba(176,141,46,.45);background:rgba(176,141,46,.10);border-radius:10px;',
    'padding:10px 12px;margin-bottom:10px;font-size:13.5px;line-height:1.55}',
    '.sufz-letter{border:1px solid var(--sufz-line);border-radius:10px;padding:16px 18px;',
    'font-family:Georgia,"Times New Roman",serif;font-size:15px;line-height:1.6;max-height:300px;overflow:auto}',
    '.sufz-letter p{margin:.8em 0}.sufz-letter address{font-style:normal;margin:1em 0}',
    '.sufz-foot{border-top:2px solid var(--sufz-edge);background:#F7F5EF;padding:14px 20px;',
    'font-size:12px;line-height:1.65;color:var(--sufz-mut)}',
    '.sufz-foot a{color:var(--sufz-brand);font-weight:600}',
    '.sufz-foot strong{color:var(--sufz-fg)}',
    /* Three tabs will not sit side by side on a narrow phone without the labels
       breaking mid-word, so stack the strip below 430px. */
    '@media (max-width:430px){.sufz-top{flex-wrap:wrap}',
    '.sufz-top button{flex:1 0 100%;border-right:0;border-bottom:1px solid var(--sufz-edge);',
    'text-align:left;padding:11px 16px}',
    '.sufz-top button:last-child{border-bottom:0}',
    '.sufz-top button[aria-selected="true"]{border-bottom-color:var(--sufz-brand);border-bottom-width:3px}',
    '.sufz-top button.urgent[aria-selected="true"]{border-bottom-color:#B08D2E}',
    '.sufz-top button small{display:inline;margin-left:6px}',
    '.sufz-pane{padding:16px 16px}}'
  ].join('');

  function injectCss() {
    if (document.getElementById('sufz-css')) return;
    var s = document.createElement('style');
    s.id = 'sufz-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function field(cls, id, label, hint, ph, extra) {
    return '<label class="sufz-f ' + cls + '"><span>' + esc(label) +
      (hint ? ' <em>' + esc(hint) + '</em>' : '') + '</span>' +
      '<input id="' + id + '" type="text" autocomplete="off" placeholder="' + esc(ph || '') + '"' + (extra || '') + '></label>';
  }

  function render(root, n) {
    var p = 'sufz' + n + '-';

    /* The credit line is a request, not a licence condition, and directories
       that list this (the Joomla Extensions Directory among them) require a
       visible backlink to be removable by the site owner. Set
       data-sufz-credit="off" on the container to drop it. The disclaimer above
       it always stays, because that protects the person embedding this. */
    var showCredit = String(root.getAttribute('data-sufz-credit')).toLowerCase() !== 'off';

    root.className = 'sufz';
    root.innerHTML =
      '<div class="sufz-top" role="tablist" aria-label="Choose a protection">' +
      '<button type="button" role="tab" id="' + p + 'tabAlert" aria-selected="true">Fraud alert<small>5 minutes, one call</small></button>' +
      '<button type="button" role="tab" id="' + p + 'tabFreeze" aria-selected="false">Credit freeze<small>Stronger, three letters</small></button>' +
      '<button type="button" role="tab" class="urgent" id="' + p + 'tabStolen" aria-selected="false">Stolen funds<small>Act now, money is gone</small></button>' +
      '</div>' +

      /* Fraud alert pane */
      '<div class="sufz-pane" id="' + p + 'paneAlert">' +
      '<p class="sufz-h">Start here, it takes five minutes</p>' +
      '<p class="sufz-sub">A fraud alert tells every lender who pulls the credit report to stop and confirm the applicant is really you before opening anything in your name.</p>' +
      '<div class="sufz-key"><strong>One call covers all three bureaus.</strong> Call any one of them and the law requires it to pass the alert to the other two. A freeze works the opposite way, because nobody passes it along and you have to ask all three yourself.</div>' +
      '<div class="sufz-call">' +
      ALERT_LINES.map(function (b) {
        return '<a href="tel:+1' + b.tel + '">' + esc(b.name) + '<span>' + esc(b.shown) + '</span></a>';
      }).join('') +
      '</div>' +
      '<p class="sufz-sub">The alert is free, it never touches the credit score, and it runs for one year. You can renew it, or extend it to seven years once you have filed an identity theft report.</p>' +
      '<div class="sufz-key"><strong>An alert warns, a freeze blocks.</strong> A lender is free to read the warning, shrug, and open the account anyway. No lender can do that with a freeze, because the report will not come out at all. Place the alert now while you have the phone in your hand, then move to the freeze tab and leave both running.</div>' +
      '<p class="sufz-sub">If you are doing this for a parent or someone else who can no longer manage their own accounts, federal law lets you place a freeze for them. That route lives on the freeze tab.</p>' +
      '</div>' +

      /* Stolen funds pane */
      '<div class="sufz-pane" id="' + p + 'paneStolen" style="display:none">' +
      '<p class="sufz-h">Money already left the account</p>' +
      '<p class="sufz-sub">Two things run in parallel. The sending bank tries to pull the money back, and the FBI asks the receiving bank to freeze it. Start both now.</p>' +
      '<div class="sufz-key"><strong>The clock is real, and it is not a deadline.</strong> Treasury’s financial crimes unit says it is most likely to recover funds when a fraudulently induced wire is reported to law enforcement <strong>within 72 hours</strong>. That is about odds, not eligibility, so report it even if you are past that. There is no minimum amount.</div>' +

      '<div class="sufz-step"><b>1</b><div><strong>Call whoever moved the money</strong>' +
      'For a bank wire, ask them to <strong>request a recall</strong> and to issue a <strong>Hold Harmless Letter</strong>, also called a Letter of Indemnity. Naming that document gets you past the first person who says a wire is final. Use the number on the card or a statement, never one from a search result.' +
      '<div class="sufz-banks"><select id="' + p + 'bankPick">' + bankOptions() + '</select>' +
      '<div class="sufz-bankout" id="' + p + 'bankOut"></div></div>' +
      '<div style="margin-top:6px;font-size:12.5px">Published by each institution on ' + VERIFIED + '. Only four run genuinely round the clock, so at 2am your number may not answer, and Chase is not 24/7 whatever else you read.</div>' +
      '<div style="margin-top:8px">Not a bank wire? Western Union <a href="tel:+18004481492">(800) 448-1492</a>. MoneyGram <a href="tel:+18009269400">(800) 926-9400</a>. Ria <a href="tel:+18774431399">(877) 443-1399</a>. Gift card, call the issuer and keep the card and receipt. Cash by mail, US Postal Inspection Service <a href="tel:+18778762455">(877) 876-2455</a> to intercept it. Cryptocurrency is usually not reversible, so move to step 2 fast.</div>' +
      '</div></div>' +

      '<div class="sufz-step"><b>2</b><div><strong>File at ic3.gov with the banking details</strong>' +
      'This is the step that reaches the money. A complete complaint routes to the FBI’s Recovery Asset Team, which asks the receiving bank to freeze the account. In 2025 it froze $679 million of $1.16 billion reported.<br>' +
      'Have ready: amount, date and type of each transaction; the sending bank, account name and number; and the <strong>receiving</strong> bank, account name, account number, routing number, and SWIFT code if it went abroad.<br>' +
      'Fill in the age bracket, because the top one is over 60 and it puts the case in the elder fraud queue. <strong>Do not type a Social Security number or date of birth into the form</strong>, it takes no attachments, and <strong>save the confirmation before closing the tab</strong> because that is the only copy. You will not hear back, so call local police too if it is still moving. ' +
      '<a href="https://www.ic3.gov" target="_blank" rel="noopener">Open ic3.gov</a></div></div>' +

      '<div class="sufz-step"><b>3</b><div><strong>Report to the FTC, and pick the right site</strong>' +
      'Use <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener">reportfraud.ftc.gov</a> for a scam or fraudulent transfer. Use <a href="https://www.identitytheft.gov" target="_blank" rel="noopener">identitytheft.gov</a> instead if someone used the identity to open accounts, because it produces an <strong>FTC Identity Theft Report</strong>, which forces the credit bureaus to block fraudulent accounts from the file and stops collectors chasing the debt.</div></div>' +

      '<div class="sufz-step"><b>4</b><div><strong>File a police report and keep the number</strong>' +
      'Banks and bureaus ask for it, and without one the dispute stalls. Ask whether the agency has an economic or financial crimes unit, and be ready for the answer to be no.</div></div>' +

      '<div class="sufz-step"><b>5</b><div><strong>If the victim is over 60, get a case manager</strong>' +
      'The Justice Department’s <strong>National Elder Fraud Hotline</strong> assigns one person who walks you through reporting at every level. <a href="tel:+18333728311">(833) 372-8311</a>, weekdays 10am to 6pm Eastern.</div></div>' +

      '<div class="sufz-step"><b>6</b><div><strong>Close the doors still open</strong>' +
      'Whoever took the money has the details to take more. Place a <a href="#" data-sufz-goto="Alert">fraud alert</a> today and <a href="#" data-sufz-goto="Freeze">freeze all three credit files</a>.</div></div>' +

      '<div class="sufz-key" style="border-left-color:#B08D2E;background:rgba(176,141,46,.12)"><strong>Expect a second wave.</strong> Victim lists get resold, and the next call promises to recover what was taken. The FBI works with no law firm and no crypto service to recover funds and will never contact you for money. Anyone phoning to offer that is running the second half of the same scheme.</div>' +

      '<div class="sufz-key"><strong>What the bank will argue.</strong> Banks draw a line between a transfer someone else made without permission, where federal law gives real reimbursement rights, and one the customer was tricked into sending themselves, where they often say those rights do not apply. Expect that argument, and do not treat the first refusal as final.</div>' +
      '</div>' +

      /* Freeze pane */
      '<div class="sufz-pane" id="' + p + 'paneFreeze" style="display:none">' +
      '<p class="sufz-h">Free credit freeze letters</p>' +
      '<p class="sufz-sub">A freeze blocks the credit check a new account depends on. It is free, and it has to be placed at each bureau separately, so this writes all three letters.</p>' +

      '<div class="sufz-seg" role="group" aria-label="Who is the freeze for">' +
      '<button type="button" id="' + p + 'self" aria-pressed="true">Myself</button>' +
      '<button type="button" id="' + p + 'fid" aria-pressed="false">Someone I care for</button></div>' +
      '<p class="sufz-note" id="' + p + 'note"></p>' +

      '<div class="sufz-grid">' +
      field('c6', p + 'name', 'Full legal name', '', 'Jane Doe') +
      field('c6', p + 'line1', 'Street address', '', '123 Main Street') +
      field('c3', p + 'city', 'City', '', 'Miami') +
      field('c1', p + 'state', 'State', '', 'FL', ' maxlength="2" style="text-transform:uppercase"') +
      field('c2', p + 'zip', 'ZIP', '', '33131', ' maxlength="10" inputmode="numeric"') +
      field('c6', p + 'dob', 'Date of birth', 'optional', 'March 14, 1940') +
      '</div>' +

      '<div class="sufz-fid" id="' + p + 'fidwrap" style="display:none"><p>About you, the person signing and mailing</p>' +
      '<div class="sufz-grid">' +
      field('c3', p + 'fidname', 'Your full name', '', 'John Doe') +
      '<label class="sufz-f c3"><span>Your authority</span><select id="' + p + 'cap">' +
      '<option value="power-of-attorney">Agent under a durable power of attorney</option>' +
      '<option value="guardian">Court-appointed guardian</option>' +
      '<option value="conservator">Court-appointed conservator</option></select></label>' +
      field('c3', p + 'fidphone', 'Your phone', 'optional', '(954) 555-1234') +
      field('c3', p + 'authdate', 'Date your document was signed', 'optional', 'January 5, 2020') +
      '</div></div>' +

      '<div class="sufz-file"><label><span style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px" ' +
      'id="' + p + 'attachLabel"></span>' +
      '<input id="' + p + 'files" type="file" accept="image/*" multiple></label>' +
      '<p id="' + p + 'attachNote"></p></div>' +

      '<div class="sufz-act"><button type="button" class="sufz-btn" id="' + p + 'gen">Write my three letters</button>' +
      '<button type="button" class="sufz-btn alt" id="' + p + 'print" style="display:none">Print all three</button>' +
      '<span class="sufz-priv">Nothing you type leaves this page</span></div>' +
      '<p class="sufz-err" id="' + p + 'err" style="display:none"></p>' +

      '<div class="sufz-out" id="' + p + 'out"><div class="sufz-tabs" role="tablist" id="' + p + 'tabs"></div>' +
      '<div class="sufz-caution" id="' + p + 'caution" style="display:none"></div>' +
      '<div class="sufz-letter" id="' + p + 'body"></div></div>' +
      '</div>' +

      /* Disclaimer, travels with every embed */
      '<div class="sufz-foot">' +
      '<strong>Not legal advice.</strong> This tool writes template letters from published federal law and ' +
      'from the procedures each bureau publishes. That makes it general information rather than advice about ' +
      'your situation, and using it creates no attorney-client relationship.<br>' +
      '<strong>Contact details change.</strong> The bureaus set their own mailing addresses, phone numbers ' +
      'and document requirements, and they move them without notice. Confirm yours before you mail or call.<br>' +
      'Addresses, enclosures and numbers last verified <strong>' + VERIFIED + '</strong>. ' +
      (showCredit
        ? 'Credit freeze letters by Klagge Law, PLLC. Full guide and the fraud hotline list at ' +
          '<a href="' + TOOL + '">stepuplaw.com</a>.'
        : '') +
      '</div>';

    wire(root, p);
  }

  function wire(root, p) {
    var $ = function (id) { return document.getElementById(p + id); };
    var mode = 'self', current = null, attachments = [];

    /* Top-level tabs, ordered by how fast the visitor has to move. */
    var TOPS = ['Alert', 'Freeze', 'Stolen'];
    function setTop(which) {
      TOPS.forEach(function (t) {
        var on = t === which;
        if ($('tab' + t)) $('tab' + t).setAttribute('aria-selected', on ? 'true' : 'false');
        if ($('pane' + t)) $('pane' + t).style.display = on ? 'block' : 'none';
      });
    }
    TOPS.forEach(function (t) {
      if ($('tab' + t)) $('tab' + t).addEventListener('click', function () { setTop(t); });
    });
    // Anything carrying data-sufz-goto switches tabs from inside a pane.
    [].forEach.call(root.querySelectorAll('[data-sufz-goto]'), function (el) {
      el.addEventListener('click', function () { setTop(el.getAttribute('data-sufz-goto')); });
    });

    if ($('bankPick')) {
      $('bankPick').addEventListener('change', function () {
        var b = BANKS[this.value];
        if (!b) { $('bankOut').style.display = 'none'; return; }
        $('bankOut').innerHTML = '<a href="tel:+1' + b.t + '">' + esc(b.s) + '</a><span>' + esc(b.h) + '</span>';
        $('bankOut').style.display = 'block';
      });
    }

    var ATTACH_DEFAULT = 'Each bureau needs its own copy of everything you enclose. Attach the pages once and they print behind all three letters, so every envelope gets a full set.';

    function setMode(m) {
      mode = m;
      $('self').setAttribute('aria-pressed', m === 'self' ? 'true' : 'false');
      $('fid').setAttribute('aria-pressed', m === 'fiduciary' ? 'true' : 'false');
      $('fidwrap').style.display = m === 'fiduciary' ? 'block' : 'none';
      $('attachLabel').innerHTML = m === 'self'
        ? 'Attach a photo or scan of your ID <em style="font-style:normal;font-weight:400;color:var(--sufz-mut)">optional</em>'
        : 'Attach your power of attorney, guardianship or conservatorship document, and the two IDs <em style="font-style:normal;font-weight:400;color:var(--sufz-mut)">optional</em>';
      $('note').innerHTML = m === 'self'
        ? 'A freeze is not shared between bureaus, so all three letters are needed. Freezing at Equifax does nothing at Experian or TransUnion. You can also place your own online in about fifteen minutes per bureau.'
        : 'This is the protected consumer freeze. All three bureaus handle it by mail only, so a letter is the only route, and each bureau needs its own letter and its own copies.';
      $('out').style.display = 'none';
      $('print').style.display = 'none';
    }
    $('self').addEventListener('click', function () { setMode('self'); });
    $('fid').addEventListener('click', function () { setMode('fiduciary'); });
    $('attachNote').textContent = ATTACH_DEFAULT;
    setMode('self');
    // Must match the capitalised ids in TOPS. Lowercase here silently matched
    // nothing, which deselected every tab and hid every pane.
    setTop('Alert');

    /* Document processor. Read locally into data URLs, kept in memory only, so
       the file never leaves the browser any more than the typed fields do. */
    $('files').addEventListener('change', function () {
      var files = [].slice.call(this.files || []);
      attachments = [];
      if (!files.length) { $('attachNote').textContent = ATTACH_DEFAULT; return; }
      var slots = new Array(files.length), pending = files.length;
      function done() {
        attachments = slots.filter(Boolean);
        var c = attachments.length;
        $('attachNote').textContent = c === 0
          ? 'Those files could not be read. Try a JPG or PNG photo of the document.'
          : c + (c === 1 ? ' page attached. It prints' : ' pages attached. They print') +
            ' behind each of the three letters, so every envelope gets a full set.';
      }
      files.forEach(function (f, i) {
        var r = new FileReader();
        r.onload = function () { slots[i] = r.result; if (!--pending) done(); };
        r.onerror = function () { if (!--pending) done(); };
        r.readAsDataURL(f);
      });
    });

    function v(id) { return ($(id).value || '').trim(); }

    function build() {
      var name = v('name'), line1 = v('line1'), city = v('city');
      var state = v('state').toUpperCase(), zip = v('zip'), dob = v('dob');
      var miss = [];
      if (!name) miss.push('the name');
      if (!line1) miss.push('the street address');
      if (!city) miss.push('the city');
      if (!state) miss.push('the state');
      if (!zip) miss.push('the ZIP');
      if (mode === 'fiduciary' && !v('fidname')) miss.push('your own name');
      if (miss.length) return { error: 'Still need ' + miss.join(', ') + '.' };

      var addr = line1 + ', ' + city + ', ' + state + ' ' + zip;
      var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      var dobLine = dob ? 'Date of birth: ' + dob : '';
      var sig, subject, paras, capDoc;
      // Two bureaus want a Social Security number on a mailed request. The widget
      // will not collect one, so the letter prints a blank line and the number is
      // written on paper by hand, never typed into a computer.
      var SSN_LINE = 'Social Security number: ____________________';

      if (mode === 'self') {
        subject = 'Request for a Security Freeze, ' + name;
        paras = [
          'I am requesting a security freeze on my own credit file under the Fair Credit Reporting Act, 15 U.S.C. §1681c-1.',
          'Please place a security freeze on my file effective immediately, and send written confirmation, along with the PIN or password I will need to lift it later, to the address below.',
          [name, addr, dobLine, SSN_LINE, 'Addresses for the past two years: ____________________'].filter(Boolean).join('\n')
        ];
        sig = { name: name, capacity: '', addr: addr, phone: '' };
      } else {
        var cap = CAPACITY[$('cap').value];
        var statute = state === 'FL'
          ? 'under 15 U.S.C. §1681c-1 and Fla. Stat. §501.0051'
          : 'under 15 U.S.C. §1681c-1';
        var dc = v('authdate') ? ' dated ' + v('authdate') : '';
        subject = 'Request for a Protected Consumer Security Freeze on Behalf of ' + name;
        paras = [
          'I am writing ' + statute + ' to request a security freeze on the credit file of ' + name + ', who is unable to place this freeze themselves. I am acting as their ' + cap.label + dc + ', and I have enclosed a copy of my ' + cap.doc + '.',
          'Please place a security freeze on this consumer’s file effective immediately, and send written confirmation to the address below. I have enclosed the documents listed at the end of this letter. Please let me know if any further documentation is required.',
          [name, addr, dobLine, SSN_LINE].filter(Boolean).join('\n')
        ];
        sig = { name: v('fidname'), capacity: cap.label + ' for ' + name, addr: addr, phone: v('fidphone') };
        capDoc = cap.doc;
      }

      return {
        date: today,
        letters: ['Equifax', 'Experian', 'TransUnion'].map(function (b) {
          var spec = BUREAUS[b][mode];
          return {
            bureau: b, to: spec.to, subject: subject, paras: paras,
            encl: spec.encl || fiduciaryEnclosures(b, capDoc, name),
            caution: spec.caution, sig: sig
          };
        })
      };
    }

    function body(l, date) {
      return '<p>' + esc(date) + '</p><address>' + l.to.map(esc).join('<br>') + '</address>' +
        '<p><strong>Re:</strong> ' + esc(l.subject) + '</p><p>To Whom It May Concern:</p>' +
        l.paras.map(function (x) { return '<p>' + esc(x).replace(/\n/g, '<br>') + '</p>'; }).join('') +
        '<p>Sincerely,</p><p style="margin-top:1.6em">____________________________<br>' + esc(l.sig.name) + '<br>' +
        (l.sig.capacity ? esc(l.sig.capacity) + '<br>' : '') + esc(l.sig.addr) +
        (l.sig.phone ? '<br>' + esc(l.sig.phone) : '') + '</p>' +
        '<p style="font-size:.95em"><strong>Enclosures:</strong> ' + l.encl.map(esc).join('; ') + '</p>';
    }

    function show(i) {
      var tabs = $('tabs').children;
      for (var k = 0; k < tabs.length; k++) tabs[k].setAttribute('aria-selected', k === i ? 'true' : 'false');
      var l = current.letters[i];
      // Guidance for the sender, shown on screen only. It never prints.
      $('caution').innerHTML = l.caution
        ? '<strong>Before you mail the ' + esc(l.bureau) + ' letter.</strong> ' + esc(l.caution) : '';
      $('caution').style.display = l.caution ? 'block' : 'none';
      $('body').innerHTML = body(l, current.date);
    }

    $('gen').addEventListener('click', function () {
      var r = build();
      if (r.error) { $('err').textContent = r.error; $('err').style.display = 'block'; return; }
      $('err').style.display = 'none';
      current = r;
      $('tabs').innerHTML = '';
      r.letters.forEach(function (l, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = l.bureau;
        b.addEventListener('click', function () { show(i); });
        $('tabs').appendChild(b);
      });
      show(0);
      $('out').style.display = 'block';
      $('print').style.display = 'inline-block';
    });

    $('print').addEventListener('click', function () {
      if (!current) return;
      var attach = attachments.map(function (src) {
        return '<section class="att"><img src="' + src + '" alt=""></section>';
      }).join('');
      var doc = '<!doctype html><html><head><meta charset="utf-8"><title>Credit Freeze Letters</title><style>' +
        'body{font-family:Georgia,"Times New Roman",serif;font-size:12pt;line-height:1.5;color:#111;margin:0}' +
        'section{max-width:6.5in;margin:0 auto;padding:1in 0;page-break-after:always}' +
        'section:last-child{page-break-after:auto}address{font-style:normal;margin:1.5em 0}' +
        'section.att{padding:.5in 0;text-align:center}section.att img{max-width:100%;max-height:9in}' +
        '</style></head><body>' +
        current.letters.map(function (l) {
          // Each bureau gets its letter followed by its own copy of every
          // attachment, so the printout splits cleanly into three envelopes.
          return '<section>' + body(l, current.date) + '</section>' + attach;
        }).join('') + '</body></html>';
      var f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true');
      f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(f);
      var d = f.contentWindow.document;
      d.open(); d.write(doc); d.close();
      f.contentWindow.focus();
      setTimeout(function () {
        f.contentWindow.print();
        setTimeout(function () { document.body.removeChild(f); }, 1500);
      }, 250);
    });
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-stepup-freeze]');
    if (!nodes.length) return;
    injectCss();
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute('data-sufz-ready')) continue;
      nodes[i].setAttribute('data-sufz-ready', '1');
      render(nodes[i], i);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
