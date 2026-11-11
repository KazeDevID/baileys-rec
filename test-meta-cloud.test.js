import test from 'node:test';
import assert from 'node:assert/strict';
import {
    fromCloudApiMessage,
    toCloudApiMessage,
    sanitizeWhatsAppNumber,
    diagnoseMetaCloudApiError,
    ButtonBuilder,
    MessageBuilder
} from './lib/Utils/cloud-api-utils.js';
import {
    generateWAMessageContent,
    shouldIncludeBizBinaryNode
} from './lib/Utils/messages.js';

test('sanitizeWhatsAppNumber removes symbols, whatsapp suffix and normalizes national prefix', () => {
    assert.equal(sanitizeWhatsAppNumber('+62 812-3456-7890'), '6281234567890');
    assert.equal(sanitizeWhatsAppNumber('6281234567890@s.whatsapp.net'), '6281234567890');
    assert.equal(sanitizeWhatsAppNumber('081234567890'), '6281234567890');
    assert.equal(sanitizeWhatsAppNumber('14155552671'), '14155552671');
});

test('fromCloudApiMessage converts text and preview_url properly', () => {
    const payload = {
        messaging_product: 'whatsapp',
        to: '6281234567890',
        type: 'text',
        text: { preview_url: true, body: 'Check https://example.com' }
    };
    const baileys = fromCloudApiMessage(payload);
    assert.equal(baileys.text, 'Check https://example.com');
});

test('fromCloudApiMessage converts interactive buttons with header text, body, footer', () => {
    const payload = {
        messaging_product: 'whatsapp',
        to: '6281234567890',
        type: 'interactive',
        interactive: {
            type: 'button',
            header: { type: 'text', text: 'Important Notice' },
            body: { text: 'Do you confirm this booking?' },
            footer: { text: 'Bot Services' },
            action: {
                buttons: [
                    { type: 'reply', reply: { id: 'btn_yes', title: 'Yes, Confirm' } },
                    { type: 'reply', reply: { id: 'btn_no', title: 'Cancel' } }
                ]
            }
        }
    };
    const baileys = fromCloudApiMessage(payload);
    assert.equal(baileys.title, 'Important Notice');
    assert.equal(baileys.text, 'Do you confirm this booking?');
    assert.equal(baileys.footer, 'Bot Services');
    assert.equal(baileys.nativeFlow.length, 2);
    assert.equal(baileys.nativeFlow[0].id, 'btn_yes');
    assert.equal(baileys.nativeFlow[0].text, 'Yes, Confirm');
});

test('generateWAMessageContent wraps interactive messages in viewOnceMessage with messageVersion: 1', async () => {
    const payload = {
        messaging_product: 'whatsapp',
        type: 'interactive',
        interactive: {
            type: 'button',
            header: { type: 'text', text: 'HEADER TITLE' },
            body: { text: 'Silakan pilih tindakan:' },
            footer: { text: 'baileys-rec' },
            action: {
                buttons: [
                    { type: 'reply', reply: { id: 'act_1', title: 'Lanjutkan' } }
                ]
            }
        }
    };
    const content = await generateWAMessageContent(payload, {});
    assert.ok(content.viewOnceMessage, 'Must be wrapped in viewOnceMessage for WhatsApp to display');
    const inner = content.viewOnceMessage.message.interactiveMessage;
    assert.ok(inner, 'Inner interactiveMessage must exist');
    assert.equal(inner.header?.title, 'HEADER TITLE');
    assert.equal(inner.body?.text, 'Silakan pilih tindakan:');
    assert.equal(inner.footer?.text, 'baileys-rec');
    assert.equal(inner.nativeFlowMessage?.messageVersion, 1, 'messageVersion must be 1');
    assert.equal(inner.nativeFlowMessage?.buttons?.length, 1);
    assert.ok(shouldIncludeBizBinaryNode(content), 'Biz binary node must be included');
});

test('generateWAMessageContent supports carousel with swipeable cards and messageVersion 1', async () => {
    const carouselPayload = {
        messaging_product: 'whatsapp',
        type: 'interactive',
        interactive: {
            type: 'carousel',
            body: { text: 'Featured Items' },
            action: {
                cards: [
                    {
                        header: { text: 'Product 1' },
                        body: { text: 'Best item 1' },
                        buttons: [{ id: 'buy_1', text: 'Buy Now' }]
                    },
                    {
                        header: { text: 'Product 2' },
                        body: { text: 'Best item 2' },
                        buttons: [{ id: 'buy_2', text: 'Buy Later' }]
                    }
                ]
            }
        }
    };
    const content = await generateWAMessageContent(carouselPayload, {});
    assert.ok(content.viewOnceMessage, 'Carousel must be wrapped in viewOnceMessage');
    const inner = content.viewOnceMessage.message.interactiveMessage;
    assert.equal(inner.carouselMessage?.cards?.length, 2);
    assert.equal(inner.carouselMessage?.messageVersion, 1);
    assert.equal(inner.carouselMessage?.cards[0]?.nativeFlowMessage?.messageVersion, 1);
    assert.ok(shouldIncludeBizBinaryNode(content), 'Biz binary node must be included for carousel');
});

test('toCloudApiMessage converts buttons and safely handles >3 buttons by converting to list', () => {
    const manyButtons = [
        { id: '1', text: 'Opt 1' },
        { id: '2', text: 'Opt 2' },
        { id: '3', text: 'Opt 3' },
        { id: '4', text: 'Opt 4' }
    ];
    const cloudMsg = toCloudApiMessage({ text: 'Pick one', buttons: manyButtons }, '+6281234567890');
    assert.equal(cloudMsg.to, '6281234567890');
    assert.equal(cloudMsg.type, 'interactive');
    assert.equal(cloudMsg.interactive.type, 'list', 'Should convert to list because Meta Cloud API strictly forbids >3 quick reply buttons');
});

test('diagnoseMetaCloudApiError detects 24h window expiration, token issues, and sandbox whitelist', () => {
    const diag24h = diagnoseMetaCloudApiError({ code: 131047, message: 'More than 24 hours elapsed' });
    assert.ok(diag24h.title.includes('24h Rule'));

    const diagWhitelist = diagnoseMetaCloudApiError({ code: 131030, message: 'Recipient phone number not in allowed list' });
    assert.ok(diagWhitelist.title.includes('Sandbox Whitelist'));

    const diagToken = diagnoseMetaCloudApiError({ code: 190, message: 'Access token expired' });
    assert.ok(diagToken.title.includes('Access Token Expired'));
});
