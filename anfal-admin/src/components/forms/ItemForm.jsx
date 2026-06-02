import { useForm, useFieldArray } from 'react-hook-form'
import ImageUploader from '@/components/ui/ImageUploader'

const FOOD_TYPES = ['veg', 'non_veg']
const BADGES     = ['', 'best_seller', 'chef_special', 'popular', 'new']

export default function ItemForm({ initial, categories, onSave, onClose, saving }) {
  const { register, handleSubmit, setValue, watch, control } = useForm({
    defaultValues: {
      name:        initial?.name        || '',
      description: initial?.description || '',
      category_id: initial?.category_id || categories[0]?.id || '',
      food_type:   initial?.food_type   || 'non_veg',
      badge:       initial?.badge       || '',
      image:       initial?.image       || null,
      sort_order:  initial?.sort_order  || 0,
      prices:      initial?.prices?.length
        ? initial.prices
        : [{ label: 'regular', price: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'prices' })
  const image = watch('image')

  const onSubmit = (data) => {
    data.prices = data.prices
      .filter((p) => p.label && p.price)
      .map((p) => ({ ...p, price: parseFloat(p.price) }))
    if (!data.badge) data.badge = null
    onSave(data)
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 300, backdropFilter: 'blur(2px)',
        }}
      />

      <div
        style={{ position: 'fixed', zIndex: 301, backgroundColor: '#111827', border: '1px solid #1f2937', overflowY: 'auto' }}
        className="admin-form-panel"
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #1f2937',
          position: 'sticky', top: 0, backgroundColor: '#111827', zIndex: 1,
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f9fafb' }}>
            {initial ? 'Edit Item' : 'New Item'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Name *</label>
            <input {...register('name', { required: true })} placeholder="e.g. Steam Chicken Mandi" style={inputStyle} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea {...register('description')} rows={2} placeholder="Short description..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Category + Food Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select {...register('category_id', { required: true })} style={inputStyle}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Food Type</label>
              <select {...register('food_type')} style={inputStyle}>
                {FOOD_TYPES.map((t) => (
                  <option key={t} value={t}>{t === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Badge + Sort */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Badge</label>
              <select {...register('badge')} style={inputStyle}>
                {BADGES.map((b) => <option key={b} value={b}>{b ? b.replace('_', ' ') : 'None'}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input type="number" {...register('sort_order', { valueAsNumber: true })} style={inputStyle} />
            </div>
          </div>

          {/* Prices */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={labelStyle}>Prices *</label>
              <button type="button" onClick={() => append({ label: '', price: '' })}
                style={{ fontSize: '12px', color: '#C6FF00', background: 'none', border: 'none', cursor: 'pointer' }}>
                + Add variant
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fields.map((field, i) => (
                <div key={field.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    {...register(`prices.${i}.label`, { required: true })}
                    placeholder="Label (regular / Q / H / F)"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    type="number"
                    {...register(`prices.${i}.price`, { required: true })}
                    placeholder="₹"
                    style={{ ...inputStyle, width: '90px', flex: 'none' }}
                  />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)}
                      style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px', padding: '0 4px', flexShrink: 0 }}
                      onMouseOver={(e) => e.target.style.color = '#f87171'}
                      onMouseOut={(e) => e.target.style.color = '#6b7280'}
                    >×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <label style={labelStyle}>Image</label>
            <ImageUploader
              value={image}
              onChange={(path) => setValue('image', path)}
              folder="items"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...saveBtnStyle, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

const labelStyle = { display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }
const inputStyle = {
  width: '100%', backgroundColor: '#1f2937', border: '1px solid #374151',
  borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#f9fafb',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif',
}
const cancelBtnStyle = { padding: '10px 20px', background: 'none', border: '1px solid #374151', borderRadius: '8px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer' }
const saveBtnStyle = { padding: '10px 24px', backgroundColor: '#C6FF00', color: '#030712', fontWeight: 700, fontSize: '13px', border: 'none', borderRadius: '8px', cursor: 'pointer' }