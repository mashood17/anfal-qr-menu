import { useForm, useFieldArray } from 'react-hook-form'
import ImageUploader from '@/components/ui/ImageUploader'
import { X, Plus, Trash2 } from 'lucide-react'

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
    // Coerce price to number, filter empty
    data.prices = data.prices
      .filter((p) => p.label && p.price)
      .map((p) => ({ ...p, price: parseFloat(p.price) }))
    if (!data.badge) data.badge = null
    onSave(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto py-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 my-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">
            {initial ? 'Edit Item' : 'New Item'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Name *</label>
            <input {...register('name', { required: true })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                         text-sm text-white focus:outline-none focus:border-brand-accent/60"
              placeholder="e.g. Steam Chicken Mandi" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <textarea {...register('description')} rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                         text-sm text-white focus:outline-none focus:border-brand-accent/60 resize-none"
              placeholder="Short description..." />
          </div>

          {/* Category + Food type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Category *</label>
              <select {...register('category_id', { required: true })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-white focus:outline-none focus:border-brand-accent/60">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Food Type</label>
              <select {...register('food_type')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-white focus:outline-none focus:border-brand-accent/60">
                {FOOD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Badge + Sort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Badge</label>
              <select {...register('badge')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-white focus:outline-none focus:border-brand-accent/60">
                {BADGES.map((b) => (
                  <option key={b} value={b}>{b ? b.replace('_', ' ') : 'None'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Sort Order</label>
              <input type="number" {...register('sort_order', { valueAsNumber: true })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-white focus:outline-none focus:border-brand-accent/60" />
            </div>
          </div>

          {/* Prices */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-400">Prices *</label>
              <button type="button" onClick={() => append({ label: '', price: '' })}
                className="flex items-center gap-1 text-xs text-brand-accent hover:text-brand-accent/80">
                <Plus size={11} /> Add variant
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`prices.${i}.label`, { required: true })}
                    placeholder="Label (e.g. Q, H, F, regular)"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                               text-sm text-white focus:outline-none focus:border-brand-accent/60"
                  />
                  <input
                    type="number"
                    {...register(`prices.${i}.price`, { required: true })}
                    placeholder="₹"
                    className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                               text-sm text-white focus:outline-none focus:border-brand-accent/60"
                  />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)}
                      className="text-gray-500 hover:text-red-400 transition-colors px-1">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Image</label>
            <ImageUploader
              value={image}
              onChange={(path) => setValue('image', path)}
              folder="items"
            />
          </div>

          <div className="flex gap-3 pt-2 justify-end">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 text-sm bg-brand-accent text-gray-950 font-semibold
                         rounded-lg hover:bg-brand-accent/90 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}