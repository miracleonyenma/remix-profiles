
const slugify = (str: string | null | undefined) =>
  str ? str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') : str

export default slugify