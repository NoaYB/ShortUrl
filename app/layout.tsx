import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AppReel - URL Shortener',
  description: 'A simple system for shortening long URLs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="background-gradient"></div>
        {children}
      </body>
    </html>
  );
}
