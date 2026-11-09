/** Статичный заголовок каталога (позже может прийти с CMS/API). */
export function CatalogPageHeader() {
  return (
    <header className="mb-8 lg:mb-10">
      <h1 className="font-display text-3xl text-text-primary sm:text-4xl">
        Shop J-Beauty
      </h1>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-text-secondary">
        Authentic Japanese skincare, makeup, and sun care — from drugstore icons
        to salon-grade brands like Shiseido, SK-II, and IPSA.
      </p>
    </header>
  )
}
