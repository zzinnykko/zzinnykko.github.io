import "preact";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            urlset: { [key: string]: any };
            // url: any;
            // loc: any;
            // lastmod: any;
            // changefreq: any;
            // priority: any;
        }
    }
}