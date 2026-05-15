# Drunken Arsenal - E-commerce MVP

A military-themed tactical drinking game e-commerce platform built with Next.js 16, featuring:

## Features

- **Product Catalog**: Browse Shot Wave games, artillery shells, tactical mines, and bundles
- **Shopping Cart**: Session-based cart with quantity management
- **Stripe Checkout**: Embedded checkout flow with order tracking
- **Authentication**: Secure user accounts with password hashing
- **Internationalization**: Support for English, Spanish, German, and French
- **Responsive Design**: Mobile-first tactical aesthetic
- **Database**: PostgreSQL via Neon with direct SQL queries

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Neon PostgreSQL
- **Payments**: Stripe Embedded Checkout
- **Styling**: Tailwind CSS v4 with custom military theme
- **Authentication**: Custom session-based auth
- **i18n**: Custom translation system

## Getting Started

1. Install dependencies (automatically inferred from imports)
2. Set up environment variables (Neon and Stripe already configured)
3. Run database scripts:
   - `scripts/001-create-tables.sql`
   - `scripts/002-seed-products.sql`
4. Start the development server
5. Visit the site and start shopping!

## Localization

The site supports 4 languages:
- English (en) - Default
- Spanish (es)
- German (de)
- French (fr)

Users can switch languages via cookie preferences. All UI strings are translated.

## Important Notes

- 18+ only - This is a drinking game platform
- Always drink responsibly
- Free shipping on orders over $50
- 30-day returns policy

## Project Structure

\`\`\`
app/
├── actions/          # Server actions (auth, stripe)
├── api/              # API routes (cart, auth status)
├── cart/             # Shopping cart page
├── checkout/         # Stripe checkout page
├── product/[slug]/   # Product detail pages
├── sign-in/          # Authentication
├── sign-up/          # Registration
├── account/          # User dashboard
└── how-to-play/      # Game instructions

components/           # Reusable UI components
lib/
├── i18n/            # Translation system
├── auth.ts          # Authentication logic
├── cart.ts          # Cart management
├── products.ts      # Product queries
├── db.ts            # Database connection
└── stripe.ts        # Stripe client

scripts/             # SQL database scripts
\`\`\`

## License

All rights reserved - Drunken Arsenal 2025
