import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Maker Lab Map P — Find fabrication capability nearby",
    template: "%s | Maker Lab Map P",
  },
  description:
    "Find source-backed maker labs, workshops, hackerspaces, school labs, and fabrication services across Brooklyn, New York.",
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
