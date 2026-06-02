import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

const NAV = [
  { to: '/',            label: 'Dashboard',  end: true },
  { to: '/categories',  label: 'Categories'            },
  { to: '/items',       label: 'Menu Items'            },
  { to: '/branding',    label: 'Branding'              },
]

export default function Sidebar({ onNavigate, showClose, onClose }) {
  const logout   = useAuthStore((s) => s.logout)
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        backgroundColor: '#111827',
        borderRight: '1px solid #1f2937',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Admin Panel
          </p>
          <p style={{ color: '#f9fafb', fontWeight: 600, marginTop: '2px', fontSize: '15px' }}>
            Anfal Restaurant
          </p>
        </div>

        {/* Close button — mobile drawer only */}
        {showClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: '#6b7280', cursor: 'pointer',
              fontSize: '20px', lineHeight: 1,
              padding: '4px',
            }}
            aria-label="Close menu"
          >
            ×
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.15s',
              backgroundColor: isActive ? 'rgba(198,255,0,0.08)' : 'transparent',
              color: isActive ? '#C6FF00' : '#9ca3af',
              fontWeight: isActive ? 600 : 400,
              borderLeft: isActive ? '2px solid #C6FF00' : '2px solid transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #1f2937' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </p>
        <button
          onClick={handleLogout}
          style={{
            marginTop: '8px', fontSize: '12px',
            color: '#6b7280', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
          onMouseOver={(e) => e.target.style.color = '#f87171'}
          onMouseOut={(e) => e.target.style.color = '#6b7280'}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}