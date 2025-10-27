import { fireEvent, render, screen } from '@testing-library/react';

import { Item, PricingStatus } from '../../store/slices/contentSlice';
import ContentsList from './ContentsList';

// Mock the translate function
jest.mock('../../locales', () => ({
  translate: (key: string) => key,
}));

describe('ContentsList', () => {
  const mockItems: Item[] = [
    {
      id: '1',
      title: 'Item 1',
      creator: 'Creator 1',
      price: 10,
      image: 'image1.jpg',
      status: PricingStatus.PAID,
      pricingOption: 1,
    },
    {
      id: '2',
      title: 'Item 2',
      creator: 'Creator 2',
      price: 0,
      image: 'image2.jpg',
      status: PricingStatus.FREE,
      pricingOption: 0,
    },
  ];

  const mockOnItemClick = jest.fn();
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    mockOnItemClick.mockClear();
    mockOnRetry.mockClear();
  });

  test('renders loading state', () => {
    render(
      <ContentsList items={[]} loading={true} error={null} onRetry={null} />
    );

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(8);
  });

  test('renders error state', () => {
    const errorMessage = 'Failed to fetch content';
    render(
      <ContentsList
        items={[]}
        loading={false}
        error={errorMessage}
        onRetry={null}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('content.retry')).not.toBeInTheDocument();
  });

  test('renders error state with retry button', () => {
    const errorMessage = 'Failed to fetch content';
    render(
      <ContentsList
        items={[]}
        loading={false}
        error={errorMessage}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /content.retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  test('calls onRetry when retry button is clicked', () => {
    render(
      <ContentsList
        items={[]}
        loading={false}
        error='Error message'
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /content.retry/i });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  test('renders empty state when no items', () => {
    render(
      <ContentsList items={[]} loading={false} error={null} onRetry={null} />
    );

    expect(screen.getByText('content.empty')).toBeInTheDocument();
  });

  test('renders items grid', () => {
    render(
      <ContentsList
        items={mockItems}
        loading={false}
        error={null}
        onItemClick={mockOnItemClick}
        onRetry={null}
      />
    );

    expect(screen.getByTestId('contents-list-grid')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('passes onClick handler to ItemCard', () => {
    render(
      <ContentsList
        items={mockItems}
        loading={false}
        error={null}
        onItemClick={mockOnItemClick}
        onRetry={null}
      />
    );

    const itemCard = screen.getByText('Item 1').closest('.item-card');
    fireEvent.click(itemCard!);

    expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  test('does not call onClick when not provided', () => {
    render(
      <ContentsList
        items={mockItems}
        loading={false}
        error={null}
        onRetry={null}
      />
    );

    const itemCard = screen.getByText('Item 1').closest('.item-card');
    fireEvent.click(itemCard!);

    expect(mockOnItemClick).not.toHaveBeenCalled();
  });

  test('renders all provided items', () => {
    render(
      <ContentsList
        items={mockItems}
        loading={false}
        error={null}
        onItemClick={mockOnItemClick}
        onRetry={null}
      />
    );

    expect(screen.getByText('Creator 1')).toBeInTheDocument();
    expect(screen.getByText('Creator 2')).toBeInTheDocument();
  });

  test('handles large number of items', () => {
    const manyItems = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i}`,
      creator: `Creator ${i}`,
      price: i * 10,
      image: `image${i}.jpg`,
      status: i % 2 === 0 ? PricingStatus.PAID : PricingStatus.FREE,
      pricingOption: i % 2,
    }));

    render(
      <ContentsList
        items={manyItems}
        loading={false}
        error={null}
        onRetry={null}
      />
    );

    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 19')).toBeInTheDocument();
  });
});
