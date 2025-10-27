import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API, ApiMethod } from '../../constants/api.constants';
import { makeApiCall } from '../../services/api.service';

/**
 * Enum representing the different pricing status options for content items.
 */
export enum PricingStatus {
  FREE = 'FREE',
  PAID = 'PAID',
  VIEW_ONLY = 'VIEW_ONLY',
}

/**
 * Interface for content items used in the application.
 * This represents the transformed data structure used by components.
 */
export interface Item {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  status: PricingStatus;
  pricingOption: number;
}

/**
 * Interface for items as returned from the API.
 * Optional fields to handle API response variations.
 */
export interface ApiItem {
  id?: string;
  title?: string;
  creator?: string;
  price?: number;
  imagePath?: string;
  pricingOption?: number;
}

/**
 * Interface for content filter options.
 */
export interface Filters {
  paid: boolean;
  free: boolean;
  viewOnly: boolean;
}

/**
 * Interface for the content slice state management.
 * Tracks items, filtered results, loading/error states, and user filters.
 */
export interface ContentState {
  /** All content items from API */
  items: Item[];
  /** Items after applying search and filters */
  filteredItems: Item[];
  /** Loading state indicator */
  loading: boolean;
  /** Error message if fetch fails */
  error: string | null;
  /** Current search term */
  searchTerm: string;
  /** Current filter settings */
  filters: Filters;
  /** Flag to track if initial data fetch has occurred */
  hasFetched: boolean;
}

/**
 * Helper function to convert pricing option numbers to PricingStatus enum.
 * Maps numeric pricing options from API to enum values.
 * @param pricingOption - Numeric option from API (0=FREE, 1=PAID, 2=VIEW_ONLY)
 * @returns Corresponding PricingStatus enum value
 */
const getPricingStatus = (pricingOption?: number): PricingStatus => {
  switch (pricingOption) {
    case 0:
      return PricingStatus.FREE;
    case 1:
      return PricingStatus.PAID;
    case 2:
      return PricingStatus.VIEW_ONLY;
    default:
      return PricingStatus.PAID;
  }
};

/**
 * Helper function to transform API response data to application structure.
 * Converts ApiItem format to Item format with proper mappings and defaults.
 * @param apiData - Array of items from API
 * @returns Transformed array of items for application use
 */
const transformApiData = (apiData: ApiItem[]): Item[] => {
  return apiData.map((item, index) => ({
    id: item.id || `item-${index}`,
    title: item.title || 'Untitled Item',
    creator: item.creator || 'Unknown Creator',
    price: item.price || 0,
    image: item.imagePath || '/placeholder-image.jpg',
    status: getPricingStatus(item.pricingOption),
    pricingOption: item.pricingOption || 1,
  }));
};

/**
 * Async thunk for fetching content data from API using makeApiCall.
 * Handles data fetching, validation, transformation, and error handling.
 * Uses the centralized makeApiCall service for consistent API interactions.
 * @returns Promise resolving to array of transformed items
 */
export const fetchContent = createAsyncThunk<
  Item[],
  void,
  { rejectValue: string }
>('content/fetchContentData', async (_, { rejectWithValue }) => {
  try {
    // Make API call using the centralized makeApiCall function
    const response = await makeApiCall<undefined, ApiItem[]>(
      ApiMethod.Get,
      API.endPoints.DATA
    );

    // Validate response data exists
    if (!response.data) {
      throw new Error('No data received from API');
    }

    // Validate data format is an array
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid data format received from API');
    }

    // Transform API data to application structure
    const transformedData = transformApiData(response.data);
    console.log(
      `Successfully fetched ${transformedData.length} items from API using makeApiCall`
    );
    return transformedData;
  } catch (error: any) {
    console.error('API fetch failed:', error.message || error);
    return rejectWithValue(error.message || 'Failed to fetch content');
  }
});

/**
 * Initial state for the content slice.
 * Sets default values for all state properties.
 */
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
  },
  hasFetched: false, // Track if data has been fetched
};

/**
 * Content slice using Redux Toolkit.
 * Manages state for content items, search, filters, and API fetch operations.
 */
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    /**
     * Updates the search term for filtering items.
     */
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    /**
     * Updates the filter settings for pricing status.
     */
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },
    /**
     * Updates the filtered items array.
     */
    setFilteredItems: (state, action: PayloadAction<Item[]>) => {
      state.filteredItems = action.payload;
    },
    /**
     * Resets search term and filters to default values.
     */
    clearFilters: state => {
      state.searchTerm = '';
      state.filters = {
        paid: false,
        free: false,
        viewOnly: false,
      };
    },
    /**
     * Clears the current error state.
     */
    resetError: state => {
      state.error = null;
    },
    /**
     * Initiates a retry of the fetch operation.
     */
    retryFetch: state => {
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Handle fetchContent async thunk states
    builder
      /**
       * Sets loading state when fetch starts and clears any previous errors.
       */
      .addCase(fetchContent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      /**
       * Updates state with fetched data when fetch succeeds.
       * Sets both items and filteredItems to the fetched data.
       */
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
        state.error = null;
        state.hasFetched = true;
      })
      /**
       * Handles fetch failure and sets error message.
       */
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch content';
      });
  },
});

export const {
  setSearchTerm,
  setFilters,
  setFilteredItems,
  clearFilters,
  resetError,
  retryFetch,
} = contentSlice.actions;

export default contentSlice.reducer;
