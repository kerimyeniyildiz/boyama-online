# Setup Guide - Fun Coloring Pages

Welcome! This guide will help you set up and customize your coloring pages website.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

### 3. Add Your Coloring Pages
1. Create directories in `public/coloring-pages/` for each category
2. Add PNG images to the category folders
3. Update `lib/data.ts` to include your images

## 📁 Adding Content

### Step 1: Organize Your Images
Place your coloring page images in category folders:
```
public/coloring-pages/
├── elsa/
│   ├── elsa1.png
│   ├── elsa2.png
│   └── elsa3.png
├── cars/
│   ├── car1.png
│   └── car2.png
└── animals/
    ├── animal1.png
    ├── animal2.png
    └── animal3.png
```

### Step 2: Update the Data File
Edit `lib/data.ts` to match your content:

```typescript
export const categories: Category[] = [
  {
    slug: "elsa-coloring-pages",
    title: "Elsa Coloring Pages",
    description: "Beautiful Elsa coloring pages...",
    metaDescription: "Free printable Elsa coloring pages...",
    keywords: ["elsa", "frozen", "disney"],
    images: [
      "/coloring-pages/elsa/elsa1.png",
      "/coloring-pages/elsa/elsa2.png",
      "/coloring-pages/elsa/elsa3.png"
    ],
    featured: true
  },
  // Add more categories...
];
```

### Step 3: Customize Site Information
Update the `siteConfig` in `lib/data.ts`:
```typescript
export const siteConfig = {
  name: "Your Site Name",
  description: "Your site description...",
  url: "https://yoursite.com",
  keywords: ["your", "keywords"]
};
```

## 🎨 Customizing Design

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    // Your primary color shades
  },
  secondary: {
    // Your secondary color shades
  }
}
```

### Fonts
Update font imports in `app/layout.tsx` and `app/globals.css`

### Logo
Replace the emoji logo in `components/Header.tsx` with your own logo

## 📈 SEO Configuration

### Site Information
Update these files with your actual domain:
- `lib/data.ts` - Change the `url` in `siteConfig`
- `app/layout.tsx` - Update metadata

### Google Analytics (Optional)
Add your Google Analytics ID to `app/layout.tsx`:
```typescript
// Add Google Analytics script tags
```

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push
3. Get a free `.vercel.app` domain

### Netlify
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `out` (if using static export)

### Traditional Hosting
```bash
npm run build
npm run export  # For static hosting
```
Upload the `out` folder to your web host.

## 📱 Testing

### Local Testing
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### Mobile Testing
Use Chrome DevTools or test on actual devices.

### SEO Testing
- Google Search Console
- Google Rich Results Test
- Lighthouse audit

## 🔧 Advanced Configuration

### Adding New Page Types
1. Create new route in `app/` folder
2. Add navigation links if needed
3. Update sitemap in `app/sitemap.ts`

### Custom Components
Add new components in `components/` folder and import where needed.

### Performance Optimization
- Images are automatically optimized by Next.js
- Consider adding a CDN for faster global loading
- Enable compression on your hosting provider

## 🛠️ Troubleshooting

### Common Issues

**Images not loading:**
- Check file paths in `lib/data.ts`
- Ensure images are in the correct folders
- Verify image file extensions match the data

**Build errors:**
- Run `npm run lint` to check for errors
- Ensure all imports are correct
- Check TypeScript types

**SEO issues:**
- Verify all URLs in sitemap are correct
- Test structured data with Google's tool
- Check meta tags in browser dev tools

### Getting Help
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Tailwind CSS docs](https://tailwindcss.com/docs)
- Create an issue on GitHub

## 📋 Checklist

Before going live:
- [ ] All images added and paths updated
- [ ] Site information customized
- [ ] SEO metadata configured
- [ ] Tested on mobile devices
- [ ] Performance audit passed
- [ ] Domain configured
- [ ] Analytics set up (optional)

## 🎉 You're Ready!

Your coloring pages website is now ready to bring joy to kids everywhere!

Need help? Contact: hello@funcoloringpages.com