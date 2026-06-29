// app/(tabs)/profile/edit.tsx — Edit profile screen

import { useState } from 'react';
import {
  ScrollView, View, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Layout } from '@/constants/theme';
import { AppHeader, Input, Button } from '@/components/ui';
import { membersService }  from '@/services/members.service';
import { useAuthStore }    from '@/store/authStore';
import { useCurrentUser }  from '@/hooks/useCurrentUser';

export default function EditProfileScreen() {
  const user           = useCurrentUser();
  const insets         = useSafeAreaInsets();
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);

  const [contactNumber,   setContactNumber]   = useState(user?.contact_number ?? '');
  const [occupation,      setOccupation]      = useState(user?.occupation ?? '');
  const [addressCity,     setAddressCity]     = useState(user?.address_city ?? '');
  const [addressProvince, setAddressProvince] = useState(user?.address_province ?? '');
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  if (!user) return null;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!contactNumber.trim()) e.contactNumber = 'Contact number is required.';
    if (!occupation.trim())    e.occupation    = 'Occupation is required.';
    if (!addressCity.trim())   e.addressCity   = 'City is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    try {
      const updated = await membersService.updateProfile(user.id, {
        contact_number:   contactNumber.trim(),
        occupation:       occupation.trim(),
        address_city:     addressCity.trim(),
        address_province: addressProvince.trim(),
      });
      setCurrentUser(updated);
      Alert.alert('Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Edit Profile"
        subtitle="Update your personal information"
        showBack
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Read-only fields */}
        <Input label="Full Name"  value={user.full_name}  editable={false} />
        <Input label="Email"      value={user.email}      editable={false} />
        <Input label="Role"       value={user.role}       editable={false} />
        <Input label="Department" value={user.department} editable={false} />

        {/* Editable fields */}
        <Input
          label="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          placeholder="09XXXXXXXXX"
          error={errors.contactNumber}
          required
        />
        <Input
          label="Occupation"
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Your job title or role"
          error={errors.occupation}
          required
        />
        <Input
          label="City"
          value={addressCity}
          onChangeText={setAddressCity}
          placeholder="Your city"
          error={errors.addressCity}
        />
        <Input
          label="Province"
          value={addressProvince}
          onChangeText={setAddressProvince}
          placeholder="Your province"
        />

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          fullWidth
          style={{ marginTop: Spacing.sm }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:    { flex: 1, backgroundColor: Colors.bgApp },
  content: {
    padding:    Layout.SCREEN_PADDING_H,
    paddingTop: Spacing.md,
    gap:        Spacing.md,
    flexGrow:   1,
  },
});
