import { Redirect, useLocalSearchParams } from 'expo-router';

export default function VerifyDeprecatedScreen() {
  const params = useLocalSearchParams<{ redirect?: string }>();
  const redirect = typeof params.redirect === 'string' ? params.redirect : '/markets';

  return <Redirect href={`/auth?redirect=${encodeURIComponent(redirect)}` as never} />;
}
