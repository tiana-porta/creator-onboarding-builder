# Custom Fonts Directory

Place your custom font files here (`.woff2`, `.woff`, `.ttf`, `.otf`).

## Supported Formats (in order of preference):
- `.woff2` (best compression, modern browsers)
- `.woff` (good compression, wider support)
- `.ttf` (TrueType, good fallback)
- `.otf` (OpenType, good fallback)

## Example:
If you have a font called "CustomFont", place files like:
- `CustomFont-Regular.woff2`
- `CustomFont-Bold.woff2`
- `CustomFont-Regular.woff`
- `CustomFont-Bold.woff`

## After uploading:
The fonts will be configured in `app/layout.tsx` using `next/font/local`.


