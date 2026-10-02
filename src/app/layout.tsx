import type { ReactNode } from 'react';
import '@/styles/globals.css';

// Pass-through root layout: <html> is rendered by app/[locale]/layout.tsx (locale-specific lang/dir).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
