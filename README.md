# OpenGraph Ninja SDK

This library contains the code you need to generate nice-looking previews of stand-alone links. That's any code that looks like this:

```html
<p>
  <a href="https://some.url">https://some.url</a>
</p>
```

## Usage

This package contains two things:

- an automated script for previewing URLs
- some default styles for those previews

### Setup

First, install the package.

```sh
$ npm install @opengraphninja/sdk
# or
$ yarn add @opengraphninja/sdk
```

Then, you need to import two things in your code - the SDK itself and the default styles (if you don't want to override them, that is):

```tsx
import initOpenGraphNinja from "@opengraphninja/sdk";
import "@opengraphninja/sdk/styles.css"; // remember the default styles
```

You can also include it as script tags and link tags if that works best:

```html
<script
  defer
  src="https://unpkg.com/@opengraphninja/sdk/dist/umd/opengraphninja.umd.production.min.js"
></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/@opengraphninja/sdk/styles.css"
/>
```

In that case, you'll find the `OpenGraphNinja` namespace on your `window` object.

```js
document.addEventListener("domcontentloaded", () => {
  window.OpenGraphNinja();
});
```

### Using the automated script

Let's turn those regular links into cool previews!

```ts
import * as OpenGraphNinja from "@opengraphninja/sdk";

document.addEventListener("domcontentloaded", () => {
  OpenGraphNinja.initialize();
});
```

By default, this script will find all links that are the only child inside of a p tag inside of your `<main />` section. Or in CSS-selector terms: `main p > a:only-child`. The script also ignores any links that has text in the same `<p />` tag.

You can ignore a particular link or sub-section of your page by adding the `data-ogn-ignore` attribute to either the link or any ancestor.

Here are some examples to make things a bit more clear :

```html
<main>
  <!-- Will be converted to preview -->
  <p><a href="https://some.url">https://some.url</a></p>

  <!-- Will be converted to preview -->
  <p><a href="https://some.url">Check this link</a></p>

  <!-- Will not be converted to preview -->
  <p>
    <strong><a href="https://some.url">https://some.url</a></strong>
  </p>

  <!-- Will not be converted to preview -->
  <p>
    <a href="https://some.url">https://some.url</a>
    <a href="https://some.url">https://some.url</a>
  </p>

  <!-- Will not be converted to preview -->
  <p>
    Check out this link!
    <a href="https://some.url">https://some.url</a>
  </p>

  <!-- Will not be converted to preview -->
  <div>
    <a href="https://some.url">https://some.url</a>
  </div>

  <!-- Will not be converted to preview -->
  <p><a href="https://some.url" data-ogn-ignore>https://some.url</a></p>

  <!-- Will not be converted to preview -->
  <div data-ogn-ignore>
    <p><a href="https://some.url">https://some.url</a></p>
  </div>
</main>

<!-- Will not be converted since outside of main tag -->
<p><a href="https://some.url">https://some.url</a></p>
```

## React version

If you're using React, you can use [@opengraphninja/react](https://github.com/opengraphninja/react) to create cool previews there as well.

## Questions and feature requests?

If you have questions, bug reports or feature requests, please let us know in the issues.
