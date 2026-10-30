# ChatDollar

Static site for Vercel. Clean URLs are handled by `vercel.json` (`cleanUrls: true`), so no link ends in `.html`.

| URL | File | What it is |
| --- | --- | --- |
| `/` | `index.html` | Landing page: pick a task |
| `/chat` | `chat.html` | Get paid to chat online |
| `/hotels` | `hotels.html` | Rate and review hotels |

- `css/` and `js/`: one file each per page (`landing`, `chat`, `hotels`)
- `sw.js`: offline cache. Bump `CACHE_NAME` when you change files
- Referral link: `REGISTER_URL` in `js/hotels.js`, and the `ref=harzel` links in the HTML
- Hotel photos: `assets/hotels/hotel-N.webp`
