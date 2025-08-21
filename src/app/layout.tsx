import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Fun With Us - Markdown Preview & Editor',
    template: '%s | Fun With Us'
  },
  description: 'Preview and edit Markdown content in real-time before creating presentations in Gamma. Perfect for content preparation, slide structure planning, and markdown formatting validation.',
  keywords: ['markdown', 'preview', 'editor', 'gamma', 'presentation', 'content preparation', 'slide planning', 'markdown validation', '演示文稿', '幻灯片'],
  authors: [{ name: 'Fun With Us Team' }],
  creator: 'Fun With Us',
  publisher: 'Fun With Us',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://fun-withus-markdown-ppt.vercel.app" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fun With Us" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
