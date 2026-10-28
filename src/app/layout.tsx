import type { Metadata } from "next";
import localFont from "next/font/local";
import { StoreProvider } from "./store-provider";
import "./globals.css";

// Graphik is the face the Prayag Drupal theme ships (themes/custom/prayag/assets/fonts).
const graphik = localFont({
  src: [
    { path: "../../public/sites/prayag/fonts/Graphik-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/sites/prayag/fonts/Graphik-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/sites/prayag/fonts/Graphik-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/sites/prayag/fonts/Graphik-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/sites/prayag/fonts/Graphik-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-graphik",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prayagindia.com"),
  title: "Prayag Polymers Limited - India's No.1 Sanitaryware Manufacturer",
  description:
    "Prayag Polymers Limited is India’s leading Sanitaryware manufacturing brand. It offers a premium, wide range of reliable, and affordable sanitary products in India.",
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${graphik.variable} antialiased`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
