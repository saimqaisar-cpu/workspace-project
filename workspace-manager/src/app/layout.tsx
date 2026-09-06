import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import "./globals.css";

// Dynamic SVG Green W Icon encoded as Data URI
const greenWIcon = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#15803d"/>
  <text x="16" y="23" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">W</text>
</svg>
`)}`;

export const metadata: Metadata = {
  title: "WorkSpace App",
  description: "WorkSpace Management Project",
  icons: {
    icon: greenWIcon,
    shortcut: greenWIcon,
    apple: greenWIcon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased bg-gray-50 text-gray-900" suppressHydrationWarning>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}