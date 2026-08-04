import type { PreviewData } from "../src/api";

export const preview: PreviewData = {
  hostname: "example.com",
  requestUrl: "https://example.com/article",
  title: "A title",
  description: "A description",
  image: { url: "https://example.com/image.png", alt: "An image" },
  details: {},
};

/** Stubs `fetch` and hands back the mock so tests can assert on the call.
 *
 * The tests deliberately exercise `initialize` through the real `api` module
 * rather than mocking it, so the request shape stays covered too.
 */
export const stubFetch = (
  body: unknown,
  { ok = true, status = 200 }: { ok?: boolean; status?: number } = {},
) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};
