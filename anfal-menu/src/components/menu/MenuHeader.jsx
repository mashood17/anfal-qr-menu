import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { imageUrl } from '@/utils/imageUrl'

export default function MenuHeader({ restaurant }) {
  const heroImages = restaurant?.settings?.hero_images || []
  const hasHero    = heroImages.length > 0

  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (heroImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <header style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Hero background — UNTOUCHED */}
      {hasHero && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
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
                objectFit: 'cover', display: 'block',
              }}
            />
          </AnimatePresence>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(10,46,18,0.82) 100%)',
          }} />
        </div>
      )}

      {/* Logo — top-left, larger, no container */}
      {restaurant?.logo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '24px',
            left: '28px',
            zIndex: 2,
          }}
        >
          <img
            src={imageUrl(restaurant.logo)}
            alt={restaurant?.name}
            style={{
              height: 'clamp(52px, 7vw, 72px)',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.6))',
            }}
          />
        </motion.div>
      )}

      {/* Content — vertically centered in hero, not bottom-anchored */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          minHeight: hasHero ? 'clamp(260px, 40vw, 480px)' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',          // centered, not flex-end
          padding: hasHero
            ? '60px 24px 40px'              // balanced top/bottom
            : '52px 24px 0',
          textAlign: 'center',
          gap: '0',
        }}
      >
        {/* Restaurant name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(32px, 5.5vw, 72px)',
            fontWeight: 700,
            color: '#F5F2EC',
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            margin: 0,
            textShadow: hasHero ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
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
              fontSize: 'clamp(12px, 1.4vw, 15px)',
              color: hasHero ? 'rgba(245,242,236,0.65)' : 'var(--text-faint)',
              letterSpacing: '0.07em',
              marginTop: '10px',
              marginBottom: 0,
              fontStyle: 'italic',
            }}
          >
            {restaurant.tagline}
          </motion.p>
        )}

        {/* OUR MENU — strong secondary heading */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          style={{
            marginTop: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div style={{
            width: '36px', height: '1px',
            backgroundColor: 'rgba(198,255,0,0.5)',
          }} />
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(20px, 2.8vw, 36px)',
            fontWeight: 600,
            color: '#C6FF00',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: 0,
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            Our Menu
          </p>
          <div style={{
            width: '36px', height: '1px',
            backgroundColor: 'rgba(198,255,0,0.5)',
          }} />
        </motion.div>

        {/* Slide indicators */}
        {heroImages.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '20px' }}>
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                style={{
                  width: i === currentIdx ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i === currentIdx
                    ? '#C6FF00'
                    : 'rgba(198,255,0,0.25)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom fade — UNTOUCHED */}
      {hasHero && (
        <div style={{
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, var(--brand-dark))',
          position: 'relative', zIndex: 1,
        }} />
      )}
    </header>
  )
}