/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
/* eslint-env serviceworker */
precacheAndRoute(self.__WB_MANIFEST);

// کش کردن فایل‌های JavaScript
// registerRoute(
//   ({ request }) => request.destination === "script",
//   new StaleWhileRevalidate({
//     cacheName: "js-cache",
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 60 * 60 * 24 * 30, // 30 روز
//       }),
//     ],
//   })
// );

registerRoute(
  ({ request }) => request.destination === "script",
  new CacheFirst({
    cacheName: "js-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 روز
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.endsWith("/images/earth/3DGlobe-TS.png"),
  new CacheFirst({
    cacheName: "large-images-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.endsWith("/images/earth/3DGlobe-C.png"),
  new CacheFirst({
    cacheName: "large-images-cache2",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "all-images-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);
