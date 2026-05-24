import { Platform } from 'react-native';

export async function impactLight() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const Haptics = await import('expo-haptics');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics are an enhancement; unsupported environments should continue normally.
  }
}

export async function notifySuccess() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const Haptics = await import('expo-haptics');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // No-op on unsupported platforms.
  }
}

export async function notifyWarning() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const Haptics = await import('expo-haptics');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // No-op on unsupported platforms.
  }
}
