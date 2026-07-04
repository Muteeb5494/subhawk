import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeToggle } from "@/components/theme-toggle";

// Runs before paint to apply the saved theme and avoid a flash of the wrong one.
const themeInit = `
try {
  var t = localStorage.getItem('theme');
  var d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', d);
} catch (e) {}
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubHawk: track subscriptions and free trials",
  description:
    "Never get charged by surprise again. Track every subscription and free trial. No bank details required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
