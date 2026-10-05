import "./globals.css";

export const metadata = {
  title: "AI Soil Analytics",
  description:
    "Smart soil analysis and crop recommendations for farmers",
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#2e7d32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}