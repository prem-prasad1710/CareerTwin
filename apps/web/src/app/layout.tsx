import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CareerTwin AI — Predict Your Future Career',
  description: 'Your Digital Twin for career intelligence. Predict outcomes, identify skill gaps, simulate decisions, and accelerate your career.',
  keywords: ['career', 'AI', 'prediction', 'skills', 'salary', 'job search'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
