Qulado.com static site (no build step, no dependencies)

Files
  index.html  page content
  styles.css  design system and layout
  config.js   EDIT THIS: price, email, marketplace URL, availability, form endpoint, insight scores
  app.js      behavior (reads config.js)

Go live
  1. In config.js set marketplaceUrl to the real Hostinger listing URL. All Acquire buttons update.
  2. Optional: set offerMethod to "endpoint" and offerEndpoint to an https form-service URL.
  3. Upload all four files to any static host.
  4. In index.html, update the canonical/og:url (https://qulado.com/) if hosted elsewhere, and add an og:image if you have one.
