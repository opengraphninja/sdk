import { getData } from "../src/api";
import { preview, stubFetch } from "./helpers";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getData", () => {
  it("requests the API with the base64-encoded url", async () => {
    const fetchMock = stubFetch(preview);
    const href = "https://example.com/article?utm_source=test";

    await getData(href);

    expect(fetchMock).toHaveBeenCalledWith(
      `https://opengraph.ninja/api/v1?encodedUrl=${btoa(href)}`,
    );
  });

  it("resolves with the preview payload", async () => {
    stubFetch(preview);

    await expect(getData("https://example.com/article")).resolves.toEqual(preview);
  });

  it("throws a real Error carrying the API's message", async () => {
    stubFetch({ error: "Could not reach that url" }, { ok: false, status: 400 });

    await expect(getData("https://example.com")).rejects.toThrow(
      new Error("Could not reach that url"),
    );
  });

  it("falls back to the status code when the API sends no message", async () => {
    stubFetch({}, { ok: false, status: 503 });

    await expect(getData("https://example.com")).rejects.toThrow("Request failed with status 503");
  });

  it("keeps the raw error body as the Error's cause", async () => {
    const body = { error: "Nope" };
    stubFetch(body, { ok: false, status: 400 });

    await expect(getData("https://example.com")).rejects.toMatchObject({
      cause: body,
    });
  });
});
