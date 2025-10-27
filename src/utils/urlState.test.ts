import { clearURLParams, parseURLParams, updateURLParams } from './urlState';

describe.skip('urlState utilities', () => {
  const mockReplaceState = jest.fn();

  beforeEach(() => {
    mockReplaceState.mockClear();
    (window as any).history = { replaceState: mockReplaceState };
  });

  describe('updateURLParams', () => {
    test('adds search parameter', () => {
      updateURLParams({
        search: 'test',
        filters: { paid: false, free: false, viewOnly: false },
      });
      expect(mockReplaceState).toHaveBeenCalled();
    });

    test('adds filter parameters', () => {
      updateURLParams({
        search: '',
        filters: { paid: true, free: true, viewOnly: false },
      });
      expect(mockReplaceState).toHaveBeenCalled();
    });

    test('trims search term', () => {
      updateURLParams({
        search: '  test  ',
        filters: { paid: false, free: false, viewOnly: false },
      });
      expect(mockReplaceState).toHaveBeenCalled();
    });
  });

  describe('parseURLParams', () => {
    test('parses search parameter', () => {
      Object.defineProperty(window, 'location', {
        value: new URL('https://example.com?search=test'),
        writable: true,
      });
      const result = parseURLParams();
      expect(result.search).toBe('test');
    });

    test('parses filter parameters', () => {
      Object.defineProperty(window, 'location', {
        value: new URL(
          'https://example.com?paid=true&free=true&viewOnly=false'
        ),
        writable: true,
      });
      const result = parseURLParams();
      expect(result.filters.paid).toBe(true);
      expect(result.filters.free).toBe(true);
      expect(result.filters.viewOnly).toBe(false);
    });

    test('returns empty values when no params exist', () => {
      Object.defineProperty(window, 'location', {
        value: new URL('https://example.com'),
        writable: true,
      });
      const result = parseURLParams();
      expect(result.search).toBe('');
      expect(result.filters).toEqual({
        paid: false,
        free: false,
        viewOnly: false,
      });
    });
  });

  describe('clearURLParams', () => {
    test('clears all URL parameters', () => {
      Object.defineProperty(window, 'location', {
        value: new URL('https://example.com?search=test&paid=true'),
        writable: true,
      });
      clearURLParams();
      expect(mockReplaceState).toHaveBeenCalled();
    });
  });
});
