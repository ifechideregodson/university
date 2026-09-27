import "./globals.css";
import ServiceWorker from "./ServiceWorker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doorway Online Teaching Website",
  description: "Doorway Online Teaching Website — digital teaching, learning and university education management platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><ServiceWorker />{children}</body>
    </html>
  );
}
