import { useState, useCallback, useMemo } from 'react'
import { Product, Category } from '../types/inventory'
import { Transaction } from '../types/financial'

interface UseGlobalSearchProps {
  products: Product[]
  transactions: Transaction[]
  categories: Category[]
}

interface SearchResults {
  products: Product[]
  transactions: Transaction[]
  categories: Category[]
}

export function useGlobalSearch({ products, transactions, categories }: UseGlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Debounced search results
  const searchResults = useMemo<SearchResults>(() => {
    if (!searchQuery.trim()) {
      return { products: [], transactions: [], categories: [] }
    }

    const query = searchQuery.toLowerCase()

    return {
      products: products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      ),
      transactions: transactions.filter(
        (t) =>
          t.id.toLowerCase().includes(query) ||
          t.items.some((item) => item.productName.toLowerCase().includes(query))
      ),
      categories: categories.filter((c) => c.name.toLowerCase().includes(query))
    }
  }, [searchQuery, products, transactions, categories])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setShowSearchResults(query.trim().length > 0)
  }, [])

  const handleResultSelect = useCallback(
    (type: string, id: string, onNavigate?: (menu: string) => void) => {
      setShowSearchResults(false)
      setSearchQuery('')

      // Navigate to appropriate page based on type
      if (onNavigate) {
        switch (type) {
          case 'product':
            onNavigate('barang')
            break
          case 'transaction':
            onNavigate('transaksi')
            break
          case 'category':
            onNavigate('barang')
            break
        }
      }
    },
    []
  )

  const closeSearch = useCallback(() => {
    setShowSearchResults(false)
  }, [])

  return {
    searchQuery,
    searchResults,
    showSearchResults,
    handleSearch,
    handleResultSelect,
    closeSearch
  }
}
