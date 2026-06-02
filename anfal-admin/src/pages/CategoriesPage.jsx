import { useState }    from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/api/menu'
import CategoryForm  from '@/components/forms/CategoryForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast         from 'react-hot-toast'

export default function CategoriesPage() {
  const qc                      = useQueryClient()
  const [editing, setEditing]   = useState(null)
  const [deleting, setDeleting] = useState(null)

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-cats'], queryFn: getAdminCategories,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-cats'] })

  const createMut = useMutation({ mutationFn: createCategory,
    onSuccess: () => { toast.success('Category created'); invalidate(); setEditing(null) }})
  const updateMut = useMutation({ mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => { toast.success('Category updated'); invalidate(); setEditing(null) }})
  const deleteMut = useMutation({ mutationFn: deleteCategory,
    onSuccess: () => { toast.success('Category deleted'); invalidate(); setDeleting(null) }})

  const handleSave = (data) => {
    if (editing === 'new') createMut.mutate(data)
    else updateMut.mutate({ id: editing.id, data })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f9fafb' }}>Categories</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Manage your menu sections</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px',
            backgroundColor: '#C6FF00', color: '#030712',
            fontWeight: 700, fontSize: '13px',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
          }}
        >
          + Add Category
        </button>
      </div>

      {isLoading ? (
        <p style={{ fontSize: '13px', color: '#6b7280' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '12px',
                padding: '14px 16px',
                backgroundColor: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '12px',
              }}
            >
              {/* Left */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                {cat.banner && (
                  <img
                    src={`${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${cat.banner}`}
                    alt=""
                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#f9fafb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button
                  onClick={() => setEditing(cat)}
                  style={{ padding: '8px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', borderRadius: '6px', fontSize: '16px' }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1f2937'; e.currentTarget.style.color = '#f9fafb' }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280' }}
                  aria-label="Edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => setDeleting(cat)}
                  style={{ padding: '8px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', borderRadius: '6px', fontSize: '14px' }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1f2937'; e.currentTarget.style.color = '#f87171' }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280' }}
                  aria-label="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CategoryForm
          initial={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          saving={createMut.isPending || updateMut.isPending}
        />
      )}

      {deleting && (
        <ConfirmDialog
          message={`Delete "${deleting.name}"? All items inside will also be deleted.`}
          onConfirm={() => deleteMut.mutate(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}