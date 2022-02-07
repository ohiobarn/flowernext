# Flower Power Next

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Doc

```bash
# Setup
mkdocs new .

# one time setup for material theme
python3 -m pip install mkdocs-material
python3 -m pip install mkdocs-mermaid2-plugin

# then
mkdocs serve
# Edit content and review changes here:
open http://127.0.0.1:8000/
```

### Publish Doc

```bash
mkdocs build --clean; mkdocs gh-deploy
open https://ohiobarn.github.io/flowerpower/ 
```

## Fontawesome

see this [post](https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react)

## Google Fonts

see this [post](https://fonts.google.com/)

## Roadmap

See: [ROADMAP.md](ROADMAP.md)
