import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StartupFrontier — Startup Team Builder Platform",
  description: "Publish startup ideas, build exceptional teams, and recruit talented collaborators.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // Crucial for next-themes to suppress the initial mismatch warning
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/40 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200">
        
        {/* Soft purple/indigo gradient blur backdrop */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/50 via-transparent to-transparent blur-3xl dark:from-violet-950/20 pointer-events-none" />

        {/* Placing ThemeProvider here allows next-themes to append its script safely to the <head> */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}