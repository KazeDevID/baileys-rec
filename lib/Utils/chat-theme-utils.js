import { proto } from '../../WAProto/index.js';

/**
 * WhatsApp Chat Theme Color Presets
 */
export const CHAT_THEME_PRESETS = {
    DEFAULT: {
        id: 'DEFAULT',
        name: 'Default WhatsApp',
        colorSchemeId: 'DEFAULT',
        lightArgb: 0xFFFFFFFF,
        darkArgb: 0xFF121B22,
        isDoodleEnabled: true
    },
    EMERALD: {
        id: 'EMERALD',
        name: 'Emerald Teal',
        colorSchemeId: 'EMERALD',
        lightArgb: 0xFF128C7E,
        darkArgb: 0xFF075E54,
        isDoodleEnabled: true
    },
    OCEAN: {
        id: 'OCEAN',
        name: 'Deep Ocean Blue',
        colorSchemeId: 'OCEAN',
        lightArgb: 0xFF0284C7,
        darkArgb: 0xFF0369A1,
        isDoodleEnabled: true
    },
    MIDNIGHT: {
        id: 'MIDNIGHT',
        name: 'Midnight Slate',
        colorSchemeId: 'MIDNIGHT',
        lightArgb: 0xFF1E293B,
        darkArgb: 0xFF0F172A,
        isDoodleEnabled: false
    },
    LAVENDER: {
        id: 'LAVENDER',
        name: 'Lavender Purple',
        colorSchemeId: 'LAVENDER',
        lightArgb: 0xFF8B5CF6,
        darkArgb: 0xFF6D28D9,
        isDoodleEnabled: true
    },
    ROSE: {
        id: 'ROSE',
        name: 'Rose Berry',
        colorSchemeId: 'ROSE',
        lightArgb: 0xFFE11D48,
        darkArgb: 0xFFBE123C,
        isDoodleEnabled: true
    },
    SUNSET: {
        id: 'SUNSET',
        name: 'Sunset Orange',
        colorSchemeId: 'SUNSET',
        lightArgb: 0xFFEA580C,
        darkArgb: 0xFFC2410C,
        isDoodleEnabled: true
    },
    CYBERPUNK: {
        id: 'CYBERPUNK',
        name: 'Cyberpunk Cyan',
        colorSchemeId: 'CYBERPUNK',
        lightArgb: 0xFF06B6D4,
        darkArgb: 0xFF0891B2,
        isDoodleEnabled: false
    },
    AMBER: {
        id: 'AMBER',
        name: 'Golden Amber',
        colorSchemeId: 'AMBER',
        lightArgb: 0xFFD97706,
        darkArgb: 0xFFB45309,
        isDoodleEnabled: true
    },
    FOREST: {
        id: 'FOREST',
        name: 'Forest Pine',
        colorSchemeId: 'FOREST',
        lightArgb: 0xFF15803D,
        darkArgb: 0xFF166534,
        isDoodleEnabled: true
    },
    SAKURA: {
        id: 'SAKURA',
        name: 'Sakura Blossom',
        colorSchemeId: 'SAKURA',
        lightArgb: 0xFFF472B6,
        darkArgb: 0xFFDB2777,
        isDoodleEnabled: true
    },
    INDIGO: {
        id: 'INDIGO',
        name: 'Royal Indigo',
        colorSchemeId: 'INDIGO',
        lightArgb: 0xFF6366F1,
        darkArgb: 0xFF4F46E5,
        isDoodleEnabled: true
    },
    MONOCHROME: {
        id: 'MONOCHROME',
        name: 'Monochrome Dark',
        colorSchemeId: 'MONOCHROME',
        lightArgb: 0xFF4B5563,
        darkArgb: 0xFF1F2937,
        isDoodleEnabled: false
    }
};

/**
 * Converts a hex string (#RRGGBB or #AARRGGBB) or number into an ARGB fixed32 unsigned integer.
 */
export function hexToArgb(color) {
    if (typeof color === 'number') {
        return color >>> 0;
    }
    if (typeof color !== 'string') {
        return 0xFF128C7E;
    }
    let hex = color.trim().replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length === 6) {
        hex = 'FF' + hex;
    }
    return (parseInt(hex, 16) || 0) >>> 0;
}

/**
 * Formats user input into a valid WAProto ChatThemeSetting object.
 */
