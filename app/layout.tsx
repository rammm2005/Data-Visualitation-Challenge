import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
// import { Sidebar } from "@/components/Sidebar/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Data Visualitaion",
  description:
    "A dynamic and responsive data visualization dashboard for Next.js, built with Shadcn/UI, featuring advanced charts, graphs, and interactive elements. Designed for seamless integration across desktop and mobile devices, providing insightful and visually appealing data displays",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "data/visualitaion",
    description:
      "A dynamic and responsive data visualization dashboard for Next.js, built with Shadcn/UI, featuring advanced charts, graphs, and interactive elements. Designed for seamless integration across desktop and mobile devices, providing insightful and visually appealing data displays",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "data/visualitaion",
    description:
      "A dynamic and responsive data visualization dashboard for Next.js, built with Shadcn/UI, featuring advanced charts, graphs, and interactive elements. Designed for seamless integration across desktop and mobile devices, providing insightful and visually appealing data displays"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <Sidebar /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
