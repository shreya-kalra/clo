import { Filters } from '../store/slices/contentSlice';

// URL state management utilities
export interface URLParams {
  search: string;
  filters: Filters;
}

export const updateURLParams = (params: URLParams): void => {
  const url = new URL(window.location.toString());

  // Clear existing search and filter params
  url.searchParams.delete('search');
  url.searchParams.delete('paid');
  url.searchParams.delete('free');
  url.searchParams.delete('viewOnly');

  // Add new params
  if (params.search && params.search.trim()) {
    url.searchParams.set('search', params.search.trim());
  }

  if (params.filters) {
    if (params.filters.paid) url.searchParams.set('paid', 'true');
    if (params.filters.free) url.searchParams.set('free', 'true');
    if (params.filters.viewOnly) url.searchParams.set('viewOnly', 'true');
  }

  // Update URL without page reload
  window.history.replaceState({}, '', url);
};

export const parseURLParams = (): URLParams => {
  const url = new URL(window.location.toString());
  const searchParams = url.searchParams;

  return {
    search: searchParams.get('search') || '',
    filters: {
      paid: searchParams.get('paid') === 'true',
      free: searchParams.get('free') === 'true',
      viewOnly: searchParams.get('viewOnly') === 'true',
    },
  };
};

export const clearURLParams = (): void => {
  const url = new URL(window.location.toString());
  url.search = '';
  window.history.replaceState({}, '', url);
};
