export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-AU').format(value);
}

export function formatDelta(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
}

export function percentageDelta(base: number, scenario: number): number {
  if (base === 0) {
    return 0;
  }
  return ((scenario - base) / base) * 100;
}
