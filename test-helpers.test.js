import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Button,
  ButtonV2,
  Carousel,
  AIRich,
  Rich,
  Toolkit,
  extractIE,
  tokenizeCode,
  tokenizeCodeV2,
  toTableMetadataV2,
  generateTableContentV2,
  generateCodeBlockContentV2,
  generateLinkContentV2,
  generateLatexContent,
  sanitizeQuotedMessage,
  safeGenMsgId,
  captureUnifiedResponse,
  generateUnifiedResponseContent
} from './lib/index.js';

test('tokenizeCode and tokenizeCodeV2 accurately highlight code in multiple languages', () => {
  const jsCode = 'const count = 42; \n console.log(count);';
  const tokens = tokenizeCode(jsCode, 'javascript');
  assert.ok(tokens.length >= 2);
  const keywordToken = tokens.find(t => t.codeContent && t.codeContent.trim() === 'const');
  assert.ok(keywordToken);
  assert.equal(keywordToken.highlightType, 1);

  const v2 = tokenizeCodeV2('def calculate(x):\n    return x * 2', 'python');
  assert.ok(v2.unified_codeBlock.length > 0);
  assert.ok(v2.unified_codeBlock.some(b => b.text.includes('def') && b.type === 'KEYWORD'));
  assert.ok(v2.unified_codeBlock.some(b => b.text.includes('return') && b.type === 'KEYWORD'));
});

test('extractIE accurately extracts hyperlinks, citations, and latex expressions', () => {
  const input = 'Read [Docs](https://baileys.wiki) and untrusted [Evil](!https://evil.com) plus citation [](https://source.com) and formula [E=mc^2|120|60]<https://latex.codecogs.com/png.latex>';
  const res = extractIE(input);
  assert.ok(res.text.includes('{{HYPERLINK_0}}'));
  assert.ok(res.text.includes('{{HYPERLINK_1}}'));
  assert.ok(res.text.includes('{{CITATION_0}}'));
  assert.ok(res.text.includes('{{LATEX_0}}'));
  assert.equal(res.inline_entities.length, 4);

  const link = res.inline_entities[0];
  assert.equal(link.metadata.__typename, 'GenAIInlineLinkItem');
  assert.equal(link.metadata.display_name, 'Docs');
  assert.equal(link.metadata.is_trusted, true);

  const untrusted = res.inline_entities[1];
  assert.equal(untrusted.metadata.is_trusted, false);

  const citation = res.inline_entities[2];
  assert.equal(citation.metadata.__typename, 'GenAISearchCitationItem');

  const latex = res.inline_entities[3];
  assert.equal(latex.metadata.__typename, 'GenAILatexItem');
  assert.equal(latex.metadata.latex_expression, 'E=mc^2');
  assert.equal(latex.metadata.latex_image.width, 120);
});

test('toTableMetadataV2 parses markdown pipes, commas, and multi-row delimiters', () => {
  const data = [
    'Leaderboard',
    'Rank | Player | Score',
    '#1 | Alice | 9950;;#2 | Bob | 8420',
    '#3 | Charlie | 7300'
  ];
  const table = toTableMetadataV2(data);
  assert.equal(table.title, 'Leaderboard');
  assert.equal(table.rows.length, 4);
  assert.equal(table.rows[0].isHeading, true);
  assert.equal(table.rows[0].items[0], 'Rank');
  assert.equal(table.rows[1].items[1], 'Alice');
  assert.equal(table.rows[2].items[1], 'Bob');
  assert.equal(table.rows[3].items[1], 'Charlie');
});

