import { useState, useEffect } from 'react';
import { formatRelative } from '../utils/formatDate';

export function useRelativeTime(date: string | null | undefined): string {
  const [label, setLabel] = useState(() => formatRelative(date));

  useEffect(() => {
    setLabel(formatRelative(date));
    const id = setInterval(() => setLabel(formatRelative(date)), 30_000);
    return () => clearInterval(id);
  }, [date]);

  return label;
}
