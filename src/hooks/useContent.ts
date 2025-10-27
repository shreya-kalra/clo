import { useEffect, useMemo, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  Filters,
  Item,
  PricingStatus,
  SortOption,
  clearFilters,
  fetchContent,
  retryFetch,
  setFilteredItems,
  setFilters,
  setSearchTerm,
  setSortOption,
} from '../store/slices/contentSlice';
import { AppDispatch, RootState } from '../store/store';
import {
  clearURLParams,
  parseURLParams,
  updateURLParams,
} from '../utils/urlState';

/* -----------------------------
   🧩 Utility: Generic Sort by Price
----------------------------- */
const sortByPrice =
  (direction: 'low' | 'high') =>
  (a: Item, b: Item): number => {
    const priority =
      direction === 'low'
        ? { VIEW_ONLY: 0, FREE: 1, PAID: 2 }
        : { PAID: 0, FREE: 1, VIEW_ONLY: 2 };

    const diff =
      priority[a.status as keyof typeof priority] -
      priority[b.status as keyof typeof priority];

    if (diff !== 0) return diff;

    // For same status (Paid), compare prices accordingly
    if (a.status === PricingStatus.PAID && b.status === PricingStatus.PAID) {
      return direction === 'low' ? a.price - b.price : b.price - a.price;
    }

    return 0;
  };

/* -----------------------------
   🧩 Utility: Filter + Search
----------------------------- */
const filterItems = (
  items: Item[],
  searchTerm: string,
  filters: Filters
): Item[] => {
  let filtered = items;

  // Search
  const term = searchTerm.trim().toLowerCase();
  if (term) {
    filtered = filtered.filter(
      item =>
        item.title.toLowerCase().includes(term) ||
        item.creator.toLowerCase().includes(term)
    );
  }

  // Pricing filters
  const { paid, free, viewOnly } = filters;
  if (paid || free || viewOnly) {
    filtered = filtered.filter(item => {
      return (
        (paid && item.status === PricingStatus.PAID) ||
        (free && item.status === PricingStatus.FREE) ||
        (viewOnly && item.status === PricingStatus.VIEW_ONLY)
      );
    });
  }

  return filtered;
};

/* -----------------------------
   🧩 Main Hook
----------------------------- */
export const useContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedRef = useRef(false);

  const {
    items,
    filteredItems,
    loading,
    error,
    searchTerm,
    filters,
    sortOption,
  } = useSelector((state: RootState) => state.content);

  /* 🔹 Initialize from URL once */
  useEffect(() => {
    const urlState = parseURLParams();
    dispatch(setSearchTerm(urlState.search));
    dispatch(setFilters(urlState.filters));
  }, [dispatch]);

  /* 🔹 Compute filtered + sorted items */
  const processedItems = useMemo(() => {
    if (!items.length) return [];

    const filtered = filterItems(items, searchTerm, filters);

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case SortOption.ITEM_NAME:
          return a.title.localeCompare(b.title);
        case SortOption.HIGHER_PRICE:
          return sortByPrice('high')(a, b);
        case SortOption.LOWER_PRICE:
          return sortByPrice('low')(a, b);
        default:
          return 0;
      }
    });

    return sorted;
  }, [items, searchTerm, filters, sortOption]);

  /* 🔹 Sync processed items to store */
  useEffect(() => {
    if (processedItems.length || !items.length) {
      dispatch(setFilteredItems(processedItems));
    }
  }, [processedItems, items.length, dispatch]);

  /* 🔹 Fetch content once on mount */
  useEffect(() => {
    if (!hasFetchedRef.current && !loading && items.length === 0) {
      hasFetchedRef.current = true;
      dispatch(fetchContent());
    }
  }, [dispatch, loading, items.length]);

  /* -----------------------------
     🧭 Handlers
  ----------------------------- */
  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
    updateURLParams({ search: term, filters });
  };

  const handleFilterChange = (newFilters: Filters) => {
    dispatch(setFilters(newFilters));
    updateURLParams({ search: searchTerm, filters: newFilters });
  };

  const handleSortChange = (newSortOption: SortOption) =>
    dispatch(setSortOption(newSortOption));

  const handleReset = () => {
    dispatch(clearFilters());
    clearURLParams();
  };

  const handleRetry = () => {
    dispatch(retryFetch());
    dispatch(fetchContent());
  };

  const handleItemClick = (item: Item) => {
    console.log('Item clicked:', item);
  };

  return {
    items,
    filteredItems,
    loading,
    error,
    searchTerm,
    filters,
    sortOption,
    handleSearch,
    handleFilterChange,
    handleReset,
    handleSortChange,
    handleItemClick,
    handleRetry,
  };
};