export function resolveChatThemeSetting(theme) {
    const now = Date.now();
    if (!theme) {
        return {
            clearTheme: true,
            settingTimestampMs: now
        };
    }

    if (typeof theme === 'string') {
        const key = theme.toUpperCase();
        const preset = CHAT_THEME_PRESETS[key] || CHAT_THEME_PRESETS.EMERALD;
        return {
            settingTimestampMs: now,
            clearTheme: false,
            colorSchemeId: preset.colorSchemeId,
            solidColor: {
                backgroundLightArgb: preset.lightArgb,
                backgroundDarkArgb: preset.darkArgb,
                isDoodleEnabled: preset.isDoodleEnabled
            }
        };
    }

    if (theme.clearTheme) {
        return {
            clearTheme: true,
            settingTimestampMs: now
        };
    }

    let colorSchemeId = theme.colorSchemeId;
    if (!colorSchemeId && theme.preset) {
        const key = String(theme.preset).toUpperCase();
        colorSchemeId = CHAT_THEME_PRESETS[key]?.colorSchemeId || key;
    }
    if (!colorSchemeId && theme.name) {
        colorSchemeId = String(theme.name).toUpperCase();
    }
    if (!colorSchemeId) {
        colorSchemeId = 'CUSTOM';
    }

    const result = {
        settingTimestampMs: now,
        clearTheme: false,
        colorSchemeId
    };

    if (theme.solidColor) {
        result.solidColor = {
            backgroundLightArgb: hexToArgb(theme.solidColor.backgroundLightArgb ?? theme.solidColor.lightArgb ?? theme.solidColor.backgroundColor ?? theme.solidColor.color ?? '#128C7E'),
            backgroundDarkArgb: hexToArgb(theme.solidColor.backgroundDarkArgb ?? theme.solidColor.darkArgb ?? theme.solidColor.backgroundColor ?? theme.solidColor.color ?? '#075E54'),
            isDoodleEnabled: theme.solidColor.isDoodleEnabled ?? true,
            doodleLightArgb: theme.solidColor.doodleLightArgb ? hexToArgb(theme.solidColor.doodleLightArgb) : undefined,
            doodleDarkArgb: theme.solidColor.doodleDarkArgb ? hexToArgb(theme.solidColor.doodleDarkArgb) : undefined
        };
    } else if (theme.backgroundColor || theme.color || theme.lightColor) {
        result.solidColor = {
            backgroundLightArgb: hexToArgb(theme.lightColor || theme.backgroundColor || theme.color || '#128C7E'),
            backgroundDarkArgb: hexToArgb(theme.darkColor || theme.backgroundColor || theme.color || '#075E54'),
            isDoodleEnabled: theme.isDoodleEnabled ?? true
        };
    } else if (theme.stockImage) {
        result.stockImage = {
            stockImageId: theme.stockImage.stockImageId || theme.stockImage.id || 'wallpaper_1',
            dimLevel: typeof theme.stockImage.dimLevel === 'number' ? theme.stockImage.dimLevel : 0.0
        };
    } else if (theme.animatedWallpaper) {
        result.animatedWallpaper = {
            animatedWallpaperId: theme.animatedWallpaper.animatedWallpaperId || theme.animatedWallpaper.id || 'anim_1',
            dimLevel: typeof theme.animatedWallpaper.dimLevel === 'number' ? theme.animatedWallpaper.dimLevel : 0.0
        };
    } else if (theme.customImage) {
        result.customImage = theme.customImage;
    } else if (theme.defaultWallpaper) {
        result.defaultWallpaper = {
            isDoodleEnabled: theme.defaultWallpaper.isDoodleEnabled ?? true
        };
    } else if (CHAT_THEME_PRESETS[colorSchemeId]) {
        const preset = CHAT_THEME_PRESETS[colorSchemeId];
        result.solidColor = {
            backgroundLightArgb: preset.lightArgb,
            backgroundDarkArgb: preset.darkArgb,
            isDoodleEnabled: preset.isDoodleEnabled
        };
    } else {
        result.solidColor = {
            backgroundLightArgb: 0xFF128C7E,
            backgroundDarkArgb: 0xFF075E54,
            isDoodleEnabled: true
        };
    }

    return result;
}

/**
 * Constructs a ProtocolMessage holding the chat theme settings.
 */
export function formatChatThemeProtocolMessage(theme) {
    const chatThemeSetting = resolveChatThemeSetting(theme);
    return {
        protocolMessage: {
            type: proto.Message.ProtocolMessage.Type.CHAT_THEME_SETTING,
            chatThemeSetting
        }
    };
}