test('Button builder chains all native flow button types and builds valid WAMessage', async () => {
  const btn = new Button()
    .setTitle('Interactive Hub')
    .setSubtitle('Select an action')
    .setBody('Welcome to the next generation of WhatsApp automation')
    .setFooter('Powered by baileys-rec v1.4.0')
    .addReply('Quick Ping', 'btn_ping')
    .addUrl('Documentation', 'https://github.com/KazeDevID/baileys-rec', true)
    .addCopy('Copy Coupon', 'DISCOUNT2026')
    .addCall('Help Desk', '+123456789')
    .addSelection('Select Category')
    .makeSection('Products', 'Featured')
    .makeRow('Pro Plan', 'Monthly Subscription', 'Full access', 'plan_pro')
    .addLocationRequest('Share Coordinates')
    .addFlow('flow_demo_id', { display_text: 'Open Survey' })
    .addAddressRequest('Shipping Destination')
    .addReviewOrder({ reference_id: 'REF_999', order: { items: [{ name: 'Book', price: 100 }] } })
    .addReminder('Team Meeting', 1731500000)
    .addCancelReminder('Cancel Sync', 'rem_sync')
    .addCatalog('View Products', '628123456789@s.whatsapp.net');

  assert.equal(btn._buttons.length, 12);

  const jid = '628123456789@s.whatsapp.net';
  const msg = await btn.build(jid);
  assert.ok(msg.message.viewOnceMessage, 'Must be wrapped in viewOnceMessage');
  const inner = msg.message.viewOnceMessage.message.interactiveMessage;
  assert.equal(inner.header.title, 'Interactive Hub');
  assert.equal(inner.body.text, 'Welcome to the next generation of WhatsApp automation');
  assert.equal(inner.footer.text, 'Powered by baileys-rec v1.4.0');
  assert.equal(inner.nativeFlowMessage.buttons.length, 12);

  const card = await btn.toCard();
  assert.equal(card.header.title, 'Interactive Hub');
  assert.equal(card.body.text, 'Welcome to the next generation of WhatsApp automation');
  assert.equal(card.nativeFlowMessage.buttons.length, 12);
});

test('Button.send relays with appropriate biz and bot binary nodes', async () => {
  let relayCalled = false;
  let relayedJid = null;
  let relayedNodes = null;

  const mockSocket = {
    relayMessage: async (jid, message, options) => {
      relayCalled = true;
      relayedJid = jid;
      relayedNodes = options.additionalNodes;
      return { key: { id: options.messageId || 'MOCK_ID', remoteJid: jid } };
    }
  };

  const btn = new Button(mockSocket)
    .setBody('Click here')
    .addReply('Hello', 'btn_hello');

  await btn.send('628123456789@s.whatsapp.net');
  assert.ok(relayCalled);
  assert.equal(relayedJid, '628123456789@s.whatsapp.net');
  assert.ok(relayedNodes.some(n => n.tag === 'biz'));
  assert.ok(relayedNodes.some(n => n.tag === 'bot'));

  relayCalled = false;
  await btn.send('120363024567890@g.us');
  assert.ok(relayCalled);
  assert.equal(relayedJid, '120363024567890@g.us');
  assert.ok(relayedNodes.some(n => n.tag === 'biz'));
  assert.ok(!relayedNodes.some(n => n.tag === 'bot'), 'Bot node should not be present in group');
});

test('ButtonV2 builds legacy viewOnce button message', async () => {
  const btn2 = new ButtonV2()
    .setTitle('Header Title')
    .setBody('Legacy Choice')
    .setFooter('Legacy Footer')
    .addButton('Yes', 'btn_yes')
    .addButton('No', 'btn_no');

  const msg = await btn2.build('628123456789@s.whatsapp.net');
  const bm = msg.message.buttonsMessage;
  assert.ok(bm, 'buttonsMessage must exist');
  assert.equal(bm.contentText, 'Legacy Choice');
  assert.equal(bm.buttons.length, 2);
  assert.equal(bm.buttons[0].buttonText.displayText, 'Yes');
});

test('Carousel builds multi-card swipeable message with Button instances', async () => {
  const c1 = new Button().setTitle('Card A').setBody('Body A').addReply('Buy A', 'a_1');
  const c2 = new Button().setTitle('Card B').setBody('Body B').addReply('Buy B', 'b_1');

  const carousel = new Carousel()
    .setBody('Explore catalog')
    .setFooter('Swipe cards')
    .addCard([c1, c2]);

  const msg = await carousel.build('628123456789@s.whatsapp.net');
  const cm = msg.message.interactiveMessage.carouselMessage;
  assert.ok(cm);
  assert.equal(cm.cards.length, 2);
  assert.equal(cm.cards[0].header.title, 'Card A');
  assert.equal(cm.cards[1].header.title, 'Card B');
});

test('AIRich and Rich builders construct Meta GenAI rich responses with unifiedResponse base64', async () => {
  const rich = new AIRich()
    .setTitle('AI Code Helper')
    .addText('Check [Documentation](https://wa.me) for full details.')
    .addCode('python', 'print("Hello Baileys")')
    .addTable([['Col 1', 'Col 2'], ['Val 1', 'Val 2']])
    .addSource([['https://example.com/icon.png', 'https://example.com', 'Source Title']])
    .addTip('Pro-tip: Keep your tokens secure')
    .addSuggest(['Try next query', 'Explain code'])
    .setFooter('Generated by AI');

  const msg = await rich.build();
  assert.ok(msg.botForwardedMessage);
  const richResp = msg.botForwardedMessage.message.richResponseMessage;
  assert.equal(richResp.submessages.length, 4);
  assert.ok(richResp.unifiedResponse.data, 'unifiedResponse data must be populated');

  const decoded = JSON.parse(Buffer.from(richResp.unifiedResponse.data, 'base64').toString('utf8'));
  assert.ok(decoded.response_id);
  assert.ok(decoded.sections.length >= 6);
});

