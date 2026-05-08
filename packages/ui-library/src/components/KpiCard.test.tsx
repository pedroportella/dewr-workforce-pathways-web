import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('renders the KPI label and value', () => {
    render(<KpiCard label="Average delay" value="6.1 min" />);
    expect(screen.getByText('Average delay')).toBeTruthy();
    expect(screen.getByText('6.1 min')).toBeTruthy();
  });
});
