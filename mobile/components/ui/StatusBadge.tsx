// components/ui/StatusBadge.tsx — Auto-maps status string to Badge variant
// Same status→variant mapping as website's StatusBadge component

import React from 'react';
import { Badge } from './Badge';
import { statusBadgeVariant } from '@/utils/statusColors';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant  = statusBadgeVariant(status);
  const label    = status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge variant={variant}>{label}</Badge>;
}
