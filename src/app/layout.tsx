import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const description =
  "Create structured AI interviews once, interview candidates consistently, and review evidence-backed assessments with humans in control of hiring decisions.";

export const metadata: Metadata = {
  title: {
    default: "Hire Evidence — Structured AI Interviews",
    template: "%s | Hire Evidence",
  },
  description,
  applicationName: "Hire Evidence",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Hire Evidence — Structured AI Interviews",
    description,
    siteName: "Hire Evidence",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
