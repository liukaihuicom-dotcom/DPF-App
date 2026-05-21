# Platform Rules

## App and H5

- Minimum touch target: 44 x 44 px.
- Safe areas must be handled by `react-native-safe-area-context`.
- Sticky footers must reserve bottom inset and avoid covering form fields.
- Keyboard-aware forms must use the shared `Screen` keyboard behavior.
- Tab labels must fit within fixed dimensions without layout shift.

## Web

- The app may run through Expo web.
- Local quote proxy uses WebSocket on port 8091 in development.
- Sensitive data must not be stored in localStorage. Current local storage is limited to non-sensitive demo settings and upgrade simulation state.

## Runtime Compatibility

Per Expo SDK 54 documentation, this app targets React Native 0.81, React 19.1, React Native Web 0.21, and Node 20.19.x minimum for the SDK family.

