import { fireEvent, render, screen } from '@testing-library/react';

import { Item, PricingStatus } from '../../store/slices/contentSlice';
import ItemCard from './ItemCard';

// Mock the translate function
jest.mock('../../locales', () => ({
  translate: (key: string) => key,
}));

describe('ItemCard', () => {
  const mockItem: Item = {
    id: '1',
    title: 'Test Item',
    creator: 'Test Creator',
    price: 19.99,
    image: 'test-image.jpg',
    status: PricingStatus.PAID,
    pricingOption: 1,
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders item information', () => {
    render(<ItemCard item={mockItem} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
  });

  test('renders item image with correct alt text', () => {
    render(<ItemCard item={mockItem} />);

    const image = screen.getByAltText('Test Item');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  test('displays price for paid items', () => {
    render(<ItemCard item={mockItem} />);

    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  test('displays free label for free items', () => {
    const freeItem = {
      ...mockItem,
      status: PricingStatus.FREE,
      pricingOption: 0,
    };
    render(<ItemCard item={freeItem} />);

    expect(screen.getByText('common.free')).toBeInTheDocument();
  });

  test('displays view-only label for view-only items', () => {
    const viewOnlyItem = {
      ...mockItem,
      status: PricingStatus.VIEW_ONLY,
      pricingOption: 2,
    };
    render(<ItemCard item={viewOnlyItem} />);

    expect(screen.getByText('common.view-only')).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    render(<ItemCard item={mockItem} onClick={mockOnClick} />);

    const card = screen.getByText('Test Item').closest('.item-card');
    fireEvent.click(card!);

    expect(mockOnClick).toHaveBeenCalledWith(mockItem);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when onClick is not provided', () => {
    render(<ItemCard item={mockItem} />);

    const card = screen.getByText('Test Item').closest('.item-card');
    fireEvent.click(card!);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('renders item card with correct structure', () => {
    const { container } = render(<ItemCard item={mockItem} />);
    const card = container.querySelector('.item-card');

    expect(card).toBeInTheDocument();
  });

  test('displays formatted price with 2 decimal places', () => {
    const itemWithLongPrice = {
      ...mockItem,
      price: 19.999999,
      status: PricingStatus.PAID,
    };
    render(<ItemCard item={itemWithLongPrice} />);

    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  test('handles zero price', () => {
    const freePaidItem = { ...mockItem, price: 0, status: PricingStatus.PAID };
    render(<ItemCard item={freePaidItem} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
