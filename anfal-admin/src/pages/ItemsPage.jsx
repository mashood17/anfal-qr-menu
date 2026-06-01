import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminItems, getAdminCategories, createItem, updateItem, deleteItem } from '@/api/menu'
import PageHeader    from '@/components/ui/PageHeader'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ItemForm      from '@/components/forms/ItemForm'
import { Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const BADGE_LABELS = { best_seller: 'Best Seller', chef_special: 'Chef Special', popular: 'Popular', new: 'New' }
const TYPE_COLORS = { veg: 'text-green-400', non_veg: 'text-red-400' }

export default function ItemsPage() {
  const qc                      = useQueryClient()
  const [editing, setEditing]   = useState(null)
  const [deleting, setDeleting] = useState(null)

  const { data: items      = [], isLoading } = useQuery({ queryKey: ['admin-items'], queryFn: getAdminItems })
  const { data: categories = [] }            = useQuery({ queryKey: ['admin-cats'],  queryFn: getAdminCategories })

  const catMap   = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-items'] })

  const createMut = useMutation({ mutationFn: createItem, onSuccess: () => { toast.success('Item created'); invalidate(); setEditing(null) } })
  const updateMut = useMutation({ mutationFn: ({ id, data }) => updateItem(id, data), onSuccess: () => { toast.success('Item updated'); invalidate(); setEditing(null) } })
  const deleteMut = useMutation({ mutationFn: deleteItem, onSuccess: () => { toast.success('Item deleted'); invalidate(); setDeleting(null) } })

  const handleSave = (data) => {
    if (editing === 'new') createMut.mutate(data)
    else updateMut.mutate({ id: editing.id, data })
  }

  return (
    <div>
      <PageHeader
        title="Menu Items"
        description={`${items.length} items across ${categories.length} categories`}
        action={
          <button
            onClick={() => setEditing('new')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-gray-950 
                       text-sm font-semibold rounded-lg hover:bg-brand-accent/90 transition-colors"
          >
            <Plus size={15} /> Add Item
          </button>
        }
      />

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 
                         bg-gray-900 border border-gray-800 rounded-xl gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.image && (
                  <img
                    src={`${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${item.image}`}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/10 
                                       text-brand-accent border border-brand-accent/20 shrink-0">
                        {BADGE_LABELS[item.badge]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500">{catMap[item.category_id] || '—'}</p>
                    {item.food_type && (
                      <span className={`text-xs ${TYPE_COLORS[item.food_type]}`}>
                        {item.food_type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right mr-2">
                  {item.prices?.length === 1 && (
                    <p className="text-sm font-semibold text-brand-accent">₹{item.prices[0].price}</p>
                  )}
                  {item.prices?.length > 1 && (
                    <p className="text-xs text-gray-400">
                      {item.prices.map((p) => p.label).join(' / ')}
                    </p>
                  )}
                </div>
                <button onClick={() => setEditing(item)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleting(item)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ItemForm
          initial={editing === 'new' ? null : editing}
          categories={categories}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          saving={createMut.isPending || updateMut.isPending}
        />
      )}

      {deleting && (
        <ConfirmDialog
          message={`Delete "${deleting.name}"?`}
          onConfirm={() => deleteMut.mutate(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}