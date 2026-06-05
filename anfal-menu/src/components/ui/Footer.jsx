export default function Footer({ restaurant }) {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(198,255,0,0.08)',
        marginTop: '32px',
        padding: '40px 0',
      }}
    >
      <div className="container-menu">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '18px',
              color: 'var(--text-primary)',
            }}
          >
            {restaurant?.name}
          </p>

          {restaurant?.address && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-faint)',
              }}
            >
              {restaurant.address}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {restaurant?.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                style={{
                  fontSize: '13px',
                  color: 'var(--text-faint)',
                  textDecoration: 'none',
                }}
              >
                {restaurant.phone}
              </a>
            )}

            {restaurant?.settings?.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-faint)',
                  textDecoration: 'none',
                }}
              >
                WhatsApp
              </a>
            )}

            {restaurant?.settings?.instagram && (
              <a
                href={`https://instagram.com/${restaurant.settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-faint)',
                  textDecoration: 'none',
                }}
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}