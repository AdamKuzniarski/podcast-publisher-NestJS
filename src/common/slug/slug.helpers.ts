export function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'untitled';
}

export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>,
): Promise<string> {
  if (!(await checkExists(baseSlug))) {
    return baseSlug;
  }
  let counter = 1;
  while (true) {
    const candidate = `${baseSlug}-${counter}`;
    if (!(await checkExists(candidate))) {
      return candidate;
    }
    counter++;
  }
}