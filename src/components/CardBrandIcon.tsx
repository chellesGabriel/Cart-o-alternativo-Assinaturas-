import { CreditCard } from 'lucide-react'
import brandMastercard from '../assets/brand-mastercard.svg'
import brandVisa from '../assets/brand-visa.svg'
import brandElo from '../assets/brand-elo.svg'
import brandAmex from '../assets/brand-amex.svg'

interface Props {
  brand: string
  size?: number
  opacity?: number
}

const brandAssets: Record<string, { src: string; bg: string }> = {
  Mastercard: { src: brandMastercard, bg: 'white' },
  Visa: { src: brandVisa, bg: 'white' },
  Elo: { src: brandElo, bg: 'white' },
  Amex: { src: brandAmex, bg: '#1f72cd' },
}

export default function CardBrandIcon({ brand, size = 35, opacity }: Props) {
  const h = Math.round(size * (24 / 35))
  const asset = brandAssets[brand]

  if (asset) {
    return (
      <div
        className="relative border border-[#e4e4e7] rounded flex-shrink-0 overflow-hidden flex items-center justify-center"
        style={{ width: size, height: h, backgroundColor: asset.bg, opacity }}
      >
        <img
          src={asset.src}
          alt={brand}
          className="max-w-[65%] max-h-[55%] object-contain"
        />
      </div>
    )
  }

  // Nenhuma bandeira — ícone genérico
  return (
    <div
      className="relative border border-[#e4e4e7] rounded flex-shrink-0 overflow-hidden flex items-center justify-center bg-white"
      style={{ width: size, height: h, opacity }}
    >
      <CreditCard className="text-gray-400" size={Math.round(h * 0.55)} />
    </div>
  )
}
