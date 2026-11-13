
export interface NativeFlowButton {
    id?: string;
    text?: string;
    buttonText?: string;
    url?: string;
    call?: string;
    copy?: string;
    icon?: string;
    useWebview?: boolean;
    sections?: Array<{
        title: string;
        rows: Array<{
            id: string;
            title: string;
            description?: string;
        }>;
    }>;
    name?: string;
    buttonParamsJson?: string;
    paramsJson?: string;
}

export declare class ButtonBuilder {
    private buttons: NativeFlowButton[];
    constructor();
    addReply(id: string, text: string, icon?: string): this;
    addUrl(text: string, url: string, useWebview?: boolean, icon?: string): this;
    addCall(text: string, phoneNumber: string, icon?: string): this;
    addCopy(text: string, code: string, icon?: string): this;
    addList(title: string, sections: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>, icon?: string): this;
    addFlow(flowId: string, text: string, flowToken?: string, action?: string, payload?: object): this;
    addLocation(text?: string, icon?: string): this;
    addWebview(text: string, url: string, title?: string, icon?: string): this;
    addPayment(text: string, paymentConfig?: object, icon?: string): this;
    addOrder(text: string, orderConfig?: object, icon?: string): this;
    addCallPermission(text?: string, icon?: string): this;
    addReminder(text: string, title?: string, timestampOrDate?: any, icon?: string): this;
    addCancelReminder(text: string, reminderId?: string, icon?: string): this;
    addProduct(productRetailerId: string, catalogId: string, text?: string, icon?: string): this;
    addProductList(catalogId: string, sections: any[], text?: string, icon?: string): this;
    addCatalog(businessOwnerJid?: string, text?: string, icon?: string): this;
    addAddressRequest(text?: string, addressType?: string, parameters?: object, icon?: string): this;
    addPixPayment(amount: number | object, pixKey: string, merchantName?: string, text?: string, icon?: string): this;
    addPaymentStatus(referenceId: string, status?: string, paymentConfig?: object, text?: string, icon?: string): this;
    build(): NativeFlowButton[];
}

export declare class MessageBuilder {
    private msg: any;
    constructor();
    setText(text: string): this;
    setCaption(caption: string): this;
    setHeader(title: string, subtitle?: string): this;
    setFooter(footer: string): this;
    setMedia(mediaObj: any): this;
    setNativeFlow(buttons: NativeFlowButton[] | ButtonBuilder): this;
    setOffer(text: string, url?: string, code?: string, expiration?: number): this;
    setBottomSheet(optionText: string, optionTitle?: string): this;
    build(): any;
}

export declare function fromCloudApiMessage(cloudApiPayload: any): any;
export declare function toCloudApiMessage(baileysContent: any, recipientPhone?: string): any;
export declare function buildButtonMessage(params: any): any;
export declare function buildListMessage(params: any): any;

export interface InteractiveMessageOptions {
    text?: string;
    body?: string;
    title?: string;
    header?: string;
    footer?: string;
    image?: string | { url: string };
    video?: string | { url: string };
    media?: any;
    caption?: string;
    buttons?: NativeFlowButton[] | ButtonBuilder;
    nativeFlow?: NativeFlowButton[] | ButtonBuilder;
    cards?: any[];
    sections?: Array<{
        title: string;
        rows: Array<{
            id: string;
            title: string;
            description?: string;
        }>;
    }>;
    buttonText?: string;
    button?: string;
    bottomSheet?: {
        buttonText?: string;
        title?: string;
    };
    offer?: {
        text: string;
        url?: string;
        code?: string;
        expiration?: number;
    };
}

export interface RichMessageOptions {
    text?: string;
    header?: string;
    headerText?: string;
    footer?: string;
    footerText?: string;
    title?: string;
    disclaimer?: string;
    disclaimerText?: string;
    code?: string;
    language?: string;
    table?: Array<string[]>;
    noHeading?: boolean;
    links?: Array<{
        text: string;
        url?: string;
        title?: string;
        displayName?: string;
        sources?: Array<{
            displayName?: string;
            subtitle?: string;
            url?: string;
        }>;
    }>;
    inlineImage?: string;
    imageText?: string;
    latex?: string[];
}

export declare function buildInteractiveMessage(params: InteractiveMessageOptions): any;
export declare function buildRichMessage(params: RichMessageOptions): any;
export declare function sendInteractiveMessage(sock: any, jid: string, content: InteractiveMessageOptions, options?: any): Promise<any>;
export declare function sendButtonMessage(sock: any, jid: string, content: any, options?: any): Promise<any>;
export declare function sendRichMessage(sock: any, jid: string, content: RichMessageOptions, options?: any): Promise<any>;

export declare function sanitizeWhatsAppNumber(phone: string): string;
export declare function diagnoseMetaCloudApiError(error: any): { code: number; title: string; explanation: string; suggestion: string };
export declare function sendMetaCloudApi(config: { phoneNumberId: string; accessToken: string; apiVersion?: string }, payload: any): Promise<any>;
export declare function createMetaCloudApiClient(config: { phoneNumberId: string; accessToken: string; apiVersion?: string }): any;
export declare function sendCloudApiMessage(sock: any, jid: string, content: any, options?: any): Promise<any>;

export declare function serializeMessage(msg: any): any;
