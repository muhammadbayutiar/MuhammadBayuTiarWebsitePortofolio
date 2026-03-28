import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

function getMetadataBase() {
  const fallbackUrl = "http://localhost:3000";

  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}

// IMPORTANT: Set NEXT_PUBLIC_SITE_URL in production environment variables
// Example: NEXT_PUBLIC_SITE_URL=https://yourdomain.com
export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  
  title: {
    default: "Muhammad Bayu Tiar - Website",
    template: "%s | Muhammad Bayu Tiar",
  },
  
  description: "AI & Computer Vision Developer | Web Development | UI/UX Design | Computer Science @ Universitas Lampung",
  
  keywords: [
    "Muhammad Bayu Tiar",
    "AI Developer",
    "Computer Vision",
    "Web Development",
    "UI/UX Design",
    "Machine Learning",
    "Next.js",
    "React",
    "TypeScript",
    "Computer Science",
  ],
  
  authors: [{ name: "Muhammad Bayu Tiar" }],
  
  creator: "Muhammad Bayu Tiar",
  
  icons: {
    icon: "/favicon.ico",
  },
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Muhammad Bayu Tiar",
    title: "Muhammad Bayu Tiar - Website",
    description: "Computer Science graduate with experience in web system development, database design, UI/UX development, and computer vision based data analysis.",
    images: [
      {
        url: "/media/fotodiri/fotoprofile.jpeg",
        width: 1200,
        height: 630,
        alt: "Muhammad Bayu Tiar",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Bayu Tiar - Website",
    description: "AI & Computer Vision Developer | Web Development | UI/UX Design",
    images: ["/media/fotodiri/fotoprofile.jpeg"],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* MAIN CONTENT */}
          <main className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
