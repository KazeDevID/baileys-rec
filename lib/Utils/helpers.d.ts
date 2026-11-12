import { proto } from '../../WAProto/index.js';

export declare const JS_KEYWORDS: Set<string>;
export declare const PYTHON_KEYWORDS: Set<string>;
export declare const GO_KEYWORDS: Set<string>;
export declare const LUA_KEYWORDS: Set<string>;
export declare const BASH_KEYWORDS: Set<string>;
export declare const LANGUAGE_KEYWORDS: Record<string, Set<string>>;

export declare enum CodeHighlightType {
    DEFAULT = 0,
    KEYWORD = 1,
    METHOD = 2,
    STRING = 3,
    NUMBER = 4,
    COMMENT = 5
}

export declare enum RichSubMessageType {
    UNKNOWN = 0,
    GRID_IMAGE = 1,
    TEXT = 2,
    INLINE_IMAGE = 3,
    TABLE = 4,
    CODE = 5,
    DYNAMIC = 6,
    MAP = 7,
    LATEX = 8,
    CONTENT_ITEMS = 9
}

export declare const HIGHLIGHT_TYPE_MAP: Record<number, string>;

export declare function safeGenMsgId(): string;

export declare function tokenizeCode(codeStr: string, language?: string): Array<{
    highlightType: number;
    codeContent: string;
}>;

export declare function tokenizeCodeV2(codeStr: string, language?: string): {
    codeBlock: Array<{ highlightType: number; codeContent: string }>;
    unified_codeBlock: Array<{ text: string; type: string }>;
};

export declare function buildRichContextInfo(quoted?: any, customOptions?: any): any;
export declare function buildBotForwardedMessage(submessages: any[], contextInfo: any, unifiedResponse?: any): any;
export declare function generateRichMessageContent(submessages: any[], quoted?: any, options?: any): { message: any; messageId: string };
export declare function generateTableContent(title: string, headers: string[], rows: any[][], quoted?: any, options?: any): { message: any; messageId: string };
export declare function generateTableContentV2(table: any[], quoted?: any, options?: any): { message: any; messageId: string };
export declare function toTableMetadataV2(arr: any[]): { title: string; rows: any[]; unified_rows: any[] };
export declare function generateListContent(title: string, items: any[], quoted?: any, options?: any): { message: any; messageId: string };
export declare function generateCodeBlockContent(code: string, quoted?: any, options?: any): { message: any; messageId: string };
export declare function generateCodeBlockContentV2(code: string, quoted?: any, options?: any): { message: any; messageId: string };
export declare function generateLinkContent(text: string, links: any[], quoted?: any, options?: any): { message: any; messageId: string };
export declare function generateLinkContentV2(text: string, links: any[], quoted?: any, options?: any): { message: any; messageId: string };
export declare function generateLatexContent(quoted?: any, options?: any): { message: any; messageId: string };
export declare function captureUnifiedResponse(msg: any): any;
export declare function generateUnifiedResponseContent(quoted: any, captured: any, options?: any): { message: any; messageId: string };
export declare function extractIE(text: string, options?: { extract?: boolean; hyperlink?: boolean; citation?: boolean; latex?: boolean }): {
    text: string;
    ie: any[];
    inline_entities: any[];
};
export declare function waitAllPromises(input: any): Promise<any>;
export declare function sanitizeQuotedMessage(quoted: any, fallbackText?: string): any;

export declare class Toolkit {
    static extractIE(text: string, options?: any): any;
    static resize(buffer: Buffer, x: number, y: number, fit?: string): Promise<Buffer>;
    static waitAllPromises(input: any): Promise<any>;
    static fetchBuffer(url: string, options?: any, extra?: { silent?: boolean }): Promise<Buffer>;
    static toUrl(_client: any, path: string | Buffer, mediaType?: string): Promise<string>;
    static resolveMedia(_client: any, media: any, mediaType?: string, options?: any): Promise<any>;
}

