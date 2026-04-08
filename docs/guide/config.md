---
title: Configuration
icon: gear
---

# Configuration

This guide provides an overview of how to customize and extend the template.

## Styling & Theming

The template uses SCSS for styling. You can find the relevant files in `docs/.vuepress/styles/`.

### 1. Theme Color (`config.scss`)
The primary brand color is defined here. Changing this will update the accent color across all components.

```scss
// docs/.vuepress/styles/config.scss
$theme-color: rgb(0, 187, 204);
```

### 2. CSS Variables (`palette.scss`)
Use this file to override default CSS variables provided by `theme-hope`.

```scss
// docs/.vuepress/styles/palette.scss
// Example: override the background color
// :root { --bg-color: #f0f0f0; }
```

### 3. Custom CSS (`index.scss`)
Add any custom global CSS rules here. These will be loaded after the theme styles.

```scss
// docs/.vuepress/styles/index.scss
.custom-highlight {
  border-bottom: 2px solid var(--theme-color);
}
```

---

## Components & Client Logic

### Global Components
Custom Vue components placed in `docs/.vuepress/components/` (like `Pen.vue`, `Video.vue`, etc.) are registered in `docs/.vuepress/client.js`.

To use a new component everywhere, import it and register it in `client.js`:

```javascript
// docs/.vuepress/client.js
import { defineClientConfig } from 'vuepress/client'
import MyComponent from './components/MyComponent.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('MyComponent', MyComponent)
  }
})
```

---

## Navigation Configuration

### Sidebar (`sidebar.js`)
The sidebar is structured as an object where keys are path prefixes and values are arrays of sidebar items.

```javascript
// docs/.vuepress/sidebar.js
export default sidebar({
  "/guide/": [
    {
      text: "Guide",
      icon: "book",
      children: "structure", // Automatically builds from file structure
    },
  ],
});
```

Using `children: "structure"` is the easiest way to keep your sidebar in sync with your files.

### Navbar (`config.js`)
The navigation bar at the top of the page is configured directly in `docs/.vuepress/config.js` under the `theme` object.

```javascript
// docs/.vuepress/config.js
navbar: [
  { text: "Home", link: "/" },
  { text: "Guide", link: "/guide/" },
  { text: "External", link: "https://example.com" },
],
```

---

## LLMS Support

This template automatically generates files optimized for Large Language Models (LLMs) to scan your content.

- **`llms.txt`**: A concise summary and table of contents of your site.
- **`llms-full.txt`**: A complete, single-file version of your entire site's content.

These files are generated in the site root during the build process.

### How to Disable LLMS Generation
If you want to turn off these features, you can modify the `plugins` array in `docs/.vuepress/config.js`:

```javascript
// docs/.vuepress/config.js
plugins: [
  llmsPlugin({
    domain: "https://your-domain.com",
    llmsTxt: false,      // Turn off llms.txt
    llmsFullTxt: false,  // Turn off llms-full.txt
    llmsPageTxt: false,  // Turn off individual page .txt files
  }),
],
```

---

## Icon Assets


This template uses **FontAwesome** for icons.

- **In Frontmatter**: Use the `icon` key.
  ```yaml
  icon: laptop-code
  ```
- **In Markdown**: Use standard HTML tags.
  ```html
  <i class="fas fa-rocket"></i>
  ```
