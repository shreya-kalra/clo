import { MAX_PRICE, MIN_PRICE } from '../../constants';
import contentReducer, {
  ContentState,
  Item,
  PricingStatus,
  SortOption,
  clearFilters,
  fetchContent,
  resetError,
  retryFetch,
  setFilteredItems,
  setFilters,
  setSearchTerm,
  setSortOption,
} from './contentSlice';

describe('contentSlice', () => {
  const initialState: ContentState = {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    searchTerm: '',
    filters: {
      paid: false,
      free: false,
      viewOnly: false,
      priceRange: { min: MIN_PRICE, max: MAX_PRICE },
    },
    sortOption: SortOption.ITEM_NAME,
    hasFetched: false,
  };

  test('should return initial state', () => {
    expect(contentReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('setSearchTerm', () => {
    test('should update search term', () => {
      const action = setSearchTerm('test search');
      const state = contentReducer(initialState, action);

      expect(state.searchTerm).toBe('test search');
    });

    test('should handle empty string', () => {
      const action = setSearchTerm('');
      const state = contentReducer(initialState, action);

      expect(state.searchTerm).toBe('');
    });
  });

  describe('setFilters', () => {
    test('should update filters', () => {
      const newFilters = {
        paid: true,
        free: false,
        viewOnly: false,
        priceRange: { min: MIN_PRICE, max: MAX_PRICE },
      };
      const action = setFilters(newFilters);
      const state = contentReducer(initialState, action);

      expect(state.filters).toEqual(newFilters);
    });

    test('should update multiple filters', () => {
      const newFilters = {
        paid: true,
        free: true,
        viewOnly: true,
        priceRange: { min: MIN_PRICE, max: MAX_PRICE },
      };
      const action = setFilters(newFilters);
      const state = contentReducer(initialState, action);

      expect(state.filters).toEqual(newFilters);
    });
  });

  describe('setFilteredItems', () => {
    test('should update filtered items', () => {
      const mockItems: Item[] = [
        {
          id: '1',
          title: 'Item 1',
          creator: 'Creator 1',
          price: 10,
          image: 'img1.jpg',
          status: PricingStatus.PAID,
          pricingOption: 1,
        },
      ];

      const action = setFilteredItems(mockItems);
      const state = contentReducer(initialState, action);

      expect(state.filteredItems).toEqual(mockItems);
    });
  });

  describe('clearFilters', () => {
    test('should reset search term and filters', () => {
      const stateWithData: ContentState = {
        ...initialState,
        searchTerm: 'test',
        filters: {
          paid: true,
          free: true,
          viewOnly: true,
          priceRange: { min: 10, max: 500 },
        },
      };

      const action = clearFilters();
      const state = contentReducer(stateWithData, action);

      expect(state.searchTerm).toBe('');
      expect(state.filters).toEqual({
        paid: false,
        free: false,
        viewOnly: false,
        priceRange: { min: MIN_PRICE, max: MAX_PRICE },
      });
    });
  });

  describe('setSortOption', () => {
    test('should update sort option', () => {
      const action = setSortOption(SortOption.HIGHER_PRICE);
      const state = contentReducer(initialState, action);

      expect(state.sortOption).toBe(SortOption.HIGHER_PRICE);
    });

    test('should handle all sort options', () => {
      const action1 = setSortOption(SortOption.LOWER_PRICE);
      const state1 = contentReducer(initialState, action1);
      expect(state1.sortOption).toBe(SortOption.LOWER_PRICE);

      const action2 = setSortOption(SortOption.ITEM_NAME);
      const state2 = contentReducer(state1, action2);
      expect(state2.sortOption).toBe(SortOption.ITEM_NAME);
    });
  });

  describe('resetError', () => {
    test('should clear error', () => {
      const stateWithError: ContentState = {
        ...initialState,
        error: 'An error occurred',
      };

      const action = resetError();
      const state = contentReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('retryFetch', () => {
    test('should set loading to true and clear error', () => {
      const stateWithError: ContentState = {
        ...initialState,
        loading: false,
        error: 'An error occurred',
      };

      const action = retryFetch();
      const state = contentReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchContent', () => {
    test('pending action sets loading to true and clears error', () => {
      const stateWithError: ContentState = {
        ...initialState,
        loading: false,
        error: 'Previous error',
      };

      const action = { type: fetchContent.pending.type } as any;
      const state = contentReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled action updates items and filteredItems', () => {
      const mockItems: Item[] = [
        {
          id: '1',
          title: 'Item 1',
          creator: 'Creator 1',
          price: 10,
          image: 'img1.jpg',
          status: PricingStatus.PAID,
          pricingOption: 1,
        },
        {
          id: '2',
          title: 'Item 2',
          creator: 'Creator 2',
          price: 0,
          image: 'img2.jpg',
          status: PricingStatus.FREE,
          pricingOption: 0,
        },
      ];

      const action = {
        type: fetchContent.fulfilled.type,
        payload: mockItems,
      } as any;
      const state = contentReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockItems);
      expect(state.filteredItems).toEqual(mockItems);
      expect(state.error).toBeNull();
      expect(state.hasFetched).toBe(true);
    });

    test('rejected action sets loading to false and updates error', () => {
      const action = {
        type: fetchContent.rejected.type,
        payload: 'Failed to fetch content',
      } as any;

      const state = contentReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch content');
    });
  });
});
