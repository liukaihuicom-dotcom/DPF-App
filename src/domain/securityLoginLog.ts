import { Platform } from 'react-native';

import type { RememberedLoginSnapshot } from '@/src/settings/ProductSettings';

export type SecurityRiskLevel = 'low' | 'medium' | 'high';
export type SecuritySessionStatus = 'active' | 'revoked';
export type SecurityDeviceType = 'desktop' | 'phone' | 'unknown';
export type SecurityEventStatus = 'open' | 'reported' | 'resolved';
export type SecurityLoginEventType = 'login_success' | 'login_suspicious' | 'session_revoked' | 'not_me_reported';

export type SecuritySession = {
  appName: string;
  createdAt: string;
  ipHintMasked: string;
  isCurrentSession: boolean;
  lastActiveAt: string;
  sessionId: string;
  status: SecuritySessionStatus;
};

export type SecurityLoginEvent = {
  createdAt: string;
  descriptionKey: string;
  eventId: string;
  eventType: SecurityLoginEventType;
  riskLevel: SecurityRiskLevel;
  status: SecurityEventStatus;
};

export type SecurityDevice = {
  deviceId: string;
  deviceName: string;
  deviceType: SecurityDeviceType;
  events: SecurityLoginEvent[];
  isCurrentDevice: boolean;
  lastActiveAt: string;
  locationLabel: string;
  os: string;
  riskLevel: SecurityRiskLevel;
  sessions: SecuritySession[];
};

export type SecurityLoginActionResult =
  | { code: 'ok'; devices: SecurityDevice[] }
  | {
      code:
        | 'SECURITY_CURRENT_SESSION_REVOKE_BLOCKED'
        | 'SECURITY_EVENT_ALREADY_REPORTED'
        | 'SECURITY_PERMISSION_DENIED'
        | 'SECURITY_SESSION_ALREADY_REVOKED';
      devices: SecurityDevice[];
    };

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function buildSecurityLoginDevices(snapshot: RememberedLoginSnapshot | null, now = new Date()): SecurityDevice[] {
  return [
    buildCurrentDevice(snapshot, now),
    {
      deviceId: 'device-mac-previous',
      deviceName: 'Mac',
      deviceType: 'desktop',
      events: [
        {
          createdAt: isoAt(now, -2 * DAY),
          descriptionKey: 'securityLog.event.loginSuccess',
          eventId: 'event-mac-login',
          eventType: 'login_success',
          riskLevel: 'low',
          status: 'resolved',
        },
      ],
      isCurrentDevice: false,
      lastActiveAt: isoAt(now, -2 * DAY),
      locationLabel: 'Jakarta, Indonesia',
      os: 'macOS',
      riskLevel: 'low',
      sessions: [
        buildSession('session-mac-chrome', 'Google Chrome', isoAt(now, -16 * DAY), isoAt(now, -2 * DAY), false, '103.***.42.18'),
        buildSession('session-mac-cursor', 'Cursor', isoAt(now, -28 * DAY), isoAt(now, -13 * DAY), false, '103.***.42.18'),
      ],
    },
    {
      deviceId: 'device-iphone-travel',
      deviceName: 'iPhone',
      deviceType: 'phone',
      events: [
        {
          createdAt: isoAt(now, -18 * HOUR),
          descriptionKey: 'securityLog.event.suspiciousLocation',
          eventId: 'event-iphone-location',
          eventType: 'login_suspicious',
          riskLevel: 'medium',
          status: 'open',
        },
      ],
      isCurrentDevice: false,
      lastActiveAt: isoAt(now, -18 * HOUR),
      locationLabel: 'Kuala Lumpur, Malaysia',
      os: 'iOS',
      riskLevel: 'medium',
      sessions: [buildSession('session-iphone-safari', 'Safari', isoAt(now, -30 * DAY), isoAt(now, -18 * HOUR), false, '60.***.11.84')],
    },
    {
      deviceId: 'device-windows-revoked',
      deviceName: 'Windows PC',
      deviceType: 'desktop',
      events: [
        {
          createdAt: isoAt(now, -19 * DAY),
          descriptionKey: 'securityLog.event.sessionRevoked',
          eventId: 'event-windows-revoked',
          eventType: 'session_revoked',
          riskLevel: 'low',
          status: 'resolved',
        },
      ],
      isCurrentDevice: false,
      lastActiveAt: isoAt(now, -19 * DAY),
      locationLabel: 'Bandung, Indonesia',
      os: 'Windows',
      riskLevel: 'low',
      sessions: [
        {
          ...buildSession('session-windows-edge', 'Microsoft Edge', isoAt(now, -34 * DAY), isoAt(now, -19 * DAY), false, '114.***.78.20'),
          status: 'revoked',
        },
      ],
    },
    {
      deviceId: 'device-unknown',
      deviceName: 'Unknown device',
      deviceType: 'unknown',
      events: [
        {
          createdAt: isoAt(now, -7 * DAY),
          descriptionKey: 'securityLog.event.unknownDevice',
          eventId: 'event-unknown-device',
          eventType: 'login_suspicious',
          riskLevel: 'high',
          status: 'open',
        },
      ],
      isCurrentDevice: false,
      lastActiveAt: isoAt(now, -7 * DAY),
      locationLabel: 'Unknown location',
      os: 'Unknown OS',
      riskLevel: 'high',
      sessions: [buildSession('session-unknown-app', 'iOS Account Manager', isoAt(now, -7 * DAY), isoAt(now, -7 * DAY), false, '185.***.12.44')],
    },
  ];
}

