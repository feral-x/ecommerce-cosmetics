import { Noto_Sans } from 'next/font/google'

/** Единый UI + editorial: ровная читаемость, latin + cyrillic. */
export const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-noto-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const fontClassNames = notoSans.variable
