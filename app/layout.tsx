import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import ConvexClientProvider from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BabyNoteApp",
    description: "Your Ideas, Documents & Plans. Unified.",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/logo.svg",
                href: "/logo.svg",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/logo-dark.svg",
                href: "/logo-dark.svg",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ConvexClientProvider>
                    <EdgeStoreProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                            storageKey="babynotion-theme"
                        >
                            <Toaster position="bottom-center" />
                            <ModalProvider />
                            {children}
                        </ThemeProvider>
                    </EdgeStoreProvider>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
