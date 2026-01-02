import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Whatever It Takes',
  description: 'An LLM-powered quarterly goal management platform',
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
