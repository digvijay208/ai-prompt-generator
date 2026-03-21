import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "AI Prompt Generator",
  description: "Generate hyper-premium AI prompts with cinematic precision.",
  verification: {
    google: "YRwNGqmrP6ANUNKrfLtumgtTAU87BjU8hlDhWUhz3mI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-midnight-flow`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
