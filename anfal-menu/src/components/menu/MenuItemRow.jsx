import useMenuStore from '@/store/menuStore'

export default function MenuItemRow({ item }) {
  const openModal = useMenuStore((s) => s.openModal)
  const prices    = item.prices || []
  const isSingle  = prices.length === 1
  const isMulti   = prices.length > 1
  

  return (
    <div
      className="item-row"
      onClick={() => openModal(item)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openModal(item)}
    >
      {/* Left: dot + name + description — NO badge */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.food_type && <FoodDot type={item.food_type} />}
          <span className="item-name">{item.name}</span>
        </div>
        {item.description && (
          <p className="item-desc">{item.description}</p>
        )}
      </div>

      {/* Right: price */}
      {isSingle && (
        <span className="item-price">
          {item.prices[0].price == null
            ? '-'
            : `₹${Number(item.prices[0].price).toLocaleString('en-IN')}`}
        </span>
      )}

      {isMulti && (
        <div
          style={{
            flexShrink: 0,
            textAlign: 'center',
            minWidth: '140px',
          }}
        >
            

            {/* Prices */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              {prices.map((p) => (
                <span
                  key={`price-${p.label}`}
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--brand-accent)',
                    minWidth: '38px',
                  }}
                >
                  {p.price == null
                    ? '-'
                    : `₹${Number(p.price).toLocaleString('en-IN')}`}
                </span>
              ))}
            </div>
        </div>
      )}
    </div>
  )
}

function FoodDot({ type }) {
  return (
    <span
      style={{
        width: '7px', height: '7px',
        borderRadius: '50%',
        backgroundColor: type === 'veg' ? '#4ade80' : '#f87171',
        flexShrink: 0,
        display: 'inline-block',
      }}
      title={type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
    />
  )
}