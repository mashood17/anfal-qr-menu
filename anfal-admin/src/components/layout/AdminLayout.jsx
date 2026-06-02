import { useState }   from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar        from './Sidebar'
import MobileTopBar   from './MobileTopBar'
import DashboardPage  from '@/pages/DashboardPage'
import CategoriesPage from '@/pages/CategoriesPage'
import ItemsPage      from '@/pages/ItemsPage'
import BrandingPage   from '@/pages/BrandingPage'

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030712' }}>

      {/* Desktop sidebar — hidden on mobile */}
      <div className="admin-sidebar-desktop">
        <Sidebar onNavigate={() => {}} />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 200,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: '260px',
          backgroundColor: '#111827',
          borderRight: '1px solid #1f2937',
          zIndex: 201,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}
        className="admin-sidebar-mobile"
      >
        <Sidebar onNavigate={() => setDrawerOpen(false)} showClose onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile top bar */}
        <div className="admin-topbar-mobile">
          <MobileTopBar onMenuClick={() => setDrawerOpen(true)} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}
               className="admin-main-padding">
            <Routes>
              <Route index             element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="items"      element={<ItemsPage />} />
              <Route path="branding"   element={<BrandingPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}