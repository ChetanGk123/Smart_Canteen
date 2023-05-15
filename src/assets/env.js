(function (window) {
    window.__env = window.__env || {};
    document.querySelector("title").innerHTML = "Smart Canteen";
    window.__env.config = {
        app: {
            appName: "Smart Canteen",
            appLogoImage: "assets/logo.png",
            cardNumberLength: 14,
        },
        layout: {
            enableLocalStorage: true,
        },
        url: "https://thetechvaidya.com/cooksbook_new/api/v1/",
    };
})(this);
