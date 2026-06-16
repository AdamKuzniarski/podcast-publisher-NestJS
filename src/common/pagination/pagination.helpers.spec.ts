import { paginate, toPaginatedResult } from './pagination.helpers';

describe('paginate', () => {
  it('returns skip=0 for first page', () => {
    expect(paginate(1, 20)).toEqual({ skip: 0, take: 20 });
  });

  it('returns correct skip for second page', () => {
    expect(paginate(2, 20)).toEqual({ skip: 20, take: 20 });
  });

  it('handles custom limit', () => {
    expect(paginate(3, 10)).toEqual({ skip: 20, take: 10 });
  });
});

describe('toPaginatedResult', () => {
  it('passes data through unchanged', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const result = toPaginatedResult(data, 2, 1, 20);
    expect(result.data).toBe(data);
  });

  it('calculates totalPages correctly', () => {
    const result = toPaginatedResult([], 25, 1, 10);
    expect(result.meta.totalPages).toBe(3);
  });

  it('returns totalPages=0 when total is 0', () => {
    const result = toPaginatedResult([], 0, 1, 20);
    expect(result.meta.totalPages).toBe(0);
  });

  it('echoes back page, limit, and total in meta', () => {
    const result = toPaginatedResult([], 42, 3, 15);
    expect(result.meta.page).toBe(3);
    expect(result.meta.limit).toBe(15);
    expect(result.meta.total).toBe(42);
  });

  it('rounds up totalPages for partial last page', () => {
    const result = toPaginatedResult([], 21, 1, 20);
    expect(result.meta.totalPages).toBe(2);
  });
});