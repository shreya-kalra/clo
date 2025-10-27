import React, { useEffect, useState } from 'react';

import ReactRangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import { MAX_PRICE, MIN_PRICE } from '../../constants';
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
  initialFilters = {
    paid: false,
    free: false,
    viewOnly: false,
    priceRange: { min: MIN_PRICE, max: MAX_PRICE },
  },
}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [minValue, setMinValue] = useState(
    initialFilters.priceRange?.min || MIN_PRICE
  );
  const [maxValue, setMaxValue] = useState(
    initialFilters.priceRange?.max || MAX_PRICE
  );

  // Update local state when initialFilters change (from URL)
  useEffect(() => {
    setFilters(initialFilters);
    setMinValue(initialFilters.priceRange?.min || MIN_PRICE);
    setMaxValue(initialFilters.priceRange?.max || MAX_PRICE);
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
      priceRange: { min: MIN_PRICE, max: MAX_PRICE },
    };
    setFilters(resetFilters);
    setMinValue(MIN_PRICE);
    setMaxValue(MAX_PRICE);
    onReset();
  };

  return (
    <div className='filter-section'>
      <div className='filter-section__options'>
        <div className='filter-section__wrapper'>
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
        {filters.paid && (
          <div className='filter-section__price-range'>
            <div className='filter-section__price-values'>
              <span className='filter-section__price-value'>${minValue}</span>
              <ReactRangeSlider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1}
                value={[minValue, maxValue]}
                onInput={value => {
                  const [newMin, newMax] = value;
                  setMinValue(newMin);
                  setMaxValue(newMax);
                  const newFilters = {
                    ...filters,
                    priceRange: { min: newMin, max: newMax },
                  };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className='filter-section__range-slider'
              />
              <span className='filter-section__price-value'>${maxValue}</span>
            </div>
          </div>
        )}
      </div>
      <button className='filter-section__reset' onClick={handleReset}>
        {translate('filters.reset')}
      </button>
    </div>
  );
};

export default FilterSection;
