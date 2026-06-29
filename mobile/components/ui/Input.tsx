// components/ui/Input.tsx — Labeled text input with error/hint states
// Mirrors website's Input component visual behavior (focus → accent border)

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TextInputProps, ViewStyle,
} from 'react-native';
import { Colors, Typography, FontSize, Radius, Spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?:    string;
  hint?:     string;
  error?:    string;
  required?: boolean;
  style?:    ViewStyle;
}

export function Input({ label, hint, error, required, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? Colors.danger
    : focused
    ? Colors.accent
    : Colors.borderCard;

  const shadowStyle = focused && !error ? {
    shadowColor:   Colors.accent,
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius:  3,
    elevation:     2,
  } : {};

  return (
    <View style={[styles.wrapper, style]}>
      {/* Label row */}
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      {/* Input field */}
      <TextInput
        {...props}
        onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
        placeholderTextColor={Colors.textMuted}
        style={[
          styles.input,
          {
            borderColor,
            backgroundColor: props.editable === false ? Colors.neutralLight : Colors.white,
          },
          shadowStyle,
        ]}
      />

      {/* Hint / error text */}
      {error  && <Text style={styles.error}>{error}</Text>}
      {!error && hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.textSecondary,
  },
  required: {
    color:    Colors.danger,
    fontSize: FontSize.sm,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical:   9,
    borderRadius:      Radius.sm,
    borderWidth:       1,
    fontSize:          FontSize.base,
    fontFamily:        Typography.fontBody,
    color:             Colors.textPrimary,
    width:             '100%',
  },
  hint: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.xs,
    color:      Colors.textMuted,
  },
  error: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.xs,
    color:      Colors.danger,
  },
});
