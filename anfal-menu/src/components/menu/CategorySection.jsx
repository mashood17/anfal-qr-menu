import { useRef }            from 'react'
import { motion, useInView } from 'framer-motion'
import MenuItemRow           from './MenuItemRow'
import { categoryImageUrl }  from '@/utils/imageUrl'

// ─────────────────────────────────────────────
// Layout constants — change these in one place
// ─────────────────────────────────────────────
const IMAGE_WIDTH    = '300px'   // fixed column width
const IMAGE_RATIO    = '4 / 3'  // consistent across all categories
const GRID_GAP       = '48px'
const SECTION_PB     = '52px'
const SECTION_MB     = '52px'
const STICKY_TOP     = '130px'  // offset for sticky nav height

const itemVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.28, delay: i * 0.035, ease: 'easeOut' },
  }),
}

export default function CategorySection({ category, items, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  // Strict alternating — even index image left, odd index image right
  const imageLeft = index % 2 === 0

  if (!items.length) return null

  return (
    <section
      id={`cat-${category.id}`}
      ref={ref}
      style={{
        borderBottom: '1px solid rgba(198,255,0,0.06)',
        paddingBottom: SECTION_PB,
        marginBottom:  SECTION_MB,
      }}
    >
      {/*
        Desktop: two-column grid — image column is ALWAYS IMAGE_WIDTH,
        text column takes remaining space.
        Mobile: single column via CSS class override.
      */}
      <div
        className="category-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: category.banner
            ? (imageLeft
                ? `${IMAGE_WIDTH} 1fr`   // image left
                : `1fr ${IMAGE_WIDTH}`)  // image right
            : '1fr',
          gap:         GRID_GAP,
          alignItems:  'start',          // CRITICAL — never stretch image to match text
        }}
      >
        {/* Image — left position */}
        {category.banner && imageLeft && (
          <CategoryImage category={category} />
        )}

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Category header */}
          <div style={{ marginBottom: '22px' }}>
            <p className="category-label">
              {getCategoryGroup(category.name)}
            </p>
            <h2
              className="category-title"
              style={{ marginTop: '4px' }}
            >
              {category.name}
            </h2>
            {category.description && (
              <p style={{
                fontSize:    '13px',
                color:       'var(--text-faint)',
                marginTop:   '6px',
                fontStyle:   'italic',
                lineHeight:  1.6,
              }}>
                {category.description}
              </p>
            )}
          </div>

          {/* Items */}
          <div>
            <VariantHeader items={items} />

            {items.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <MenuItemRow item={item} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image — right position */}
        {category.banner && !imageLeft && (
          <CategoryImage category={category} />
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Image component — identical for every category
// ─────────────────────────────────────────────
function CategoryImage({ category }) {
  return (
    <div
      className="category-image-desktop"
      style={{
        /*
          sticky keeps image in view while user scrolls long item lists.
          width: 100% fills the fixed IMAGE_WIDTH column exactly — no gaps.
          aspectRatio is always IMAGE_RATIO — no category can override this.
        */
        position:    'sticky',
        top:         STICKY_TOP,
        width:       '100%',
        aspectRatio: IMAGE_RATIO,
        borderRadius: '10px',
        overflow:    'hidden',
        flexShrink:  0,
      }}
    >
      <img
        src={categoryImageUrl(category.banner)}
        alt={category.name}
        loading="lazy"
        style={{
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',     // always fills, always same crop behaviour
          objectPosition: 'center',
          display:    'block',
          transition: 'transform 0.5s ease',
        }}
        onMouseOver={(e) => { e.target.style.transform = 'scale(1.03)' }}
        onMouseOut={(e)  => { e.target.style.transform = 'scale(1)' }}
      />
    </div>
  )
}
function VariantHeader({ items }) {
  const multiItem = items.find((i) => i.prices?.length > 1)

  if (!multiItem) return null

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '18px',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(198,255,0,0.08)',
      }}
    >
      {multiItem.prices.map((p) => (
        <span
          key={p.label}
          style={{
            minWidth: '32px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {p.label}
        </span>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// Category group label
// ─────────────────────────────────────────────
function getCategoryGroup(name) {
  const n = name.toLowerCase()
  if (n.includes('soup') || n.includes('salad'))                                          return 'Starters'
  if (n.includes('starter') || n.includes('chinese') || n.includes('veg start') ||
      n.includes('roll')    || n.includes('tandoori'))                                    return 'Starters'
  if (n.includes('biryani') || n.includes('biriyani') || n.includes('rice') ||
      n.includes('noodle')  || n.includes('bread'))                                       return 'Main Course'
  if (n.includes('chicken') || n.includes('mutton') || n.includes('fish') ||
      n.includes('afghani'))                                                               return 'Main Course'
  if (n.includes('veg dish') || n.includes('gravy'))                                      return 'Main Course'
  if (n.includes('juice') || n.includes('ice cream') || n.includes('scoop'))             return 'Beverages & Desserts'
  return 'Menu'
}