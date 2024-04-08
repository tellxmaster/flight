import { renderers } from './renderers.mjs';
import { manifest } from './manifest_BhZDWn2-.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_WDz7o-ZE.mjs');
const _page1 = () => import('./chunks/searchAirports_CDQQ80wj.mjs');
const _page2 = () => import('./chunks/searchFlights_cE9WgubU.mjs');
const _page3 = () => import('./chunks/index_DKup1Bie.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/searchAirports.json.ts", _page1],
    ["src/pages/api/searchFlights.json.ts", _page2],
    ["src/pages/index.astro", _page3]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "d901b197-f396-43a7-9893-cba72c619802"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
