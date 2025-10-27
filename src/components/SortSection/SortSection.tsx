import React from 'react';

import { translate } from '../../locales';
import { SortOption } from '../../store/slices/contentSlice';

import './SortSection-styles.scss';

interface SortSectionProps {
  onSortChange: (sortOption: SortOption) => void;
  initialSort?: SortOption;
}

const SortSection: React.FC<SortSectionProps> = ({
  onSortChange,
  initialSort = SortOption.ITEM_NAME,
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortOption);
  };

  return (
    <div className='sort-section'>
      <label className='sort-section__label' htmlFor='sort-select'>
        {translate('sort.title')}
      </label>
      <select
        id='sort-select'
        className='sort-section__select'
        value={initialSort}
        onChange={handleSortChange}
      >
        <option value={SortOption.ITEM_NAME}>
          {translate('sort.item-name')}
        </option>
        <option value={SortOption.HIGHER_PRICE}>
          {translate('sort.higher-price')}
        </option>
        <option value={SortOption.LOWER_PRICE}>
          {translate('sort.lower-price')}
        </option>
      </select>
    </div>
  );
};

export default SortSection;
