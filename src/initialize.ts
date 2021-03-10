import * as api from "./api";
type OpenGraphNinjaProps =
  | {
      /** The CSS selector used to select all links
       *
       * By default, this is `a:only-child`, or all links that are the only element inside of a `<p />` tag (inside the `<main />` section of your page).
       *
       * You can change this to fit your situation.
       */
      linkSelector?: string;
    }
  | undefined;
/** Scans for links, fetches metadata and turns them into previews
 *
 * When called, this function will scan the website it's loaded on to, and turn all stand-alone links into neat looking previews.
 *
 * Remember to include the bundled styles as well.
 */
export function initialize(options: OpenGraphNinjaProps | undefined = {}) {
  options = {
    linkSelector: "main p > a:only-child",
    ...options,
  };
  document
    .querySelectorAll(options.linkSelector as string)
    .forEach(async (el) => {
      try {
        // If the paragraph includes other text in addition to the link, ignore.
        if (el.parentElement?.textContent?.trim() !== el.textContent?.trim()) {
          return;
        }
        // If the link (or any of its ancestors) has a `data-ogn-ignore` attribute, ignore.
        if (el.closest("[data-ogn-ignore]")) {
          return;
        }
        const href = el.getAttribute("href");
        // If the link doesn't have a href attribute, ignore
        if (!href) {
          return;
        }

        const body = await api.getData(href);
        el.parentElement!.innerHTML = `
        <a class="ogn-container" href="${href}">
          ${
            body.image
              ? `<img src="${body.image.url}" alt="${body.image?.alt ||
                  ""}" class="ogn-image" />`
              : ""
          }
          <div class="ogn-content">
          <p class="ogn-title">${body.title}</p>
          <p class="ogn-description">${body.description}</p>
          <p class="ogn-url">${body.hostname}</p>
          </div>
        </a>
      `;
      } catch (e) {
        console.error("Failed to create OpenGraph Ninja preview for link", e);
      }
    });
}