test('Standalone rich content generators produce valid message envelopes', () => {
  const tbl = generateTableContentV2(['Stats', 'A | B', '1 | 2']);
  assert.ok(tbl.message.botForwardedMessage);
  assert.ok(tbl.messageId.startsWith('BAE5') || tbl.messageId.startsWith('3EB0'));

  const code = generateCodeBlockContentV2('const x = 10;', null, { language: 'javascript' });
  assert.ok(code.message.botForwardedMessage);

  const link = generateLinkContentV2('Overview', ['https://example.com']);
  assert.ok(link.message.botForwardedMessage);

  const latex = generateLatexContent(null, { text: 'Physics', expressions: [{ latexExpression: 'E=mc^2', url: 'https://test.com/eq.png', width: 50, height: 25 }] });
  assert.ok(latex.message.botForwardedMessage);
});

test('captureUnifiedResponse and generateUnifiedResponseContent extract and resend rich responses', () => {
  const mockMsg = {
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          unifiedResponse: { data: 'eyJ0ZXN0IjoxMjN9' },
          submessages: [{ messageType: 2, messageText: 'Captured' }],
          contextInfo: { isForwarded: true }
        }
      }
    }
  };

  const captured = captureUnifiedResponse(mockMsg);
  assert.ok(captured);
  assert.equal(captured.submessages[0].messageText, 'Captured');

  const regenerated = generateUnifiedResponseContent(null, captured);
  assert.ok(regenerated.message.botForwardedMessage);
});

test('sanitizeQuotedMessage cleanly normalizes various quoted structures', () => {
  assert.equal(sanitizeQuotedMessage(null), undefined);
  assert.equal(sanitizeQuotedMessage('plain string'), undefined);

  const validQuoted = {
    key: { remoteJid: '628123456789@s.whatsapp.net', id: 'Q123', fromMe: false },
    message: { conversation: 'Original message' }
  };
  const sanitized = sanitizeQuotedMessage(validQuoted);
  assert.equal(sanitized.key.id, 'Q123');
  assert.equal(sanitized.message.conversation, 'Original message');

  const textOnlyQuoted = {
    key: { remoteJid: '628123456789@s.whatsapp.net', id: 'Q124' },
    body: 'Text only quote'
  };
  const sanitized2 = sanitizeQuotedMessage(textOnlyQuoted);
  assert.equal(sanitized2.message.conversation, 'Text only quote');
});

test("Button fluent suite chains addProduct, addProductList, addPixPayment, addPaymentStatus, addWebview, addCallPermission", async () => {
  const btn = new Button()
    .setTitle("Catalog & Payments")
    .setBody("Explore our shop directly via WA Proto without Meta Cloud tokens")
    .setFooter("Powered by Baileys-Rec")
    .addProduct("PROD_SHOES_42", "CATALOG_INDONESIA", "Lihat Sepatu")
    .addProductList("CATALOG_INDONESIA", [{ title: "Kategori Pilihan", product_items: [{ product_retailer_id: "P1" }] }], "Jelajahi")
    .addPixPayment("user@pix.com.br", 25000, "Toko Kaze", "Bayar via Pix")
    .addPaymentStatus("REF_9988", "success", { currency: "IDR", amount: { value: 2500000, offset: 100 } })
    .addWebview("https://kazedev.id", "Buka Web", "Portal Toko")
    .addCallPermission("Minta Panggilan Audio");

  const built = await btn.build("628123456789@s.whatsapp.net");
  const inner = built.message?.viewOnceMessage?.message?.interactiveMessage || built.message?.interactiveMessage;
  const nativeFlow = inner.nativeFlowMessage;
  assert.ok(nativeFlow, "nativeFlowMessage must exist");
  assert.equal(nativeFlow.buttons.length, 6);
  assert.equal(nativeFlow.buttons[0].name, "single_product");
  assert.equal(nativeFlow.buttons[1].name, "product_list");
  assert.equal(nativeFlow.buttons[2].name, "review_and_pay");
  assert.equal(nativeFlow.buttons[3].name, "payment_status_update");
  assert.equal(nativeFlow.buttons[4].name, "open_webview");
  assert.equal(nativeFlow.buttons[5].name, "call_permission_request");
});
