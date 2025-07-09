import React from 'react';
import '../styles/index.css';
import '../styles/tailwind.css' 


export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Escreva +',
  keywords: ['escreva+', 'escreva mais', 'escreva mais', 'escreva mais web app', 'escreva mais app', 'escreva mais web'],
  description: 'Escreva + é um aplicativo web para correção de redações com inteligência artificial.',
  icons: {
    icon: [
      { url: '/images/img_logo.svg', type: 'image/x-icon' }
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
