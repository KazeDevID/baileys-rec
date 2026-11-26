import test from 'node:test';
import assert from 'node:assert';
import { proto } from './WAProto/index.js';
import {
    CHAT_THEME_PRESETS,
    resolveChatThemeSetting,
    formatChatThemeProtocolMessage,
    hexToArgb
} from './lib/Utils/chat-theme-utils.js';
import { generateWAMessageContent } from './lib/Utils/messages.js';

test('Chat Theme: resolveChatThemeSetting resolves preset names case-insensitively', () => {
    const emerald = resolveChatThemeSetting('emerald');
    assert.strictEqual(emerald.colorSchemeId, 'EMERALD');
    assert.strictEqual(emerald.clearTheme, false);
    assert.strictEqual(emerald.solidColor.backgroundLightArgb, CHAT_THEME_PRESETS.EMERALD.lightArgb);
    assert.strictEqual(emerald.solidColor.backgroundDarkArgb, CHAT_THEME_PRESETS.EMERALD.darkArgb);
    assert.strictEqual(emerald.solidColor.isDoodleEnabled, true);

    const sunset = resolveChatThemeSetting('SUNSET');
    assert.strictEqual(sunset.colorSchemeId, 'SUNSET');
    assert.strictEqual(sunset.solidColor.backgroundLightArgb, CHAT_THEME_PRESETS.SUNSET.lightArgb);
});

test('Chat Theme: resolveChatThemeSetting supports custom hex colors and doodle toggle', () => {
    const custom = resolveChatThemeSetting({
        colorSchemeId: 'CYBER_VIBE',
        backgroundColor: '#00F0FF',
        darkColor: '#003366',
        isDoodleEnabled: false
    });

    assert.strictEqual(custom.colorSchemeId, 'CYBER_VIBE');
    assert.strictEqual(custom.solidColor.backgroundLightArgb, hexToArgb('#00F0FF'));
    assert.strictEqual(custom.solidColor.backgroundDarkArgb, hexToArgb('#003366'));
    assert.strictEqual(custom.solidColor.isDoodleEnabled, false);
});

test('Chat Theme: resolveChatThemeSetting handles clearTheme: true', () => {
    const cleared = resolveChatThemeSetting({ clearTheme: true });
    assert.strictEqual(cleared.clearTheme, true);
    assert.ok(cleared.settingTimestampMs > 0);
});

test('Chat Theme: formatChatThemeProtocolMessage produces CHAT_THEME_SETTING (34) protocolMessage', () => {
    const formatted = formatChatThemeProtocolMessage('OCEAN');
    assert.strictEqual(formatted.protocolMessage.type, proto.Message.ProtocolMessage.Type.CHAT_THEME_SETTING);
    assert.strictEqual(formatted.protocolMessage.chatThemeSetting.colorSchemeId, 'OCEAN');

    const encoded = proto.Message.ProtocolMessage.encode(formatted.protocolMessage).finish();
    const decoded = proto.Message.ProtocolMessage.decode(encoded);
    assert.strictEqual(decoded.type, proto.Message.ProtocolMessage.Type.CHAT_THEME_SETTING);
    assert.strictEqual(decoded.chatThemeSetting.colorSchemeId, 'OCEAN');
});

test('Chat Theme: generateWAMessageContent converts { chatTheme } into valid protocolMessage', async () => {
    const msg = await generateWAMessageContent({
        chatTheme: {
            colorSchemeId: 'LAVENDER',
            isDoodleEnabled: true
        }
    }, {});

    assert.ok(msg.protocolMessage);
    assert.strictEqual(msg.protocolMessage.type, proto.Message.ProtocolMessage.Type.CHAT_THEME_SETTING);
    assert.strictEqual(msg.protocolMessage.chatThemeSetting.colorSchemeId, 'LAVENDER');
});

import { serializeMessage, CHAT_THEME_PRESETS as EXPORTED_PRESETS } from "./lib/index.js";

test("Chat Theme: top-level exports and serializeMessage detect CHAT_THEME_SETTING for private & group chats", () => {
    assert.ok(EXPORTED_PRESETS.EMERALD);

    const groupSerialized = serializeMessage({
        key: { remoteJid: "120363000000000000@g.us", participant: "628111@s.whatsapp.net", fromMe: false, id: "MSG_THEME_1" },
        message: {
            protocolMessage: {
                type: 34,
                chatThemeSetting: {
                    colorSchemeId: "SUNSET",
                    clearTheme: false
                }
            }
        }
    });

    assert.strictEqual(groupSerialized.isGroup, true);
    assert.ok(groupSerialized.chatTheme);
    assert.strictEqual(groupSerialized.chatTheme.colorSchemeId, "SUNSET");
});
