import Link from 'next/link'

type StubPageProps = {
  title: string
}

export function StubPage({ title }: StubPageProps) {
  return (
    <main className="container mx-auto min-h-[calc(100svh-5rem)] px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-primary-soft">
        Coming soon
      </p>
      <h1 className="mt-4 font-display text-4xl text-text-primary">{title}</h1>
      <Link
        href="/"
        className="mt-8 inline-block text-primary transition-colors hover:text-primary-soft"
      >
        ← Back to home
      </Link>
    </main>
  )
}
