import { proto } from '../../WAProto/index.js';

export interface ChatThemePreset {
    id: string;
    name: string;
    colorSchemeId: string;
    lightArgb: number;
    darkArgb: number;
    isDoodleEnabled: boolean;
}

export declare const CHAT_THEME_PRESETS: Record<string, ChatThemePreset>;

export declare function hexToArgb(color: string | number): number;

export interface ChatThemeOptions {
    preset?: string;
    name?: string;
    colorSchemeId?: string;
    clearTheme?: boolean;
    backgroundColor?: string | number;
    lightColor?: string | number;
    darkColor?: string | number;
    color?: string | number;
    isDoodleEnabled?: boolean;
    solidColor?: {
        backgroundLightArgb?: string | number;
        backgroundDarkArgb?: string | number;
        lightArgb?: string | number;
        darkArgb?: string | number;
        backgroundColor?: string | number;
        color?: string | number;
        isDoodleEnabled?: boolean;
        doodleLightArgb?: string | number;
        doodleDarkArgb?: string | number;
    };
    stockImage?: {
        stockImageId?: string;
        id?: string;
        dimLevel?: number;
    };
    animatedWallpaper?: {
        animatedWallpaperId?: string;
        id?: string;
        dimLevel?: number;
    };
    customImage?: any;
    defaultWallpaper?: {
        isDoodleEnabled?: boolean;
    };
}

export declare function resolveChatThemeSetting(theme?: string | ChatThemeOptions): proto.Message.IChatThemeSetting;

export declare function formatChatThemeProtocolMessage(theme?: string | ChatThemeOptions): {
    protocolMessage: {
        type: proto.Message.ProtocolMessage.Type;
        chatThemeSetting: proto.Message.IChatThemeSetting;
    };
};
