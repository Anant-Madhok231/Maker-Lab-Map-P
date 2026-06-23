import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Maker Lab Map P — Find fabrication capability nearby",
    template: "%s | Maker Lab Map P",
  },
  description:
    "Find evidence-backed CNC routers, laser cutters, 3D printers, woodshops, and fabrication services near Davis and Sacramento.",
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
