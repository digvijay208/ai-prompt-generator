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
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <footer className="w-full border-t border-glass-border bg-black/20 backdrop-blur-md py-6 mt-auto shrink-0 z-50">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-text-secondary font-medium tracking-wide">
                  &copy; {new Date().getFullYear()} AI Prompt Generator. All rights reserved.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <a href="/about" className="text-xs text-text-secondary hover:text-primary transition-colors font-medium">About</a>
                  <a href="/privacy" className="text-xs text-text-secondary hover:text-primary transition-colors font-medium">Privacy</a>
                  <a href="/terms" className="text-xs text-text-secondary hover:text-primary transition-colors font-medium">Terms</a>
                  <a href="/contact" className="text-xs text-text-secondary hover:text-primary transition-colors font-medium">Contact</a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
