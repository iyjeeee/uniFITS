// src/screens/EditProfileScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Edit Profile — includes photo upload section using expo-image-picker.
// Photo is stored in AuthContext (photo_url field) and displayed as an
// Avatar with an image overlay when a photo is selected.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, StatusBar,
  TouchableOpacity, Image, Alert, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '../context/AuthContext'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { PageHeader, FormField, Input, PrimaryButton, Avatar, EditIcon } from '../components/ui'

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

// ── PhotoPicker — avatar + camera/gallery picker overlay ─────────────────────
function PhotoPicker({ currentPhoto, fullName, onPhotoChange }) {
  const [picking, setPicking] = useState(false)

  // requestAndPick — asks for permission then opens picker
  const requestAndPick = useCallback(async (source) => {
    try {
      let result
      if (source === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync()
        if (!perm.granted) {
          Alert.alert('Permission needed', 'Camera access is required to take a photo.')
          return
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        })
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!perm.granted) {
          Alert.alert('Permission needed', 'Photo library access is required to select a photo.')
          return
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        })
      }
      if (!result.canceled && result.assets?.[0]?.uri) {
        onPhotoChange(result.assets[0].uri)
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open picker. Please try again.')
    }
  }, [onPhotoChange])

  // showOptions — action sheet style alert for picking source
  const showOptions = useCallback(() => {
    Alert.alert(
      'Profile Photo',
      'Choose how to update your photo',
      [
        { text: 'Take Photo',          onPress: () => requestAndPick('camera')  },
        { text: 'Choose from Library', onPress: () => requestAndPick('library') },
        currentPhoto
          ? { text: 'Remove Photo', style: 'destructive', onPress: () => onPhotoChange(null) }
          : null,
        { text: 'Cancel', style: 'cancel' },
      ].filter(Boolean)
    )
  }, [currentPhoto, requestAndPick, onPhotoChange])

  return (
    <View style={styles.photoSection}>
      {/* ── Section label — same style as other sections ── */}
      <Text style={styles.sectionLabel}>Profile Photo</Text>
      <View style={styles.photoBody}>
        {/* Avatar / photo preview */}
        <View style={styles.photoAvatarWrap}>
          {currentPhoto ? (
            <Image
              source={{ uri: currentPhoto }}
              style={styles.photoImage}
              resizeMode="cover"
            />
          ) : (
            <Avatar name={fullName} size={84} />
          )}
          {/* Camera badge overlay */}
          <TouchableOpacity
            onPress={showOptions}
            activeOpacity={0.82}
            style={styles.photoBadge}
          >
            <Text style={styles.photoBadgeIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Right side: description + buttons */}
        <View style={styles.photoInfo}>
          <Text style={styles.photoHint}>
            {currentPhoto
              ? 'Tap the avatar or the buttons below to change or remove your photo.'
              : 'Add a profile photo so others can recognise you.'}
          </Text>
          <View style={styles.photoActions}>
            <TouchableOpacity
              onPress={() => requestAndPick('library')}
              activeOpacity={0.8}
              style={[styles.photoBtn, styles.photoBtnPrimary]}
            >
              <Text style={styles.photoBtnPrimaryText}>Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => requestAndPick('camera')}
              activeOpacity={0.8}
              style={[styles.photoBtn, styles.photoBtnSecondary]}
            >
              <Text style={styles.photoBtnSecondaryText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          {currentPhoto && (
            <TouchableOpacity onPress={() => onPhotoChange(null)} activeOpacity={0.7}>
              <Text style={styles.photoRemove}>Remove photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

export default function EditProfileScreen() {
  const navigation      = useNavigation()
  const { user, updateUser } = useAuth()

  const [photo, setPhoto] = useState(user.photo_url || null) // local photo URI

  const [form, setForm] = useState({
    first_name:       user.first_name       || '',
    last_name:        user.last_name        || '',
    contact_number:   user.contact_number   || '',
    email:            user.email            || '',
    gender:           user.gender           || '',
    address_city:     user.address_city     || '',
    address_province: user.address_province || '',
    occupation:       user.occupation       || '',
  })
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)

  const set = (key) => (val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: null }))
  }

  function validate() {
    const e = {}
    if (!form.first_name.trim())     e.first_name     = 'First name is required.'
    if (!form.last_name.trim())      e.last_name      = 'Last name is required.'
    if (!form.email.trim())          e.email          = 'Email is required.'
    if (!form.contact_number.trim()) e.contact_number = 'Contact number is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    updateUser({
      first_name:       form.first_name,
      last_name:        form.last_name,
      full_name:        `${form.first_name} ${form.last_name}`,
      contact_number:   form.contact_number,
      email:            form.email,
      gender:           form.gender,
      address_city:     form.address_city,
      address_province: form.address_province,
      occupation:       form.occupation,
      photo_url:        photo, // persist chosen photo URI
    })
    setSaving(false)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <PageHeader title="Edit Profile" subtitle="Update your personal info" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ backgroundColor: Colors.bgApp }}
          contentContainerStyle={{ padding: Spacing.lg, gap: 14 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Photo picker section ─────────────────────────────────── */}
          <View style={styles.section}>
            <PhotoPicker
              currentPhoto={photo}
              fullName={`${form.first_name} ${form.last_name}`.trim() || user.full_name}
              onPhotoChange={setPhoto}
            />
          </View>

          {/* ── Basic Information ────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Basic Information</Text>
            <View style={styles.sectionBody}>
              <FormField label="First Name" error={errors.first_name}>
                <Input value={form.first_name} onChangeText={set('first_name')} placeholder="First name" autoCapitalize="words" error={errors.first_name} />
              </FormField>
              <FormField label="Last Name" error={errors.last_name}>
                <Input value={form.last_name} onChangeText={set('last_name')} placeholder="Last name" autoCapitalize="words" error={errors.last_name} />
              </FormField>
              <FormField label="Gender">
                <View style={styles.genderRow}>
                  {GENDER_OPTIONS.map(g => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => set('gender')(g)}
                      activeOpacity={0.75}
                      style={[styles.genderPill, form.gender === g && styles.genderPillActive]}
                    >
                      <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </FormField>
            </View>
          </View>

          {/* ── Contact ──────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Contact</Text>
            <View style={styles.sectionBody}>
              <FormField label="Email Address" error={errors.email}>
                <Input value={form.email} onChangeText={set('email')} placeholder="you@example.com" keyboardType="email-address" error={errors.email} />
              </FormField>
              <FormField label="Contact Number" error={errors.contact_number}>
                <Input value={form.contact_number} onChangeText={set('contact_number')} placeholder="09XXXXXXXXX" keyboardType="phone-pad" error={errors.contact_number} />
              </FormField>
            </View>
          </View>

          {/* ── Location & Work ──────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Location & Work</Text>
            <View style={styles.sectionBody}>
              <FormField label="City">
                <Input value={form.address_city} onChangeText={set('address_city')} placeholder="City" autoCapitalize="words" />
              </FormField>
              <FormField label="Province">
                <Input value={form.address_province} onChangeText={set('address_province')} placeholder="Province" autoCapitalize="words" />
              </FormField>
              <FormField label="Occupation">
                <Input value={form.occupation} onChangeText={set('occupation')} placeholder="Your occupation" autoCapitalize="words" />
              </FormField>
            </View>
          </View>

          {/* ── Member Info (read-only) ───────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Member Info (Read Only)</Text>
            <View style={styles.sectionBody}>
              <FormField label="Member ID" hint="Contact an officer to update this.">
                <Input value={user.employee_number} editable={false} />
              </FormField>
              <FormField label="Role" hint="Assigned by officers.">
                <Input value={user.role} editable={false} />
              </FormField>
              <FormField label="Department" hint="Assigned by officers.">
                <Input value={user.department} editable={false} />
              </FormField>
            </View>
          </View>

          <PrimaryButton label="Save Changes" onPress={handleSave} loading={saving} style={{ marginBottom: Spacing.xxxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden',
  },

  // Section label bar — same style across all sections
  sectionLabel: {
    fontSize: 11, fontFamily: Typography.bodyBold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 14, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
    backgroundColor: Colors.neutralLight,
  },
  sectionBody: { padding: Spacing.lg, gap: 14 },

  // ── Photo picker ──────────────────────────────────────────────────────────
  photoSection: {},
  photoBody: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: Spacing.lg, gap: 16,
  },

  // Avatar / photo circle with camera badge
  photoAvatarWrap: { position: 'relative', flexShrink: 0 },
  photoImage: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 2.5, borderColor: Colors.borderCard,
  },
  // Camera icon badge — bottom-right of the avatar circle
  photoBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  photoBadgeIcon: { fontSize: 13 },

  // Right side info + action buttons
  photoInfo:    { flex: 1 },
  photoHint:    { fontSize: 12.5, fontFamily: Typography.body, color: Colors.textMuted, lineHeight: 18, marginBottom: 12 },
  photoActions: { flexDirection: 'row', gap: 8, marginBottom: 8 },

  // Choose Photo button — primary accent
  photoBtn:            { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1.5 },
  photoBtnPrimary:     { backgroundColor: Colors.accent, borderColor: Colors.accent },
  photoBtnPrimaryText: { fontSize: 12.5, fontFamily: Typography.bodySemiBold, color: '#fff' },

  // Take Photo button — outlined
  photoBtnSecondary:     { backgroundColor: Colors.white, borderColor: Colors.borderCard },
  photoBtnSecondaryText: { fontSize: 12.5, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },

  // Remove link
  photoRemove: { fontSize: 12, fontFamily: Typography.bodyMedium, color: Colors.danger, marginTop: 2 },

  // ── Basic info fields ──────────────────────────────────────────────────────
  genderRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genderPill:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1.5, borderColor: Colors.borderCard },
  genderPillActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  genderText:       { fontSize: 13, fontFamily: Typography.bodyMedium, color: Colors.textSecondary },
  genderTextActive: { color: '#fff', fontFamily: Typography.bodySemiBold },
})
