import React from 'react';

import { translate } from '../../locales';
import { Item } from '../../store/slices/contentSlice';
import ItemCard from '../ItemCard/ItemCard';

import './ContentsList-styles.scss';

interface ContentsListProps {
  items: Item[];
  onItemClick?: (item: Item) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: (() => void) | null;
}

const ContentsList: React.FC<ContentsListProps> = ({
  items,
  onItemClick,
  loading = false,
  error = null,
  onRetry = null,
}) => {
  if (loading) {
    return (
      <div className='contents-list'>
        <div className='contents-list__skeleton'>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className='contents-list__skeleton-card'
              data-testid='skeleton-card'
            >
              <div className='contents-list__skeleton-image'></div>
              <div className='contents-list__skeleton-content'>
                <div className='contents-list__skeleton-title'></div>
                <div className='contents-list__skeleton-creator'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='contents-list'>
        <div className='contents-list__error'>
          <p>{error}</p>
          {onRetry && (
            <button
              className='contents-list__retry-button'
              onClick={onRetry}
              aria-label={translate('content.retry')}
            >
              {translate('common.retry')}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className='contents-list'>
        <div className='contents-list__empty'>
          <p>{translate('content.empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='contents-list'>
      <div className='contents-list__grid' data-testid='contents-list-grid'>
        {items.map(item => (
          <ItemCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
};

export default ContentsList;
