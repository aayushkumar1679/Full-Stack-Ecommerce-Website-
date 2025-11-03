import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Analytics } from "@vercel/analytics/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ÉLEGANCE",
  description: "A Demo Site by Ayush",
  icons: {
    icon: [
      { url: "/hello.svg", sizes: "16x16", type: "image/svg+xml" },
      // { url: "/hello.svg", sizes: "32x32", type: "image/svg+xml" },
      // { url: "/hello.svg", sizes: "64x64", type: "image/svg+xml" },
      // { url: "/hello.svg", sizes: "128x128", type: "image/svg+xml" },
      // { url: "/hello.svg", sizes: "256x256", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
