// src/screens/EditProfileScreen.jsx
import React, { useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../constants/theme'
import { PageHeader, FormField, Input, PrimaryButton } from '../components/ui'

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

export default function EditProfileScreen() {
  const navigation = useNavigation()
  const { user, updateUser } = useAuth()

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
  const [success, setSuccess] = useState(false)

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
                    <TouchableOpacity  // gender pill: tap to select gender
                      key={g}
                      onPress={() => set('gender')(g)}
                      activeOpacity={0.75}
                      style={[styles.genderPill, form.gender === g && styles.genderPillActive]}
                    >
                      <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </FormField>
            </View>
          </View>

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

          {/* Read-only fields */}
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
    borderWidth: 1,
    borderColor: Colors.borderCard,
    overflow: 'hidden',
  },
  sectionLabel: {
    fontSize: 11, fontFamily: Typography.bodyBold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 14, paddingBottom: 2,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
    backgroundColor: Colors.neutralLight,
  },
  sectionBody: {
    padding: Spacing.lg,
    gap: 14,
  },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genderPill: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.neutralLight,
    borderWidth: 1.5, borderColor: Colors.borderCard,
  },
  genderPillActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  genderText:       { fontSize: 13, fontFamily: Typography.bodyMedium, color: Colors.textSecondary },
  genderTextActive: { color: '#fff', fontFamily: Typography.bodySemiBold },
})
