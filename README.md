This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Server env and Firebase Admin configuration

This project uses a small server API (`/api/admin/create-user`) which relies on the Firebase Admin SDK to securely create users and write privileged documents in Firestore.

Steps to configure locally:

1. Install the Admin SDK dependency:

```powershell
npm install firebase-admin
```

2. Provide a Firebase service account to the server. Two options:

- Recommended: set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account JSON file (example shown in `.env.example`).
- Alternative: set `FIREBASE_SERVICE_ACCOUNT` to the full JSON string (see `.env.example`).

Example (PowerShell) — set for the current user (persisted):

```powershell
setx GOOGLE_APPLICATION_CREDENTIALS "C:\secrets\service-account.json"
# Re-open your shell for the variable to be available to new processes
```

3. Ensure the admin user calling the API has a Firestore doc at `admins/{uid}` (the route checks for that doc). You can create this document manually in the Firestore Console for the admin UID.

4. Restart the dev server:

```powershell
npm run dev
```

If you prefer, I can change the server route to use custom claims or help you set up a secure Cloud Function instead.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
