import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { imageUrl } from '@/utils/imageUrl'

export default function MenuHeader({ restaurant }) {
  const heroImages = restaurant?.settings?.hero_images || []
  const hasHero    = heroImages.length > 0

  const [currentIdx, setCurrentIdx] = useState(0)

  // Auto-rotate hero images
  useEffect(() => {
    if (heroImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <header style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Hero background image ── */}
      {hasHero && (
        <div
          style={{
            position: 'absolute', inset: 0,
            zIndex: 0,
          }}
        >
          <AnimatePresence mode="sync">
            <motion.img
              key={currentIdx}
              src={imageUrl(heroImages[currentIdx])}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </AnimatePresence>

          {/* Dark gradient overlay for text legibility */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(10,46,18,0.82) 100%)',
          }} />
        </div>
      )}

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          minHeight: hasHero ? 'clamp(260px, 40vw, 480px)' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: hasHero
            ? 'clamp(60px, 8vw, 100px) 24px 32px'
            : '28px 24px 0',
          textAlign: 'center',
        }}
      >
        {/* Mobile logo — absolute top-left */}
        {restaurant?.logo && (
          <>
            {/* Mobile: top-left */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="logo-mobile"
              style={{
                position: 'absolute',
                top: '16px', left: '16px',
                width: '52px', height: '52px',
                borderRadius: '12px',
                backgroundColor: hasHero
                  ? 'rgba(0,0,0,0.35)'
                  : 'rgba(198,255,0,0.06)',
                border: '1px solid rgba(198,255,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <img
                src={imageUrl(restaurant.logo)}
                alt={restaurant?.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </motion.div>

            {/* Desktop: centered above name */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="logo-desktop"
              style={{
                width: 'clamp(100px, 12vw, 140px)',
                height: 'clamp(100px, 12vw, 140px)',
                borderRadius: '20px',
                backgroundColor: hasHero
                  ? 'rgba(0,0,0,0.3)'
                  : 'rgba(198,255,0,0.06)',
                border: '1px solid rgba(198,255,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                backdropFilter: 'blur(8px)',
                marginBottom: '20px',
              }}
            >
              <img
                src={imageUrl(restaurant.logo)}
                alt={restaurant?.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </motion.div>
          </>
        )}

        {/* Restaurant name */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 64px)',
            fontWeight: 700,
            color: '#F5F2EC',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            margin: 0,
            textShadow: hasHero ? '0 2px 20px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {restaurant?.name || 'Anfal Restaurant'}
        </motion.h1>

        {/* Tagline */}
        {restaurant?.tagline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            style={{
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              color: hasHero ? 'rgba(245,242,236,0.75)' : 'var(--text-faint)',
              letterSpacing: '0.08em',
              marginTop: '8px',
              fontStyle: 'italic',
            }}
          >
            {restaurant.tagline}
          </motion.p>
        )}

        {/* Our Menu divider */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          style={{
            marginTop: hasHero ? '24px' : '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ width: '32px', height: '1px', backgroundColor: 'rgba(198,255,0,0.35)' }} />
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontWeight: 600,
            color: '#C6FF00',
            letterSpacing: '0.06em',
            margin: 0,
          }}>
            Our Menu
          </p>
          <div style={{ width: '32px', height: '1px', backgroundColor: 'rgba(198,255,0,0.35)' }} />
        </motion.div>

        {/* Slide indicators */}
        {heroImages.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                style={{
                  width: i === currentIdx ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i === currentIdx ? '#C6FF00' : 'rgba(198,255,0,0.25)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom fade into menu */}
      {hasHero && (
        <div style={{
          height: '40px',
          background: `linear-gradient(to bottom, transparent, var(--brand-dark))`,
          position: 'relative', zIndex: 1,
        }} />
      )}
    </header>
  )
}