import React from 'react';

import ContentsList from './components/ContentsList/ContentsList';
import FilterSection from './components/FilterSection/FilterSection';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import { useContent } from './hooks/useContent';

import './App-styles.scss';

const App: React.FC = () => {
  // Use the custom hook for content management
  // This hook provides state and handlers for content, search, and filters
  const {
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
  } = useContent();

  return (
    <div className='app'>
      <Header />
      <main className='app__main'>
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        <FilterSection
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          initialFilters={filters}
        />
        <ContentsList
          items={filteredItems}
          onItemClick={handleItemClick}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
};

export default App;
