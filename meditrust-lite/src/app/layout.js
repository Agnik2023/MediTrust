import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserProvider } from "./utils/UserContext";
import { MetaMaskProvider } from "./utils/MetaMaskProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MediTrust - Secure Medical Record Storage",
  description: "Store and share your medical records securely using blockchain technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <MetaMaskProvider>
          <UserProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </UserProvider>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
