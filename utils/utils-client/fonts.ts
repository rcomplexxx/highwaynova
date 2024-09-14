
import { Inter, EB_Garamond } from 'next/font/google'


export const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-inter',
})

export const eb_Garamond = EB_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '600', '800'],
    display: 'swap',
    variable: '--font-eb_garamond',
})