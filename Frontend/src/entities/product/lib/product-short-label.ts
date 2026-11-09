/** Лимит для заголовка на карточке в каталоге (полное имя — на PDP). */
export const PRODUCT_CARD_SHORT_DESCRIPTION_MAX = 48

export function buildShortDescription(
  name: string,
  maxLength = PRODUCT_CARD_SHORT_DESCRIPTION_MAX,
): string {
  const trimmed = name.trim()
  if (trimmed.length <= maxLength) return trimmed

  const slice = trimmed.slice(0, maxLength - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const cut =
    lastSpace > Math.floor(maxLength * 0.5)
      ? slice.slice(0, lastSpace)
      : slice.trimEnd()

  return `${cut}…`
}
