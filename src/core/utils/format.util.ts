export const format = (str: string, ...args: any[]): string => {
  let i = 0;
  return str.replace(/%[sdj%]/g, (match) => {
    if (match === '%%') {
      return '%'; // Replace '%%' with a single '%'
    }
    const arg = args[i++];
    switch (match) {
      case '%s':
        return String(arg);
      case '%d':
        return Number(arg).toString();
      case '%j':
        try {
          return JSON.stringify(arg);
        } catch {
          return '[Circular]';
        }
      default:
        return '';
    }
  });
};
