import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRUTH DRILLING PROTOCOL",
  description: "Autonomous Strike & Debate Substrate // KAI & NOVA",
  other: {
    "base:app_id": "6993fc73e0d5d2cf831b5eb7",
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://kai-nova-sisters-protocol-kntws.vercel.app/og-image.png",
      button: {
        title: "Open App",
        action: {
          type: "launch_frame",
          name: "Truth Drilling",
          url: "https://kai-nova-sisters-protocol-kntws.vercel.app/",
          splashImageUrl: "https://kai-nova-sisters-protocol-kntws.vercel.app/icon.png",
          splashBackgroundColor: "#050505"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-[#e0e0e0] font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
