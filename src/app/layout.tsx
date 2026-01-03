import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'All In',
  description: 'Your personal goal journal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen bg-cream-100">
        {children}
      </body>
    </html>
  );
}
