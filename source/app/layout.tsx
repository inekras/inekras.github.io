import type { Metadata } from "next";
import { headers } from "next/headers";
import "katex/dist/katex.min.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const description =
    "Academic homepage of Ilia Nekrasov: research, publications, teaching, advising, and contact information.";

  return {
    metadataBase: baseUrl,
    title: "Ilia Nekrasov | Mathematician",
    description,
    applicationName: "Ilia Nekrasov / Homepage",
    authors: [{ name: "Ilia Nekrasov" }],
    creator: "Ilia Nekrasov",
    keywords: [
      "Ilia Nekrasov",
      "mathematics",
      "tensor categories",
      "model theory",
      "algebra",
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      title: "Ilia Nekrasov | Mathematician",
      description:
        "Research, publications, teaching, and advising in algebra, tensor categories, and model theory.",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Ilia Nekrasov — Mathematics, Tensor Categories, Model Theory",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ilia Nekrasov | Mathematician",
      description:
        "Research, publications, teaching, and advising in algebra, tensor categories, and model theory.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
