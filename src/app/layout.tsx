import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./mui/themeRegistry";

import { configDotenv } from "dotenv";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Online Scheduling",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  configDotenv()
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry options={{ key: "mui-theme" }}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
