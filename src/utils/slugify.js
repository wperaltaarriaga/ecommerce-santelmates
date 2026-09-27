export const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // saca acentos
      .replace(/\s+/g, '-')            // espacios -> guiones