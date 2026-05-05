// src/components/ui.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All shared React Native UI primitives.
// Design tokens come from theme.js so every component is visually
// consistent with the website.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Pressable,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, Typography, Spacing, Radius, Shadow, StatusColors } from '../constants/theme'
import Svg, { Path, Polyline, Rect, Circle, Line, Polygon } from 'react-native-svg' // react-native-svg: all SVG icon primitives

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#4B5EAA','#2E7D52','#D4860A','#2471A3','#7B3FA0','#C05621',
]
function getAvatarColor(name = '') {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}
function getInitials(name = '') {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
}

export function Avatar({ name = '', size = 42, style }) {
  const bg       = getAvatarColor(name)
  const initials = getInitials(name) || '?'
  return (
    <View style={[{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg,
      alignItems: 'center', justifyContent: 'center',
    }, style]}>
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontFamily: Typography.bodyBold, letterSpacing: 0.5 }}>
        {initials}
      </Text>
    </View>
  )
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
export function StatusBadge({ status, style }) {
  if (!status) return null
  const key    = status.toLowerCase()
  const colors = StatusColors[key] || { bg: 'rgba(156,163,175,0.12)', text: Colors.textMuted }
  return (
    <View style={[{ backgroundColor: colors.bg, paddingHorizontal: 9, paddingVertical: 3, borderRadius: Radius.full, alignSelf: 'flex-start' }, style]}>
      <Text style={{ fontSize: 11, fontFamily: Typography.bodyBold, color: colors.text, textTransform: 'capitalize', letterSpacing: 0.2 }}>
        {status}
      </Text>
    </View>
  )
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ current = 0, target = 0, showLabel = false, style }) {
  const pct      = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
  const fillColor = pct >= 100
    ? [Colors.success, '#4CAF81']
    : [Colors.accent, '#7B8ED4']
  return (
    <View style={style}>
      <View style={{ height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' }}>
        <LinearGradient
          colors={fillColor}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ width: `${pct}%`, height: '100%', borderRadius: 3 }}
        />
      </View>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <Text style={styles.labelSmall}>₱{current.toLocaleString('en-PH')} raised</Text>
          <Text style={styles.labelSmall}>{pct}% of ₱{target.toLocaleString('en-PH')}</Text>
        </View>
      )}
    </View>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style, onPress, noPad }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.82 }]}
      >
        {children}
      </Pressable>
    )
  }
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction, style }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.sm }, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={{ fontSize: 12.5, fontFamily: Typography.bodySemiBold, color: Colors.accent }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

// ── InfoRow ───────────────────────────────────────────────────────────────────
export function InfoRow({ label, value, last }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  )
}

// ── PrimaryButton ─────────────────────────────────────────────────────────────
export function PrimaryButton({ label, onPress, loading, disabled, variant = 'accent', icon, style }) {
  const variants = {
    accent:  { bg: [Colors.accent,   Colors.accentDark], text: '#fff'                   },
    success: { bg: [Colors.success,  '#235f3f'],         text: '#fff'                   },
    danger:  { bg: [Colors.danger,   '#9b2e23'],         text: '#fff'                   },
    ghost:   { bg: null,                                  text: Colors.textPrimary       },
    outline: { bg: null,                                  text: Colors.accent            },
  }
  const v = variants[variant] || variants.accent
  const isDisabled = disabled || loading

  if (v.bg) {
    return (
      <TouchableOpacity onPress={isDisabled ? undefined : onPress} activeOpacity={0.82} disabled={isDisabled} style={[{ borderRadius: Radius.md, overflow: 'hidden', opacity: isDisabled ? 0.55 : 1 }, style]}>
        <LinearGradient colors={v.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <>
                {icon && icon}
                <Text style={{ fontSize: 15, fontFamily: Typography.bodyBold, color: v.text }}>{label}</Text>
              </>
          }
        </LinearGradient>
      </TouchableOpacity>
    )
  }
  return (
    <TouchableOpacity onPress={isDisabled ? undefined : onPress} activeOpacity={0.75} disabled={isDisabled}
      style={[{
        height: 50, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center',
        borderWidth: variant === 'outline' ? 1.5 : 0,
        borderColor: variant === 'outline' ? Colors.accent : 'transparent',
        backgroundColor: variant === 'ghost' ? Colors.neutralLight : 'transparent',
        flexDirection: 'row', gap: 8,
        opacity: isDisabled ? 0.55 : 1,
      }, style]}>
      {icon && icon}
      <Text style={{ fontSize: 15, fontFamily: Typography.bodyBold, color: v.text }}>{label}</Text>
    </TouchableOpacity>
  )
}

