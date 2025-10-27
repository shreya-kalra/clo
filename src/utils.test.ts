import { add } from './utils';

/**
 * Utils Test Suite
 *
 * Tests for the utility functions in utils.ts
 */
describe('Utility Functions', () => {
  describe('add', () => {
    test('adds two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('adds negative numbers correctly', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('adds positive and negative numbers correctly', () => {
      expect(add(5, -3)).toBe(2);
    });

    test('adds zero correctly', () => {
      expect(add(5, 0)).toBe(5);
      expect(add(0, 5)).toBe(5);
    });

    test('adds decimal numbers correctly', () => {
      expect(add(1.5, 2.7)).toBe(4.2);
    });
  });
});
