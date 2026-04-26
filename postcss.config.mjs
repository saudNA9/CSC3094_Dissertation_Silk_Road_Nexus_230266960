// postcss.config.mjs
// PostCSS configuration for the Silk Road Nexus platform.
// It will:
// - Run Tailwind CSS as a PostCSS plugin so utility classes are generated at build time
// - Integrate with Next.js's built-in CSS pipeline automatically

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind processes all scanned files and generates only the used utility classes
    tailwindcss: {},
  },
}

export default config
