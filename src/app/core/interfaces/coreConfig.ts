export interface CoreConfig {
    app: {
        appName: string;
        appTitle: string;
        appLogoImage: string;
        cardNumberLength: number;
    };
    layout: {
        enableLocalStorage: boolean;
    };
    url: string;
}
