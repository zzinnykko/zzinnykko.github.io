// import "preact";

declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            urlset: any;
            url: any;
            loc: any;
            lastmod: any;
            changefreq: any;
            priority: any;
        }
    }
}

export {};