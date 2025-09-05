import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components
import HeroSection from "@/layouts/Header/HeroSection";
import FooterSection from "@/layouts/FooterSection";
import Spinner from "@/components/Spinner";
import AlertBar from "@/components/AlertBar";

// Contexts
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { ErrorProvider } from "@/contexts/ErrorContex";
import { Metadata } from "next";

//metadata
export const metadata: Metadata = {
  title: "GitCollab.io",
  description: "A collaborative task management tool",
  keywords: ["collaboration", "task management", "productivity"],
};

// Fonts

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// A wrapper for protecting pages
const ProtectedWrapper = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return <Spinner />; // loading state
  if (!isAuthenticated) return <div>You must log in to access this page.</div>; // fallback
  return <>{children}</>;
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AlertProvider>
          <ErrorProvider>
            <AuthProvider>
              <ProjectsProvider>
                <div id="root">
                  <HeroSection />
                  <AlertBar />
                  <div id="main-container">{children}</div>
                  <FooterSection />
                </div>
              </ProjectsProvider>
            </AuthProvider>
          </ErrorProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
