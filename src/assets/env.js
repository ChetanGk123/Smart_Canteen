(function (window) {
    window.__env = window.__env || {};
    document.querySelector("title").innerHTML = "Campus Bites";
    window.__env.config = {
        app: {
            appName: "Campus Bites",
            appLogoImage: "assets/logo.jpg",
            cardNumberLength: 14,
        },
        layout: {
            enableLocalStorage: true,
        },
        url: "https://thetechvaidya.com/cooksbook_new/api/v1/",
    };
})(this);
