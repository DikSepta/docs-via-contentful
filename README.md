# Documentation via Contentful

This project is a modern documentation website built with **Next.js**, **React**, **Tailwind CSS**, and **TypeScript**. The content is dynamically sourced from **Contentful**, providing a powerful and flexible headless CMS for managing documentation.

It is based on the [rubix-documents](https://github.com/rubixvi/rubix-documents) starter kit.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI**: [React](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Content**: [Contentful](https://www.contentful.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [pnpm](https://pnpm.io/installation) (or your preferred package manager)

### 2. Clone the Repository

```bash
git clone <your-repository-url>
cd docs-via-contentful
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Set Up Environment Variables

This project requires API keys from Contentful to fetch content. Create a `.env.local` file in the root of the project and add the following variables:

```env
# Contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
```

You can find these keys in your Contentful space settings.

### 5. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (e.g., GitHub).
2.  Import the repository into Vercel.
3.  Configure the environment variables in the Vercel project settings.
4.  Deploy! Vercel will automatically build and deploy your Next.js application.

---

## Content Management

All documentation content is managed in Contentful. To add or update content, log in to your Contentful space and edit the corresponding content models and entries.

Changes in Contentful will be reflected on the website after a new deployment or through on-demand revalidation.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
