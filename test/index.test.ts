import { initialize } from "../src";
import { preview, stubFetch } from "./helpers";

const link = (href = "https://example.com/article") => `<a href="${href}">${href}</a>`;

beforeEach(() => {
  document.body.innerHTML = "";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** `initialize` is fire-and-forget — it kicks off a request per link and
 * returns without waiting, so assertions on the resulting DOM have to poll.
 */
const container = () =>
  vi.waitFor(() => {
    const el = document.querySelector(".ogn-container");
    expect(el).not.toBeNull();
    return el!;
  });

describe("initialize", () => {
  it("replaces a stand-alone link with a preview", async () => {
    stubFetch(preview);
    document.body.innerHTML = `<main><p>${link()}</p></main>`;

    initialize();

    const el = await container();
    expect(el.getAttribute("href")).toBe(preview.requestUrl);
    expect(document.querySelector(".ogn-title")?.textContent).toBe(preview.title);
    expect(document.querySelector(".ogn-description")?.textContent).toBe(preview.description);
    expect(document.querySelector(".ogn-url")?.textContent).toBe(preview.hostname);
    const image = document.querySelector(".ogn-image");
    expect(image?.getAttribute("src")).toBe(preview.image?.url);
    expect(image?.getAttribute("alt")).toBe(preview.image?.alt);
  });

  it("renders a link with text content, not just bare urls", async () => {
    stubFetch(preview);
    document.body.innerHTML = `<main><p><a href="https://example.com/article">Check this link</a></p></main>`;

    initialize();

    await expect(container()).resolves.toBeTruthy();
  });

  it("omits the image when the payload has none", async () => {
    stubFetch({ ...preview, image: undefined });
    document.body.innerHTML = `<main><p>${link()}</p></main>`;

    initialize();

    await container();
    expect(document.querySelector(".ogn-image")).toBeNull();
  });

  it("uses an empty alt when the image has none", async () => {
    stubFetch({ ...preview, image: { url: "https://example.com/i.png" } });
    document.body.innerHTML = `<main><p>${link()}</p></main>`;

    initialize();

    await container();
    expect(document.querySelector(".ogn-image")?.getAttribute("alt")).toBe("");
  });

  it("escapes markup coming from the previewed site's metadata", async () => {
    stubFetch({
      ...preview,
      title: `<img src=x onerror="alert(1)">`,
      description: `Ampersands & "quotes"`,
      image: { url: "https://example.com/i.png", alt: `" onload="alert(1)` },
    });
    document.body.innerHTML = `<main><p>${link()}</p></main>`;

    initialize();

    await container();
    const title = document.querySelector(".ogn-title");
    expect(title?.querySelector("img")).toBeNull();
    expect(title?.textContent).toBe(`<img src=x onerror="alert(1)">`);
    expect(document.querySelector(".ogn-description")?.textContent).toBe(`Ampersands & "quotes"`);
    expect(document.querySelector(".ogn-image")?.getAttribute("alt")).toBe(`" onload="alert(1)`);
  });

  it("honours a custom linkSelector", async () => {
    stubFetch(preview);
    document.body.innerHTML = `<div class="post"><p>${link()}</p></div>`;

    initialize({ linkSelector: ".post p > a:only-child" });

    await expect(container()).resolves.toBeTruthy();
  });

  it("leaves the DOM alone and logs when the request fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    stubFetch({ error: "Nope" }, { ok: false, status: 400 });
    const markup = `<main><p>${link()}</p></main>`;
    document.body.innerHTML = markup;

    initialize();

    await vi.waitFor(() => {
      expect(error).toHaveBeenCalled();
    });
    expect(document.body.innerHTML).toBe(markup);
  });

  describe("skips links that", () => {
    it.for([
      [
        "share their paragraph with other text",
        `<main><p>Check out this link! ${link()}</p></main>`,
      ],
      ["are wrapped in another element", `<main><p><strong>${link()}</strong></p></main>`],
      [
        "are not alone in their paragraph",
        `<main><p>${link()}${link("https://example.com/other")}</p></main>`,
      ],
      ["are not inside a paragraph", `<main><div>${link()}</div></main>`],
      ["are outside the main element", `<p>${link()}</p>`],
      [
        "carry data-ogn-ignore",
        `<main><p><a href="https://example.com/article" data-ogn-ignore>https://example.com/article</a></p></main>`,
      ],
      ["have an ancestor with data-ogn-ignore", `<main data-ogn-ignore><p>${link()}</p></main>`],
      ["have no href", `<main><p><a>https://example.com/article</a></p></main>`],
    ])("%s", ([, markup]) => {
      const fetchMock = stubFetch(preview);
      document.body.innerHTML = markup;
      // Compare against the DOM's own serialization, not the input string —
      // jsdom rewrites valueless attributes to `data-ogn-ignore=""`.
      const untouched = document.body.innerHTML;

      initialize();

      // Every skip condition is checked before the request is made, so this is
      // settled synchronously — there is nothing to wait for.
      expect(fetchMock).not.toHaveBeenCalled();
      expect(document.body.innerHTML).toBe(untouched);
    });
  });
});
