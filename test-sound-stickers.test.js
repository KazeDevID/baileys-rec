import test from 'node:test';
import assert from 'node:assert';
import { proto } from './WAProto/index.js';
import {
    prepareSoundStickerMessage,
    generateWAMessageContent,
    getContentType,
    normalizeMessageContent
} from './lib/Utils/messages.js';

test('Sound Sticker: prepareSoundStickerMessage constructs audioStickerMessage envelope and nested audioMessage', async () => {
    const fakeUpload = async () => ({
        mediaUrl: 'https://mmg.whatsapp.net/v/t62.7119-24/mock-media.bin',
        directPath: '/v/t62.7119-24/mock-media.bin'
    });

    const stickerBuffer = Buffer.from('RIFF....WEBPVP8X....', 'utf8');
    const audioBuffer = Buffer.from('OggS....OpusHead....', 'utf8');

    const result = await prepareSoundStickerMessage({
        soundSticker: {
            sticker: stickerBuffer,
            audio: audioBuffer,
            isAnimated: true,
            accessibilityLabel: 'Dancing Cat with Meow Sound',
            emojis: ['🐱', '🎵']
        }
    }, {
        upload: fakeUpload
    });

    assert.ok(result.audioStickerMessage, 'Should contain audioStickerMessage future-proof envelope');
    assert.ok(result.stickerMessage, 'Should contain fallback stickerMessage');

    const innerSticker = result.audioStickerMessage.message?.stickerMessage;
    assert.ok(innerSticker, 'Inner stickerMessage should exist in envelope');
    assert.ok(innerSticker.audioMessage, 'Inner stickerMessage must contain audioMessage');
    assert.strictEqual(innerSticker.audioMessage.mimetype, 'audio/ogg; codecs=opus');
    assert.strictEqual(innerSticker.accessibilityLabel, 'Dancing Cat with Meow Sound');
    assert.strictEqual(innerSticker.isAnimated, true);
    assert.ok(innerSticker.emojis.includes('🐱'));
});

test('Sound Sticker: generateWAMessageContent routes { sticker, audio } and wraps properly', async () => {
    const fakeUpload = async () => ({
        mediaUrl: 'https://mmg.whatsapp.net/v/t62.7119-24/mock-media.bin',
        directPath: '/v/t62.7119-24/mock-media.bin'
    });

    const stickerBuffer = Buffer.from('WEBP_DATA', 'utf8');
    const audioBuffer = Buffer.from('AUDIO_OPUS_DATA', 'utf8');

    const content = await generateWAMessageContent({
        sticker: stickerBuffer,
        audio: audioBuffer,
        accessibilityLabel: 'Voice Sticker'
    }, {
        upload: fakeUpload
    });

    assert.ok(content.audioStickerMessage, 'Should construct audioStickerMessage');
    assert.strictEqual(getContentType(content), 'audioStickerMessage');

    const normalized = normalizeMessageContent(content);
    assert.ok(normalized.stickerMessage, 'normalizeMessageContent should unwrap to stickerMessage');
    assert.ok(normalized.stickerMessage.audioMessage, 'unwrapped stickerMessage must retain audioMessage');
});

test('Sound Sticker: Proto encode and decode preserves audio attachment', () => {
    const msg = proto.Message.create({
        audioStickerMessage: {
            message: {
                stickerMessage: {
                    url: 'https://mmg.whatsapp.net/v/sticker.webp',
                    isAnimated: true,
                    accessibilityLabel: 'Sound sticker sample',
                    audioMessage: {
                        url: 'https://mmg.whatsapp.net/v/audio.ogg',
                        mimetype: 'audio/ogg; codecs=opus',
                        seconds: 4,
                        ptt: false
                    }
                }
            }
        }
    });

    const encoded = proto.Message.encode(msg).finish();
    const decoded = proto.Message.decode(encoded);

    assert.ok(decoded.audioStickerMessage);
    const inner = decoded.audioStickerMessage.message.stickerMessage;
    assert.strictEqual(inner.url, 'https://mmg.whatsapp.net/v/sticker.webp');
    assert.strictEqual(inner.audioMessage.url, 'https://mmg.whatsapp.net/v/audio.ogg');
    assert.strictEqual(inner.audioMessage.seconds, 4);
});

import { serializeMessage } from "./lib/index.js";

test("Sound Sticker: serializeMessage unwraps audioStickerMessage and populates soundSticker", () => {
    const serialized = serializeMessage({
        key: { remoteJid: "6281234567890@s.whatsapp.net", fromMe: false, id: "MSG_SOUND_1" },
        message: {
            audioStickerMessage: {
                message: {
                    stickerMessage: {
                        url: "https://mmg.whatsapp.net/v/s.webp",
                        isAnimated: true,
                        accessibilityLabel: "Meow",
                        audioMessage: {
                            url: "https://mmg.whatsapp.net/v/a.ogg",
                            mimetype: "audio/ogg; codecs=opus",
                            seconds: 2
                        }
                    }
                }
            }
        }
    });

    assert.strictEqual(serialized.type, "stickerMessage");
    assert.ok(serialized.soundSticker);
    assert.strictEqual(serialized.soundSticker.accessibilityLabel, "Meow");
    assert.strictEqual(serialized.soundSticker.audio.seconds, 2);
});
