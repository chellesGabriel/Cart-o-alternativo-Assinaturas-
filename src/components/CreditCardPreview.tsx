import { useMemo } from 'react'
import CardBrandIcon from './CardBrandIcon'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props {
  cardNumber: string
  cardHolder: string
  expiry: string
  cvv: string
  brand: string
  isFlipped: boolean
}

function getBrandColors(brand: string): { from: string; to: string } {
  switch (brand) {
    case 'Visa':
      return { from: '#1a1f71', to: '#2d5bb9' }
    case 'Mastercard':
      return { from: '#eb001b', to: '#f79e1b' }
    case 'Elo':
      return { from: '#00a4e0', to: '#ef4123' }
    case 'Amex':
      return { from: '#006fcf', to: '#2e77bc' }
    default:
      return { from: '#374151', to: '#6b7280' }
  }
}

function ChipIcon() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
      <rect x="0.5" y="0.5" width="35" height="27" rx="4" fill="#d4a853" stroke="#c09940" />
      <line x1="0" y1="10" x2="36" y2="10" stroke="#c09940" strokeWidth="0.8" />
      <line x1="0" y1="18" x2="36" y2="18" stroke="#c09940" strokeWidth="0.8" />
      <line x1="12" y1="0" x2="12" y2="28" stroke="#c09940" strokeWidth="0.8" />
      <line x1="24" y1="0" x2="24" y2="28" stroke="#c09940" strokeWidth="0.8" />
    </svg>
  )
}

function ContactlessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(90deg)' }}>
      <path d="M8 2C8 2 11 5 11 12C11 19 8 22 8 22" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 5C12 5 14 7.5 14 12C14 16.5 12 19 12 19" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 8C16 8 17 9.5 17 12C17 14.5 16 16 16 16" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function CreditCardPreview({
  cardNumber,
  cardHolder,
  expiry,
  cvv,
  brand,
  isFlipped,
}: Props) {
  const colors = useMemo(() => getBrandColors(brand), [brand])
  const isMobile = useIsMobile()

  const cardWidth = isMobile ? 280 : 320
  const cardHeight = isMobile ? 175 : 200
  const fontSize = isMobile ? 15 : 17
  const padding = isMobile ? '16px 20px' : '20px 24px'

  const displayNumber = cardNumber || '•••• •••• •••• ••••'
  const displayHolder = cardHolder || 'SEU NOME AQUI'
  const displayExpiry = expiry || 'MM/AA'
  const displayCvv = cvv || '•••'

  return (
    <div
      className="mx-auto mb-6"
      style={{
        perspective: '1000px',
        width: cardWidth,
        height: cardHeight,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
            padding,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 28px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -60,
              left: -30,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
            }}
          />

          {/* Top row: chip + contactless + brand */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChipIcon />
              <ContactlessIcon />
            </div>
            <CardBrandIcon brand={brand} size={isMobile ? 40 : 48} noBg />
          </div>

          {/* Card number */}
          <div
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize,
              letterSpacing: 2,
              color: 'white',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              position: 'relative',
              zIndex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {displayNumber}
          </div>

          {/* Bottom row: holder + expiry */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                Titular
              </div>
              <div
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: isMobile ? 11 : 12,
                  color: 'white',
                  textTransform: 'uppercase',
                  maxWidth: isMobile ? 170 : 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {displayHolder}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                Validade
              </div>
              <div
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: isMobile ? 11 : 12,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {displayExpiry}
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
            boxShadow: '0 8px 28px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1)',
            transform: 'rotateY(180deg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Magnetic stripe */}
          <div
            style={{
              width: '100%',
              height: 42,
              background: '#1a1a1a',
              marginTop: 24,
            }}
          />

          {/* CVV area */}
          <div style={{ padding: isMobile ? '12px 20px' : '16px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, textAlign: 'right' }}>
              CVV
            </div>
            <div
              style={{
                background: 'white',
                borderRadius: 4,
                padding: '8px 16px',
                textAlign: 'right',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: 16,
                letterSpacing: 4,
                color: '#1a1a1a',
                fontWeight: 'bold',
              }}
            >
              {displayCvv}
            </div>

            {/* Bottom info */}
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', maxWidth: isMobile ? 150 : 180, lineHeight: 1.4 }}>
                Este cartão é de propriedade do emissor e deve ser devolvido quando solicitado.
              </div>
              <CardBrandIcon brand={brand} size={isMobile ? 40 : 48} noBg />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
