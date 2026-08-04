import * as api from "./api";
import type { PreviewData } from "./api";

// Re-exported so consumers can type their own code against the payload. The
// `exports` map has no `./dist/*` entry, so reaching into the build is not an
// option for them.
export type { PreviewData } from "./api";
export type { Details } from "./types";

export type OpenGraphNinjaProps =
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

/** The preview markup is assembled as a string, and the values come from
 * whatever `<meta />` tags the previewed site happens to serve. Escaping keeps
 * that third-party content from being parsed as markup.
 */
const escapeHtml = (value: string | null | undefined) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderPreview = (data: PreviewData) => `
        <a class="ogn-container" href="${escapeHtml(data.requestUrl)}">
          ${
            data.image
              ? `<img src="${escapeHtml(data.image.url)}" alt="${escapeHtml(
                  data.image.alt,
                )}" class="ogn-image" />`
              : ""
          }
          <div class="ogn-content">
          <p class="ogn-title">${escapeHtml(data.title)}</p>
          <p class="ogn-description">${escapeHtml(data.description)}</p>
          <p class="ogn-url">${escapeHtml(data.hostname)}</p>
          </div>
        </a>
      `;

const previewLink = async (el: Element) => {
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
    const parent = el.parentElement;
    if (!parent) {
      return;
    }

    parent.innerHTML = renderPreview(await api.getData(href));
  } catch (e) {
    console.error("Failed to create OpenGraph Ninja preview for link", e);
  }
};

/** Scans for links, fetches metadata and turns them into previews
 *
 * When called, this function will scan the website it's loaded on to, and turn all stand-alone links into neat looking previews.
 *
 * Remember to include the bundled styles as well.
 */
export function initialize(options: OpenGraphNinjaProps = {}) {
  const { linkSelector = "main p > a:only-child" } = options ?? {};
  document.querySelectorAll(linkSelector).forEach((el) => {
    void previewLink(el);
  });
}
