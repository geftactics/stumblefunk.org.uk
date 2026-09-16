const nameCollator = new Intl.Collator('en-GB', { sensitivity: 'base' });

export const fullName = (person) =>
  [person.first_name, person.last_name].filter(Boolean).join(' ').trim();

export const compareNames = (a, b) => nameCollator.compare(a.trim(), b.trim());

export const comparePeople = (a, b) => compareNames(fullName(a), fullName(b));
