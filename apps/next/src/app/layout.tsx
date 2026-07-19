import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/shared/providers";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jurisprudencia Nacional - Sistema Legal Peruano",
  description:
    "Plataforma de consulta de casos legales y jurisprudencia del sistema judicial peruano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${merriweather.variable} ${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
