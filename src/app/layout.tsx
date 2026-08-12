import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth/context';
import { ChatProvider } from '@/lib/chat/context';
import { ServiceWorkerRegister } from '@/components/pwa/sw-register';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SpartanCircle',
  description: 'Find your campus community at SJSU. Connect with friends, study buddies, and project partners.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SpartanCircle',
  },
};

export const viewport: Viewport = {
  themeColor: '#0055A2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0055A2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
          <Toaster />
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
