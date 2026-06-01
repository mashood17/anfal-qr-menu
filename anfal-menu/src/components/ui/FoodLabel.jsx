const TYPE_CONFIG = {
  veg:     { label: '●', classes: 'border-green-500 text-green-500',  title: 'Vegetarian' },
  non_veg: { label: '▲', classes: 'border-red-500 text-red-500',      title: 'Non-Vegetarian' },
}

export default function FoodLabel({ type }) {
  const config = TYPE_CONFIG[type]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center justify-center 
                  w-4 h-4 border rounded-sm text-[8px] font-bold shrink-0
                  ${config.classes}`}
      title={config.title}
      aria-label={config.title}
    >
      {config.label}
    </span>
  )
}