// ── FormField ─────────────────────────────────────────────────────────────────
export function FormField({ label, error, hint, children, style }) {
  return (
    <View style={[{ gap: 5 }, style]}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      {children}
      {hint  && !error && <Text style={{ fontSize: 11.5, color: Colors.textMuted }}>{hint}</Text>}
      {error && <Text style={{ fontSize: 11.5, color: Colors.danger }}>{error}</Text>}
    </View>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, error, editable = true, multiline, numberOfLines, style }) {
  const [focused, setFocused] = useState(false)
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize || 'none'}
      autoCorrect={false}
      editable={editable}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.input, focused && styles.inputFocused, error && styles.inputError, !editable && styles.inputDisabled, multiline && { height: 88, paddingTop: 12, textAlignVertical: 'top' }, style]}
    />
  )
}

// ── RowItem ───────────────────────────────────────────────────────────────────
export function RowItem({ iconBg, iconColor, icon, title, subtitle, right, onPress, bordered = true, danger }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.rowItem, bordered && styles.rowItemBorder]}
    >
      {icon && (
        <View style={{
          width: 40, height: 40, borderRadius: 12,
          backgroundColor: iconBg || Colors.neutralLight,
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {React.cloneElement(icon, { color: iconColor || Colors.textMuted })}
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.rowTitle, danger && { color: Colors.danger }]} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.rowSub} numberOfLines={1}>{subtitle}</Text>}
      </View>
      {right
        ? right
        : onPress && <ChevronRightIcon />
      }
    </TouchableOpacity>
  )
}

// ── KpiTile ───────────────────────────────────────────────────────────────────
export function KpiTile({ label, value, sub, color = Colors.accent, bg, icon, style }) {
  return (
    <View style={[{
      backgroundColor: bg || Colors.white,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.borderCard,
      padding: Spacing.md,
      gap: 4,
    }, Shadow.sm, style]}>
      {icon && (
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
          {React.cloneElement(icon, { color })}
        </View>
      )}
      <Text style={{ fontSize: 11, fontFamily: Typography.bodySemiBold, color: Colors.textMuted, letterSpacing: 0.2 }}>{label}</Text>
      <Text style={{ fontSize: 22, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary, lineHeight: 26 }}>{value}</Text>
      {sub && <Text style={{ fontSize: 11, fontFamily: Typography.bodySemiBold, color }}>{sub}</Text>}
    </View>
  )
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, onBack, right }) {
  return (
    <LinearGradient
      colors={[Colors.primary, '#252C3D']}
      style={styles.pageHeader}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronLeftIcon color="#fff" size={18} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.pageTitle} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.pageSubtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        {right && <View style={{ flexShrink: 0 }}>{right}</View>}
      </View>
    </LinearGradient>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  if (!label) return <View style={{ height: 1, backgroundColor: Colors.borderInner }} />
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: 10 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: Colors.borderInner }} />
      <Text style={{ fontSize: 10.5, fontFamily: Typography.bodyBold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: Colors.borderInner }} />
    </View>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center' }}>
        {icon && React.cloneElement(icon, { color: Colors.textMuted, size: 24 })}
      </View>
      <Text style={{ fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary, textAlign: 'center' }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 19 }}>{subtitle}</Text>}
    </View>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', visible }) {
  if (!visible || !message) return null
  const bg = type === 'error' ? Colors.danger : Colors.primary
  return (
    <View style={[styles.toast, { backgroundColor: bg }]}>
      <CheckIcon color="#4ADE80" size={16} />
      <Text style={{ color: '#fff', fontSize: 13.5, fontFamily: Typography.bodySemiBold, flex: 1 }}>{message}</Text>
    </View>
  )
}

