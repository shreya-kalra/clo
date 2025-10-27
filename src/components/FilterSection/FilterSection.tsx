import React, { useEffect, useState } from 'react';

import { translate } from '../../locales';
import { Filters } from '../../store/slices/contentSlice';

import './FilterSection-styles.scss';

interface FilterSectionProps {
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
  initialFilters?: Filters;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  onFilterChange,
  onReset,
  initialFilters = { paid: false, free: false, viewOnly: false },
}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  // Update local state when initialFilters change (from URL)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (filterType: keyof Filters) => {
    const newFilters = {
      ...filters,
      [filterType]: !filters[filterType],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      paid: false,
      free: false,
      viewOnly: false,
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className='filter-section'>
      <div className='filter-section__options'>
        <label className='filter-section__label'>
          {translate('filters.title')}
        </label>
        <div className='filter-section__checkboxes'>
          <label className='filter-section__checkbox'>
            <input
              type='checkbox'
              checked={filters.paid}
              onChange={() => handleFilterChange('paid')}
            />
            <span className='filter-section__checkbox-text'>
              {translate('common.paid')}
            </span>
          </label>
          <label className='filter-section__checkbox'>
            <input
              type='checkbox'
              checked={filters.free}
              onChange={() => handleFilterChange('free')}
            />
            <span className='filter-section__checkbox-text'>
              {translate('common.free')}
            </span>
          </label>
          <label className='filter-section__checkbox'>
            <input
              type='checkbox'
              checked={filters.viewOnly}
              onChange={() => handleFilterChange('viewOnly')}
            />
            <span className='filter-section__checkbox-text'>
              {translate('common.view-only')}
            </span>
          </label>
        </div>
      </div>
      <button className='filter-section__reset' onClick={handleReset}>
        {translate('filters.reset')}
      </button>
    </div>
  );
};

export default FilterSection;
