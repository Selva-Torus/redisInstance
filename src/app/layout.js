import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/utilsFunctions/sessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Torus Redis Instance",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <h2 className="text-center font-bold pt-2 text-gray-400">Torus Insight Redis Tool</h2>
        <SessionProvider>{children}</SessionProvider>
        </body>
    </html>
  );
}
