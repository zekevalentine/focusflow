import './globals.css';
import Header from '@/src/components/Header';

export const metadata = { title: 'Job Hunter FocusFlow' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
