import { sum } from '../math';

describe('Math Utils', () => {
  test('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
