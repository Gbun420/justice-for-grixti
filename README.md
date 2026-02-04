# Justice Campaign Landing Page

A premium, community-driven landing page dedicated to the legacy of service of Dr. Silvio Grixti.

## Features

- **Premium Design**: Navy and gold theme with glassmorphism and scroll animations.
- **Authentic Narrative**: Centered on community care and public service impact.
- **Anonymous Support Form**: Ready for message collection.
- **SEO Optimized**: Includes Open Graph tags for professional Facebook sharing.

## Local Development

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`

## Deployment & Production

To go live, we recommend:

1. **Hosting**: Deploying to **Vercel** or **Cloudflare Pages** (one-click deployment).
2. **Database**: Connecting the form in `src/main.ts` to a **Supabase** table to store support messages.
3. **Security**: Using an anonymous email provider (e.g., ProtonMail) for the contact point: `justiceforgrixti@proton.me`

## Customization

- **Images**: Replace the SVG placeholders in `index.html` with real campaign photos.
- **Meta Tags**: Update the `og:url` in `index.html` once you have a live domain.