export declare class BaseBuilder {
    _title: string;
    _subtitle: string;
    _body: string;
    _footer: string;
    _contextInfo: any;
    _extraPayload: any;
    setTitle(title: string): this;
    setSubtitle(subtitle: string): this;
    setBody(body: string): this;
    setFooter(footer: string): this;
    setContextInfo(obj: any): this;
    addPayload(obj: any): this;
    text(t: string): this;
    footer(f: string): this;
    title(t: string): this;
    subtitle(s: string): this;
}

export declare class CardBuilder {
    constructor(client?: any);
    image(url: string): this;
    title(t: string): this;
    text(t: string): this;
    button(displayText: string, id?: string): this;
}

export declare class RowBuilder {
    buttons: any[];
    button(displayText: string, id?: string): this;
}

export declare class Button extends BaseBuilder {
    constructor(client?: any);
    setVideo(path: string | Buffer, options?: any): this;
    setImage(path: string | Buffer, options?: any): this;
    setDocument(path: string | Buffer, options?: any): this;
    setMedia(obj: any): this;
    clearButtons(): this;
    setParams(obj: any): this;
    addButton(name: string, params: any): this;
    addReply(display_text?: string, id?: string, options?: any): this;
    addUrl(display_text?: string, url?: string, webview_interaction?: boolean, options?: any): this;
    addCopy(display_text?: string, copy_code?: string, options?: any): this;
    addCall(display_text?: string, phone?: string, options?: any): this;
    addSelection(title: string, options?: any): this;
    makeSection(title?: string, highlight_label?: string): this;
    makeRow(header?: string, title?: string, description?: string, id?: string): this;
    addLocationRequest(display_text?: string, options?: any): this;
    addFlow(flowId: string | number, options?: any): this;
    addAddressRequest(display_text?: string, options?: any): this;
    addReviewOrder(orderData?: any, options?: any): this;
    addReminder(display_text?: string, timestamp?: number | null, options?: any): this;
    addCancelReminder(display_text?: string, options?: any): this;
    addCatalog(display_text?: string, business_owner_jid?: string, options?: any): this;
    toCard(): Promise<any>;
    build(jid: string, options?: any): Promise<any>;
    send(jid: string, options?: any): Promise<any>;
}

export declare class ButtonV2 extends BaseBuilder {
    constructor(client?: any);
    addButton(displayText?: string, buttonId?: string): this;
    setThumbnail(path: any): this;
    setMedia(obj: any): this;
    build(jid: string, options?: any): Promise<any>;
    send(jid: string, options?: any): Promise<any>;
}

export declare class Carousel extends BaseBuilder {
    constructor(client?: any);
    addCard(card: any | any[]): this;
    build(jid: string, options?: any): Promise<any>;
    send(jid: string, options?: any): Promise<any>;
}

export declare class AIRich extends BaseBuilder {
    constructor(client?: any);
    addSubmessage(submessage: any | any[]): this;
    addSection(section: any | any[]): this;
    addText(text: string, options?: { hyperlink?: boolean; citation?: boolean; latex?: boolean }): this;
    addCode(language: string, code: string): this;
    addTable(table: any[], options?: { hyperlink?: boolean; citation?: boolean; latex?: boolean }): this;
    addSource(sources?: any[]): this;
    addDynamic(url: string, type?: number, loopCount?: number): this;
    addImage(imageUrl: string | string[], options?: { resolveUrl?: boolean }): this;
    addTip(text: string): this;
    addSuggest(suggestion: string | string[], options?: { scroll?: boolean; layout?: string }): this;
    build(options?: any): Promise<any>;
    send(jid: string, options?: any): Promise<any>;
    static tokenizer(code: string, lang?: string): { codeBlock: any[]; unified_codeBlock: any[] };
    static toTableMetadata(arr: any[], options?: any): { title: string; rows: any[]; unified_rows: any[] };
    static newLayout(name: string, data: any, extra?: any): any;
}

export declare class Rich extends AIRich {}