export function revokeSecuritySession(devices: SecurityDevice[], sessionId: string): SecurityLoginActionResult {
  const target = devices.flatMap((device) => device.sessions).find((session) => session.sessionId === sessionId);

  if (!target) {
    return { code: 'SECURITY_PERMISSION_DENIED', devices };
  }

  if (target.isCurrentSession) {
    return { code: 'SECURITY_CURRENT_SESSION_REVOKE_BLOCKED', devices };
  }

  if (target.status === 'revoked') {
    return { code: 'SECURITY_SESSION_ALREADY_REVOKED', devices };
  }

  const now = new Date().toISOString();
  const nextDevices = devices.map((device) => {
    const ownsSession = device.sessions.some((session) => session.sessionId === sessionId);

    if (!ownsSession) {
      return device;
    }

    return {
      ...device,
      events: [
        {
          createdAt: now,
          descriptionKey: 'securityLog.event.sessionRevoked',
          eventId: `event-revoked-${sessionId}`,
          eventType: 'session_revoked' as const,
          riskLevel: 'low' as const,
          status: 'resolved' as const,
        },
        ...device.events,
      ],
      sessions: device.sessions.map((session) => (session.sessionId === sessionId ? { ...session, status: 'revoked' as const } : session)),
    };
  });

  return { code: 'ok', devices: nextDevices };
}

export function reportSecurityEvent(devices: SecurityDevice[], eventId: string): SecurityLoginActionResult {
  const target = devices.flatMap((device) => device.events).find((event) => event.eventId === eventId);

  if (!target) {
    return { code: 'SECURITY_PERMISSION_DENIED', devices };
  }

  if (target.status === 'reported') {
    return { code: 'SECURITY_EVENT_ALREADY_REPORTED', devices };
  }

  const nextDevices = devices.map((device) => {
    const ownsEvent = device.events.some((event) => event.eventId === eventId);

    if (!ownsEvent) {
      return device;
    }

    return {
      ...device,
      riskLevel: 'high' as const,
      events: device.events.map((event) =>
        event.eventId === eventId
          ? {
              ...event,
              eventType: 'not_me_reported' as const,
              riskLevel: 'high' as const,
              status: 'reported' as const,
            }
          : event,
      ),
    };
  });

  return { code: 'ok', devices: nextDevices };
}

function buildCurrentDevice(snapshot: RememberedLoginSnapshot | null, now: Date): SecurityDevice {
  const lastActiveAt = snapshot?.lastLoginAt ?? now.toISOString();
  const deviceName = snapshot?.deviceLabel === 'web-demo-device' ? 'Web demo device' : snapshot?.deviceLabel === 'local-device' ? 'This device' : snapshot?.deviceLabel ?? 'This device';
  const os = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : Platform.OS === 'web' ? 'Web' : 'Local app';

  return {
    deviceId: 'device-current',
    deviceName,
    deviceType: Platform.OS === 'ios' || Platform.OS === 'android' ? 'phone' : 'desktop',
    events: [
      {
        createdAt: lastActiveAt,
        descriptionKey: 'securityLog.event.currentLogin',
        eventId: 'event-current-login',
        eventType: 'login_success',
        riskLevel: 'low',
        status: 'resolved',
      },
    ],
    isCurrentDevice: true,
    lastActiveAt,
    locationLabel: snapshot?.locationHint ?? 'Local demo environment',
    os,
    riskLevel: 'low',
    sessions: [
      buildSession(
        'session-current',
        Platform.OS === 'web' ? 'Expo Web' : 'Dupoin App',
        lastActiveAt,
        lastActiveAt,
        true,
        snapshot?.ipHint ?? 'local-demo',
      ),
    ],
  };
}

function buildSession(
  sessionId: string,
  appName: string,
  createdAt: string,
  lastActiveAt: string,
  isCurrentSession: boolean,
  ipHintMasked: string,
): SecuritySession {
  return {
    appName,
    createdAt,
    ipHintMasked,
    isCurrentSession,
    lastActiveAt,
    sessionId,
    status: 'active',
  };
}

function isoAt(now: Date, offsetMs: number) {
  return new Date(now.getTime() + offsetMs).toISOString();
}
