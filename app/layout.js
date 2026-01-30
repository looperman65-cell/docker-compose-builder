export const metadata = {
  title: 'Docker Compose Builder - Visual Editor',
  description: 'Free drag-and-drop builder for docker-compose.yml. Create Docker configs visually with 7+ container types, edit ports, env variables. No signup required.',
  keywords: 'docker compose, docker compose builder, docker compose generator, visual docker, docker yml generator',
  openGraph: {
    title: 'Docker Compose Builder',
    description: 'Visual drag-and-drop builder for docker-compose.yml',
    url: 'https://docker-compose-builder-sable.vercel.app',
    siteName: 'Docker Compose Builder',
    images: [
      {
        url: '/og-image.png', // создадим позже
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Docker Compose Builder',
    description: 'Visual drag-and-drop builder for docker-compose.yml',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}