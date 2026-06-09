import { motion } from 'framer-motion'

export default function PageLoader({ restaurant }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: '#0A2E12',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 999,
        gap: '0',
      }}
    >
      {/* Logo */}
      {restaurant?.logo && (
        <motion.img
          src={restaurant.logo}
          alt={restaurant?.name || 'Anfal Restaurant'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            height: '64px', width: 'auto',
            objectFit: 'contain',
            marginBottom: '20px',
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}

      {/* Restaurant name */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(20px, 4vw, 28px)',
          fontWeight: 700,
          color: '#F5F2EC',
          letterSpacing: '-0.01em',
          marginBottom: '32px',
        }}
      >
        {restaurant?.name || 'Anfal Restaurant'}
      </motion.p>

      {/* Spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ position: 'relative', width: '40px', height: '40px', marginBottom: '20px' }}
      >
        {/* Track */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(198,255,0,0.12)',
        }} />
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#C6FF00',
          }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#C6FF00',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        Loading Menu
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{
          fontSize: '12px',
          color: 'rgba(245,242,236,0.35)',
          letterSpacing: '0.04em',
        }}
      >
        Preparing your dining experience
      </motion.p>
    </motion.div>
  )
}