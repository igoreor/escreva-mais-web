export const metadata = {
  title: 'Escreva+',
  description: 'Plataforma de escrita e aprendizado',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
} 