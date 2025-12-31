import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GTFOR26 - AI-Powered Goal Management',
  description: 'An LLM-powered quarterly goal management platform for ambitious twentysomethings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
