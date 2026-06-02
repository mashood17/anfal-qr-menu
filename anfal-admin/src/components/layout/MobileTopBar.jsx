import useAuthStore from '@/store/authStore'

export default function MobileTopBar({ onMenuClick }) {
  return (
    <div
      style={{
        height: '56px',
        backgroundColor: '#111827',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        style={{
          background: 'none', border: 'none',
          cursor: 'pointer', padding: '8px',
          display: 'flex', flexDirection: 'column',
          gap: '5px',
        }}
        aria-label="Open menu"
      >
        {[0,1,2].map((i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: '20px', height: '2px',
              backgroundColor: '#9ca3af',
              borderRadius: '1px',
            }}
          />
        ))}
      </button>

      {/* Title */}
      <p style={{ color: '#f9fafb', fontSize: '15px', fontWeight: 600 }}>
        Anfal Admin
      </p>

      {/* Spacer to balance layout */}
      <div style={{ width: '36px' }} />
    </div>
  )
}