import useMenuStore from '@/store/menuStore'

/*
  Layout strategy
  ───────────────
  Single-price  →  [name/desc  flex:1]  [price  fixed]
  Multi-price   →  [name/desc  flex:1]  [grid of N fixed-width cols]

  Each price column is PRICE_COL_W px wide, text-align right,
  so every ₹ sign lines up perfectly regardless of digit count
  or whether the value is "-".

  Desktop (lg:1024px+) widens each column to DESKTOP_PRICE_COL_W and
  adds a column-gap for a more premium, breathable look. Mobile is
  100% unchanged — same width, same flush (gap:0) grid.

  Both the price grid here AND the Q/H/F header grid in CategorySection
  MUST use the exact same `.price-grid` class + `--price-cols` variable
  so the columns line up perfectly at every breakpoint.
*/

const PRICE_COL_W         = 56   // px — mobile / base width, wide enough for "₹1,550"
const DESKTOP_PRICE_COL_W = 72   // px — desktop width, more breathing room
const COL_GAP             = 0    // mobile: columns are flush
const DESKTOP_COL_GAP     = 12   // desktop: visible gap between Q/H/F values

export default function MenuItemRow({ item }) {
  const openModal = useMenuStore((s) => s.openModal)
  const prices    = item.prices || []
  const isSingle  = prices.length === 1
  const isMulti   = prices.length > 1

  return (
    <div
      className="item-row"
      onClick={() => openModal(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openModal(item)}
      style={{
        display:     'flex',
        alignItems:  'flex-start',       /* baseline so name & price sit on same text line */
        gap:         '16px',
        cursor:      'pointer',
        width:       '100%',
      }}
    >
      {/* ── Left: dot + name + description ──────────────────────────── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          paddingRight: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          {item.food_type && (
            <FoodDot type={item.food_type} />
          )}
          <span className="item-name" style={{ flex: 1, minWidth: 0 }}>
            {item.name}
          </span>
        </div>
        {item.description && (
          <p className="item-desc">{item.description}</p>
        )}
      </div>

      {/* ── Right: price(s) ──────────────────────────────────────────── */}
      {isSingle && (
        <span
          className="item-price price-col-single"
          style={{ flexShrink: 0, textAlign: 'right' }}
        >
          <PriceVal value={prices[0].price} />
        </span>
      )}

      {isMulti && (
        /*
          CSS grid with N equal fixed columns.
          Every row that renders this component will produce identical
          column widths → perfect vertical alignment across all rows.

          --price-cols is set per-row; actual column WIDTH and GAP come
          from the .price-grid class (mobile) + lg: override (desktop)
          in globals.css, so both breakpoints stay in sync with the
          Q/H/F header grid automatically.
        */
        <div
          className="price-grid"
          style={{
            flexShrink: 0,
            '--price-cols': prices.length,
          }}
        >
          {prices.map((p) => (
            <span
              key={p.label ?? p.id ?? p.price}
              className="price-cell"
            >
              <PriceVal value={p.price} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Price value — consistent dash width ────────────────────────────────── */
function PriceVal({ value }) {
  if (value == null) {
    /*
      Use a thin-space + en-dash so "-" occupies roughly the same
      character width as a short price string.
    */
    return (
      <span
        style={{
          opacity: 0.45,
          display: 'inline-block',
          width: '100%',
          textAlign: 'right',
        }}
      >
        —
      </span>
    )
  }
  return <>₹{Number(value).toLocaleString('en-IN')}</>
}

/* ─── Veg / non-veg dot ──────────────────────────────────────────────────── */
function FoodDot({ type }) {
  const isVeg = type === 'veg'
  return (
    <span
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      style={{
        display:    'inline-block',
        flexShrink: 0,
        marginTop:  '4px',           /* align with cap-height of item name */
        width:      '8px',
        height:     '8px',
        borderRadius: '50%',
        backgroundColor: isVeg ? '#4ade80' : '#f87171',
        boxShadow: isVeg
          ? '0 0 0 1.5px rgba(74,222,128,0.25)'
          : '0 0 0 1.5px rgba(248,113,113,0.25)',
      }}
    />
  )
}

/*
  ─── CategorySection usage note ────────────────────────────────────────────
  For the Q / H / F header row to align with the price columns, render a
  header row ONCE per category using the SAME `.price-grid` class and the
  same `--price-cols` count, e.g.:

    const colLabels = getUniqueLabels(items)   // ['Q','H','F']

    <div style={{ display:'flex', gap:'16px' }} className="...headerStyle">
      <span style={{ flex:1 }} />
      <div
        className="price-grid"
        style={{ '--price-cols': colLabels.length }}
      >
        {colLabels.map(l => (
          <span key={l} className="price-cell price-cell-label">
            {l}
          </span>
        ))}
      </div>
    </div>

  Because both this row and the header use `.price-grid` + `.price-cell`
  (defined in globals.css with the lg: desktop overrides), column widths,
  gaps, and alignment stay perfectly in sync at every breakpoint without
  any duplicated numbers or JS-based screen detection.
*/
export { PRICE_COL_W, DESKTOP_PRICE_COL_W, COL_GAP, DESKTOP_COL_GAP }