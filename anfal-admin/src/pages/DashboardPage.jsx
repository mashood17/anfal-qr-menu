import { useQuery }    from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAdminCategories, getAdminItems } from '@/api/menu'

export default function DashboardPage() {
  const { data: categories = [] } = useQuery({ queryKey: ['admin-cats'],  queryFn: getAdminCategories })
  const { data: items = [] }      = useQuery({ queryKey: ['admin-items'], queryFn: getAdminItems })
  const featured                  = items.filter((i) => i.badge === 'best_seller')
  const navigate                  = useNavigate()

  const stats = [
    { label: 'Categories', value: categories.length, path: '/categories' },
    { label: 'Menu Items', value: items.length,       path: '/items'      },
    { label: 'Featured',   value: featured.length,    path: '/items'      },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Welcome back</p>
      </div>

      {/* Stats — 1 col mobile, 3 col desktop */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        {stats.map(({ label, value, path }) => (
          <div
            key={label}
            onClick={() => navigate(path)}
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(198,255,0,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#1f2937'}
          >
            <p style={{ fontSize: '36px', fontWeight: 700, color: '#f9fafb' }}>{value}</p>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#f9fafb', marginBottom: '12px' }}>
          Quick actions
        </p>
        <div className="admin-actions-grid">
          {[
            { label: 'Manage Categories', path: '/categories' },
            { label: 'Manage Items',      path: '/items'      },
            { label: 'Edit Branding',     path: '/branding'   },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#d1d5db',
                fontSize: '13px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'background-color 0.15s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}