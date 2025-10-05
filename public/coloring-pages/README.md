# Coloring Pages Directory

This directory contains all the coloring page images organized by category.

## Structure

```
coloring-pages/
├── elsa/
│   ├── elsa1.png
│   ├── elsa2.png
│   └── ...
├── cars/
│   ├── car1.png
│   ├── car2.png
│   └── ...
├── animals/
│   ├── animal1.png
│   ├── animal2.png
│   └── ...
├── princess/
│   ├── princess1.png
│   └── ...
├── dinosaurs/
│   ├── dino1.png
│   └── ...
└── flowers/
    ├── flower1.png
    └── ...
```

## Adding New Images

1. **Create category folder** (if it doesn't exist):
   ```bash
   mkdir coloring-pages/[category-name]
   ```

2. **Add PNG files** to the category folder

3. **Update data.ts** to include the new image paths in the corresponding category's `images` array

## Image Guidelines

- **Format**: PNG (recommended for line art)
- **Size**: Minimum 800x1000 pixels for good print quality
- **DPI**: 300 DPI for printing
- **Content**: Black line art on white background
- **Style**: Simple, kid-friendly designs

## File Naming

Use descriptive, sequential names:
- `elsa1.png`, `elsa2.png`, `elsa3.png`
- `car1.png`, `car2.png`, `car3.png`
- `animal1.png`, `animal2.png`, `animal3.png`

This helps with organization and makes it easy to add new images.

## Copyright Notice

Ensure all images are:
- Original artwork, or
- Properly licensed for free distribution, or
- In the public domain

Do not use copyrighted images without permission.