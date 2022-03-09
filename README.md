# Michał Kownacki Web Components

Because this package uses `mwc-icon` most users should include the following in their application HTML when using icons:

```html
<link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
```

This loads the Material Icons font, which is required to render icons, and is not loaded automatically. If you see plain text instead of an icon, then the most likely cause is that the Material Icons font is not loaded.

See [link](https://www.npmjs.com/package/@material/mwc-icon#user-content-fonts) for more information.
