import { useForm }   from 'react-hook-form'
import ImageUploader from '@/components/ui/ImageUploader'

export default function CategoryForm({ initial, onSave, onClose, saving }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name:        initial?.name        || '',
      description: initial?.description || '',
      sort_order:  initial?.sort_order  || 0,
      banner:      initial?.banner      || null,
    },
  })
  const banner = watch('banner')

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 300,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Form panel */}
      <div
        style={{
          position: 'fixed',
          zIndex: 301,
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          overflowY: 'auto',
        }}
        className="admin-form-panel"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #1f2937',
            position: 'sticky', top: 0,
            backgroundColor: '#111827',
            zIndex: 1,
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f9fafb' }}>
            {initial ? 'Edit Category' : 'New Category'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSave)} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Name *">
            <input
              {...register('name', { required: true })}
              placeholder="e.g. Mandi"
              style={inputStyle}
            />
          </Field>

          <Field label="Tagline">
            <input
              {...register('description')}
              placeholder="e.g. Traditional Arabian Rice Experience"
              style={inputStyle}
            />
          </Field>

          <Field label="Sort Order">
            <input
              type="number"
              {...register('sort_order', { valueAsNumber: true })}
              style={{ ...inputStyle, maxWidth: '120px' }}
            />
          </Field>

          <Field label="Banner Image">
            <ImageUploader
              value={banner}
              onChange={(path) => setValue('banner', path)}
              folder="categories"
            />
          </Field>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={saving} style={saveBtnStyle}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', backgroundColor: '#1f2937',
  border: '1px solid #374151', borderRadius: '8px',
  padding: '10px 12px', fontSize: '14px', color: '#f9fafb',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'system-ui, sans-serif',
}

const cancelBtnStyle = {
  padding: '10px 20px', background: 'none',
  border: '1px solid #374151', borderRadius: '8px',
  color: '#9ca3af', fontSize: '13px', cursor: 'pointer',
}

const saveBtnStyle = {
  padding: '10px 24px',
  backgroundColor: '#C6FF00', color: '#030712',
  fontWeight: 700, fontSize: '13px',
  border: 'none', borderRadius: '8px', cursor: 'pointer',
}