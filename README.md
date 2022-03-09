# Michał Kownacki Web Components

## `mkwc-image`

### Example usage

To allow updating image, `path` and `updateData` are always required.

Control editing by toggling `editingEnabled`.

#### Automatically load image from database

Provide `getData` to automatically load image. After image is loaded it sets `ready`.

```html
<mkwc-image
  editingEnabled
  path="path-to-source"
  getData="(path) => await getDataFromDB(path)"
  updateData="(path) => await updateDataInDB(path)">
</mkwc-image>
```

#### Provide image manually

Instead of providing `getData`, manually set `noGet` and `image`. Set `ready` manually when image is set.

```html
<mkwc-image
  editingEnabled
  path="path-to-source"
  noGet
  image="{url: 'image-src'}"
  ready
  updateData="(path) => await updateDataInDB(path)">
</mkwc-image>
```

#### Fit and compress image

When uploaded, image will be compressed both in terms of dimensions and quality.

* Use `compressionQuality` to alter quality.
* Use `fit` to set how image should be resized to fit its container.
* Use `maxWidth` and `maxHeight` to set maximal possible boundaries of image.

When uploaded, image will be resized accordingly to `fit`, `maxWidth` and `maxHeight` so that it's just big enough.

```html
<mkwc-image
  ...
  fit="cover"
  maxWidth=700
  maxHeight=400>
</mkwc-image>
```

## Material Icons

Because this package uses `mwc-icon` most users should include the following in their application HTML when using icons:

```html
<link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
```

This loads the Material Icons font, which is required to render icons, and is not loaded automatically. If you see plain text instead of an icon, then the most likely cause is that the Material Icons font is not loaded.

See [link](https://www.npmjs.com/package/@material/mwc-icon#user-content-fonts) for more information.
