import type { Metadata, Viewport } from "next";
import './globals.css';
import '../styles/themes.css';
import React from "react";
import { Providers } from './providers'

export const metadata: Metadata = {
  title: "12Days - Christmas Challenge Game",
  description: "A retro Christmas gaming experience with daily challenges and dynamic themes",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
