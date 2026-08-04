import { Details } from "./types";

export type PreviewData = {
  hostname: string;
  requestUrl: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alt?: string;
  };
  details: Details;
};

type ApiError = {
  error: string;
};

export const getData = async (href: string): Promise<PreviewData> => {
  const response = await fetch(`https://opengraph.ninja/api/v1?encodedUrl=${btoa(href)}`);
  const body: unknown = await response.json();
  if (!response.ok) {
    const { error } = body as ApiError;
    throw new Error(error || `Request failed with status ${response.status}`, {
      cause: body,
    });
  }
  return body as PreviewData;
};
