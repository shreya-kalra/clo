import { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  Filters,
  Item,
  PricingStatus,
  clearFilters,
  fetchContent,
  retryFetch,
  setFilteredItems,
  setFilters,
  setSearchTerm,
} from '../store/slices/contentSlice';
import { AppDispatch, RootState } from '../store/store';
import {
  clearURLParams,
  parseURLParams,
  updateURLParams,
} from '../utils/urlState';

// Custom hook for content management
export const useContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedRef = useRef(false);
  const { items, filteredItems, loading, error, searchTerm, filters } =
    useSelector((state: RootState) => state.content);

  // Initialize from URL parameters
  useEffect(() => {
    const urlState = parseURLParams();
    dispatch(setSearchTerm(urlState.search));
    dispatch(setFilters(urlState.filters));
  }, [dispatch]);

  // Filter items based on search term and filters
  useEffect(() => {
    // Only filter if we have items to filter
    if (items.length === 0) {
      return;
    }

    let filtered = items;

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(
        (item: Item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.creator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply pricing filters
    const hasActiveFilters = filters.paid || filters.free || filters.viewOnly;
    if (hasActiveFilters) {
      filtered = filtered.filter((item: Item) => {
        if (filters.paid && item.status === PricingStatus.PAID) return true;
        if (filters.free && item.status === PricingStatus.FREE) return true;
        if (filters.viewOnly && item.status === PricingStatus.VIEW_ONLY)
          return true;
        return false;
      });
    }

    dispatch(setFilteredItems(filtered));
  }, [items, searchTerm, filters, dispatch]);

  // Load content on mount (only once)
  useEffect(() => {
    if (!hasFetchedRef.current && !loading && items.length === 0) {
      hasFetchedRef.current = true;
      dispatch(fetchContent());
    }
  }, [dispatch, loading, items.length]);

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
    updateURLParams({ search: term, filters });
  };

  const handleFilterChange = (newFilters: Filters) => {
    dispatch(setFilters(newFilters));
    updateURLParams({ search: searchTerm, filters: newFilters });
  };

  const handleReset = () => {
    dispatch(clearFilters());
    clearURLParams();
  };

  const handleItemClick = (item: Item) => {
    console.log('Item clicked:', item);
    // Handle item click - could open modal, navigate to detail page, etc.
  };

  const handleRetry = () => {
    dispatch(retryFetch());
    dispatch(fetchContent());
  };

  return {
    items,
    filteredItems,
    loading,
    error,
    searchTerm,
    filters,
    handleSearch,
    handleFilterChange,
    handleReset,
    handleItemClick,
    handleRetry,
  };
};
