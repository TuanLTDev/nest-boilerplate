export const toCamelCase = (str: string): string => {
  if (str === '_id') return str;
  if (str === 'address_line_1') return 'address_line1';
  if (str === 'address_line_2') return 'address_line2';
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
};

export const convertKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const camelKey = toCamelCase(key);
        acc[camelKey] = convertKeysToCamelCase(obj[key]);
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return obj;
};
