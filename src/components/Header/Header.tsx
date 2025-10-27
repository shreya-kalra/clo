import React from 'react';

import { translate } from '../../locales';

import './Header-styles.scss';

const Header: React.FC = () => {
  return (
    <header className='header'>
      <div className='header__logo'>
        <h1>{translate('app.title')}</h1>
      </div>
    </header>
  );
};

export default Header;
