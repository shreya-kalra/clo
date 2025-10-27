import React, { useCallback, useEffect, useState } from 'react';

import { CrossIcon, SearchIcon } from '../../assets/icons';
import { translate } from '../../locales';

import './SearchBar-styles.scss';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = translate('search.placeholder'),
  initialValue = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Update local state when initialValue changes (from URL)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSearch(searchTerm);
    },
    [onSearch, searchTerm]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Clear search function
  const handleClear = useCallback(() => {
    setSearchTerm('');
    onSearch('');
  }, [onSearch]);

  // Search button click handler
  const handleSearchClick = useCallback(() => {
    onSearch(searchTerm);
  }, [onSearch, searchTerm]);

  return (
    <div className='search-bar'>
      <div className='search-bar__container'>
        <form onSubmit={handleSubmit} className='search-bar__form'>
          <input
            type='text'
            value={searchTerm}
            onChange={handleChange}
            placeholder={placeholder}
            className='search-bar__input'
          />
          <button
            type={searchTerm ? 'button' : 'submit'}
            className='search-bar__button'
            onClick={searchTerm ? handleClear : handleSearchClick}
            aria-label={
              searchTerm
                ? translate('search.clear')
                : translate('common.search')
            }
          >
            {searchTerm ? (
              <CrossIcon className='search-bar__cross-icon' />
            ) : (
              <SearchIcon className='search-bar__icon' />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
