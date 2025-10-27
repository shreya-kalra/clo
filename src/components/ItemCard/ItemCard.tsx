import React from 'react';

import { translate } from '../../locales';
import { Item, PricingStatus } from '../../store/slices/contentSlice';

import './ItemCard-styles.scss';

interface ItemCardProps {
  item: Item;
  onClick?: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const { creator, id, image, price, status, title } = item;

  const getPriceDisplay = (): string => {
    const priceMap = {
      [PricingStatus.FREE]: translate('common.free'),
      [PricingStatus.VIEW_ONLY]: translate('common.view-only'),
      [PricingStatus.PAID]: `$${price.toFixed(2)}`,
    };
    return priceMap[status];
  };

  return (
    <div
      className='item-card'
      key={id}
      onClick={() => onClick && onClick(item)}
    >
      <div className='item-card__image-container'>
        <img
          alt={title}
          className='item-card__image'
          loading='lazy'
          src={image}
        />
      </div>
      <div className='item-card__details'>
        <div className='item-card__content'>
          <h3 className='item-card__title'>{title}</h3>
          <p className='item-card__creator'>{creator}</p>
        </div>
        <span className='item-card__price'>{getPriceDisplay()}</span>
      </div>
    </div>
  );
};

export default ItemCard;
