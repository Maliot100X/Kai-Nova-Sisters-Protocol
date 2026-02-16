import type { Metadata } from "next";
import { IBM_Plex_Mono } from 'next/font/google'
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: "KAI-NOVA SISTERS PROTOCOL | V3.0",
  description: "Autonomous Strategic Execution & Defense Network // THE DEFINITIVE TERMINAL UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${ibmPlexMono.variable} font-mono antialiased bg-[#050505] text-[#e0e0e0]`}>
        {children}
      </body>
    </html>
  );
}
