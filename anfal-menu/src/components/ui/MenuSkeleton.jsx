function Pulse({ style }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(198,255,0,0.05)',
        borderRadius: '6px',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(198,255,0,0.06) 50%, transparent 100%)',
        animation: 'skeleton-sweep 1.6s ease-in-out infinite',
      }} />
    </div>
  )
}

export default function MenuSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skeleton-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Category nav skeleton */}
      <div style={{
        display: 'flex', gap: '8px',
        padding: '12px 0 10px',
        overflow: 'hidden',
      }}>
        {[80, 100, 72, 120, 88, 96, 76].map((w, i) => (
          <Pulse key={i} style={{ width: `${w}px`, height: '30px', borderRadius: '100px', flexShrink: 0 }} />
        ))}
      </div>

      {/* Search skeleton */}
      <Pulse style={{ width: '100%', height: '36px', borderRadius: '8px', marginBottom: '8px' }} />

      {/* Sections */}
      <div style={{ paddingTop: '32px' }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              marginBottom: '48px',
              paddingBottom: '48px',
              borderBottom: '1px solid rgba(198,255,0,0.06)',
            }}
          >
            {/* Category label */}
            <Pulse style={{ width: '80px', height: '11px', marginBottom: '10px' }} />
            {/* Category title */}
            <Pulse style={{ width: '200px', height: '36px', marginBottom: '24px' }} />

            {/* Item rows */}
            {[1, 2, 3, 4].map((r) => (
              <div
                key={r}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(198,255,0,0.04)',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Pulse style={{ width: `${[60, 75, 50, 65][r - 1]}%`, height: '14px' }} />
                  <Pulse style={{ width: `${[40, 55, 35, 45][r - 1]}%`, height: '11px' }} />
                </div>
                <Pulse style={{ width: '52px', height: '16px', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}