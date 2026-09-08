// components/ui/Section.tsx — Section panel wrapper: gives list sections (Pinned, Recent Announcements,
// Recent Transactions, All Announcements, etc.) their own white background + border + padding so they
// read as a distinct block instead of a header floating directly on the screen background.

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Layout, Shadow } from '@/constants/theme';
import { SectionHeader } from './SectionHeader';

interface SectionProps {
  title:        string;
  count?:       number;
  actionLabel?: string;
  onAction?:    () => void;
  children:     React.ReactNode;
  style?:       ViewStyle;
}

export function Section({ title, count, actionLabel, onAction, children, style }: SectionProps) {
  return (
    <View style={[styles.panel, style]}>
      <SectionHeader title={title} count={count} actionLabel={actionLabel} onAction={onAction} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.xl,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderCard,
    padding:         Layout.CARD_PADDING,
    ...Shadow.sm,
  },
});
