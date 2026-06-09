import { useParams }        from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useRestaurant }    from '@/hooks/useRestaurant'
import { useCategories }    from '@/hooks/useCategories'
import { useMenuItems }     from '@/hooks/useMenuItems'
import { useSearch }        from '@/hooks/useSearch'
import useMenuStore         from '@/store/menuStore'

import CategoryNav     from '@/components/menu/CategoryNav'
import CategorySection from '@/components/menu/CategorySection'
import SearchBar       from '@/components/search/SearchBar'
import SearchResults   from '@/components/search/SearchResults'
import Footer          from '@/components/ui/Footer'
import ScrollToTop     from '@/components/ui/ScrollToTop'
import MenuHeader      from '@/components/menu/MenuHeader'
import ItemModal       from '@/components/menu/ItemModal'
import DietFilter      from '@/components/menu/DietFilter'
import PageLoader      from '@/components/ui/PageLoader'
import MenuSkeleton    from '@/components/ui/MenuSkeleton'

export default function MenuPage({ slug: slugProp }) {
  const { slug: slugParam } = useParams()
  const slug = slugProp || slugParam || 'anfal'

  const { data: restaurant, isLoading: resLoading } = useRestaurant(slug)
  const { data: categories = [], isLoading: catsLoading } = useCategories(restaurant?.id)
  const { data: items = [],      isLoading: itemsLoading } = useMenuItems(restaurant?.id)

  const searchQuery   = useMenuStore((s) => s.searchQuery)
  const searchResults = useSearch(items, categories)
  const dietFilter    = useMenuStore((s) => s.dietFilter)
  const setDietFilter = useMenuStore((s) => s.setDietFilter)

  const filteredItems = dietFilter === 'all'
    ? items
    : items.filter((i) => i.food_type === dietFilter)

  // Phase 1 — backend waking up, restaurant not loaded yet
  const showFullLoader = resLoading

  // Phase 2 — restaurant loaded, categories/items still fetching
  const showSkeleton = !resLoading && (catsLoading || itemsLoading)

  return (
    <>
      {/* Full-screen loader — shown during cold start */}
      <AnimatePresence>
        {showFullLoader && (
          <PageLoader restaurant={null} />
        )}
      </AnimatePresence>

      {/* Main page — rendered once restaurant data arrives */}
      {!showFullLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ backgroundColor: 'var(--brand-dark)', minHeight: '100vh' }}
        >
          <MenuHeader restaurant={restaurant} />

          {/* Sticky nav */}
          <div
            className="sticky top-0 z-40"
            style={{
              backgroundColor: 'rgba(10,46,18,0.97)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(198,255,0,0.08)',
            }}
          >
            <div className="container-menu">
              <CategoryNav categories={categories} />
              <div className="py-2">
                <DietFilter active={dietFilter} onChange={setDietFilter} />
              </div>
              <div className="pb-2">
                <SearchBar />
              </div>
            </div>
          </div>

          {/* Menu content */}
          <main className="container-menu py-8 sm:py-12">
            {showSkeleton ? (
              <MenuSkeleton />
            ) : searchQuery.trim() ? (
              <SearchResults results={searchResults} query={searchQuery} />
            ) : (
              <div>
                {categories.map((cat, index) => (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    items={filteredItems.filter((i) => i.category_id === cat.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </main>

          <Footer restaurant={restaurant} />
          <ScrollToTop />
          <ItemModal />
        </motion.div>
      )}
    </>
  )
}