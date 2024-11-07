import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";

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
  title: "Data Visualization Platform",
  description:
    "A comprehensive platform for data visualization and analytics, featuring interactive dashboards, spreadsheet integrations, API visualization options, and detailed data insights.",
  keywords:
    "data visualization, dashboard, API integration, spreadsheet, interactive charts",
  openGraph: {
    type: "website",
    images: [
      {
        url: "/image/dashboard.png",
        width: 1200,
        height: 630,
        alt: "Dashboard Preview",
      },
      {
        url: "/image/spreadsheet.png",
        width: 1200,
        height: 630,
        alt: "Spreadsheet Integration",
      },
      {
        url: "/image/excel-link.png",
        width: 1200,
        height: 630,
        alt: "API Selection for Visualization",
      },
      {
        url: "/image/visual-detail.png",
        width: 1200,
        height: 630,
        alt: "Detailed Visualization of API Data",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export const openGraphData = {
  dashboard: {
    url: "/dashboard",
    title: "Data Visualization Dashboard - Interactive Insights",
    description:
      "Explore a responsive data visualization dashboard with advanced, interactive data displays and analytics tools.",
  },
  spreadsheet: {
    url: "/excel-sheet",
    title: "Excel Link Integration - Data Visualization",
    description:
      "Seamlessly integrate Excel and other spreadsheet data for real-time visualizations and analytics.",
  },
  apiSelection: {
    url: "/visualization",
    title: "API Selection for Visualization",
    description:
      "Choose from multiple APIs to visualize your data effectively and make data-driven decisions.",
  },
  visualizationDetail: {
    url: "/visualization",
    title: "Detailed Data Visualization",
    description:
      "In-depth visualization of selected API data, providing comprehensive insights for better analysis.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