// ── Inline SVG Icon components ────────────────────────────────────────────────
// All icons use react-native-svg for crisp, scalable rendering on all densities.


export function HomeIcon({ color = Colors.textMuted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9,22 9,12 15,12 15,22" />
    </Svg>
  )
}

export function ProjectsIcon({ color = Colors.textMuted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="12,2 2,7 12,12 22,7" />
      <Polyline points="2,17 12,22 22,17" />
      <Polyline points="2,12 12,17 22,12" />
    </Svg>
  )
}

export function EventsIcon({ color = Colors.textMuted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  )
}

export function AnnouncementsIcon({ color = Colors.textMuted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  )
}

export function ProfileIcon({ color = Colors.textMuted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  )
}

export function MoneyIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Line x1="12" y1="1" x2="12" y2="23" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
  )
}

export function CalendarIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  )
}

export function EditIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  )
}

export function LockIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Rect x="3" y="11" width="18" height="11" rx="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  )
}

export function LogoutIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Polyline points="16,17 21,12 16,7" />
      <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  )
}

export function UserIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  )
}

export function ReportIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14,2 14,8 20,8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
      <Polyline points="10,9 9,9 8,9" />
    </Svg>
  )
}

export function AttendanceIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 11l3 3L22 4" />
      <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </Svg>
  )
}

export function MapPinIcon({ color = Colors.textMuted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  )
}

export function EyeIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

export function EyeOffIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <Line x1="1" y1="1" x2="23" y2="23" />
    </Svg>
  )
}

export function StarIcon({ color = Colors.warning, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={2} strokeLinecap="round">
      <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </Svg>
  )
}

export function ChevronRightIcon({ color = Colors.textMuted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <Polyline points="9,18 15,12 9,6" />
    </Svg>
  )
}

export function ChevronLeftIcon({ color = Colors.textMuted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <Polyline points="15,18 9,12 15,6" />
    </Svg>
  )
}

export function CheckIcon({ color = '#4ADE80', size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <Polyline points="20,6 9,17 4,12" />
    </Svg>
  )
}

export function InfoIcon({ color = Colors.textMuted, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </Svg>
  )
}

export function PhoneIcon({ color = Colors.textMuted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.62 4.5 2 2 0 0 1 3.62 2.31h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.02-.78a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  )
}

export function MailIcon({ color = Colors.textMuted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Polyline points="22,7 12,13 2,7" />
    </Svg>
  )
}

export function IdCardIcon({ color = Colors.textMuted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Rect x="2" y="5" width="20" height="14" rx="2" />
      <Line x1="2" y1="10" x2="22" y2="10" />
    </Svg>
  )
}

export function BriefcaseIcon({ color = Colors.textMuted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="7" width="20" height="14" rx="2" />
      <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Svg>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: Typography.display,
    color: Colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInner,
    gap: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Typography.bodyMedium,
    color: Colors.textMuted,
    width: 100,
    flexShrink: 0,
    marginTop: 1,
  },
  infoValue: {
    fontSize: 13.5,
    fontFamily: Typography.bodySemiBold,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 19,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontFamily: Typography.bodyBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderCard,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: Typography.body,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.accent,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(192,57,43,0.03)',
  },
  inputDisabled: {
    backgroundColor: Colors.neutralLight,
    color: Colors.textMuted,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: Colors.white,
  },
  rowItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInner,
  },
  rowTitle: {
    fontSize: 13.5,
    fontFamily: Typography.bodySemiBold,
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  rowSub: {
    fontSize: 12,
    fontFamily: Typography.body,
    color: Colors.textMuted,
  },
  pageHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: Typography.display,
    color: '#fff',
    lineHeight: 24,
  },
  pageSubtitle: {
    fontSize: 12,
    fontFamily: Typography.body,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 16, right: 16,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Shadow.lg,
    zIndex: 999,
  },
  labelSmall: {
    fontSize: 11,
    fontFamily: Typography.body,
    color: Colors.textMuted,
  },
})
