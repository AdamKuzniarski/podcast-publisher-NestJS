import { generateSlug, generateUniqueSlug } from './slug.helpers';

describe('generateSlug', () => {
  it('lowercases and hyphenates words', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('collapses multiple spaces into one hyphen', () => {
    expect(generateSlug('Hello   World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(generateSlug('The Podcast! #1')).toBe('the-podcast-1');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('  --leading--trailing--  ')).toBe('leading-trailing');
  });

  it('returns untitled for all-special-character input', () => {
    expect(generateSlug('!!!')).toBe('untitled');
  });

  it('is idempotent for already-valid slugs', () => {
    expect(generateSlug('already-a-slug')).toBe('already-a-slug');
  });

  it('replaces non-ASCII characters with hyphens', () => {
    expect(generateSlug('café au lait')).toBe('caf-au-lait');
  });
});

describe('generateUniqueSlug', () => {
  it('returns base slug when it does not exist', async () => {
    const checkExists = jest.fn().mockResolvedValue(false);
    const result = await generateUniqueSlug('my-podcast', checkExists);
    expect(result).toBe('my-podcast');
    expect(checkExists).toHaveBeenCalledTimes(1);
    expect(checkExists).toHaveBeenCalledWith('my-podcast');
  });

  it('appends -1 when base slug exists', async () => {
    const checkExists = jest.fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const result = await generateUniqueSlug('my-podcast', checkExists);
    expect(result).toBe('my-podcast-1');
    expect(checkExists).toHaveBeenCalledTimes(2);
    expect(checkExists).toHaveBeenNthCalledWith(2, 'my-podcast-1');
  });

  it('increments counter until a free slug is found', async () => {
    const checkExists = jest.fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const result = await generateUniqueSlug('my-podcast', checkExists);
    expect(result).toBe('my-podcast-2');
    expect(checkExists).toHaveBeenCalledTimes(3);
  });
});
