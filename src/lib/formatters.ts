export const formatNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);

export const formatSeconds = (value: number) => `${formatNumber(value, 1)}s`;
