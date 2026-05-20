import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { localizeText } from '@/src/domain/format';
import type { UpgradeRequest } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

import { ActionButton } from './ActionButton';
import { Card } from './Card';
import { NativePressable } from './NativePressable';
import { PhosphorIcon } from './PhosphorIcon';
import { AppText } from './Typography';

type UpgradeChatCardProps = {
  request?: UpgradeRequest;
  readonly?: boolean;
};

export function UpgradeChatCard({ request, readonly }: UpgradeChatCardProps) {
  const { submitUpgradeRequest, upgradeRequest } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const toast = useToast();
  const activeRequest = request ?? upgradeRequest;
  const [reason, setReason] = useState(t('upgrade.defaultReason'));
  const pending = activeRequest.status === 'pending';
  const approved = activeRequest.status === 'approved';
  const chips = [t('upgrade.reason.community'), t('upgrade.reason.clients'), t('upgrade.reason.education')];

  const submit = () => {
    const trimmed = reason.trim();
    if (trimmed.length < 8) {
      void notifyWarning();
      toast.show({ message: t('upgrade.reasonError'), title: t('upgrade.submitBlocked'), tone: 'warning' });
      return;
    }

    submitUpgradeRequest(trimmed);
    void notifySuccess();
    toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.submitted'), tone: 'success' });
  };

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <AppText tone="dim" variant="eyebrow">
            {t('upgrade.chatRequest')}
          </AppText>
          <AppText variant="subtitle">{t('upgrade.applyTitle')}</AppText>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {t('upgrade.superior')}: {activeRequest.superiorName}
          </AppText>
        </View>
        <View
          style={StyleSheet.flatten([
            styles.statusPill,
            {
              backgroundColor: approved ? `${palette.down}12` : pending ? `${palette.amber}12` : palette.panelSoft,
              borderColor: approved ? palette.down : pending ? palette.amber : palette.line,
            },
          ])}>
          <AppText tone={approved ? 'down' : pending ? 'amber' : 'muted'} variant="caption">
            {t(`upgrade.status.${activeRequest.status}`)}
          </AppText>
        </View>
      </View>

      <View style={styles.messages}>
        {activeRequest.messages.map((message) => {
          const trader = message.author === 'trader';
          return (
            <View
              key={message.id}
              style={StyleSheet.flatten([
                styles.messageBubble,
                {
                  alignSelf: trader ? 'flex-end' : 'flex-start',
                  backgroundColor: trader ? palette.text : palette.panelSoft,
                  borderColor: trader ? palette.text : palette.lineSoft,
                },
              ])}>
              <AppText style={trader && { color: palette.panel }} variant="caption">
                {localizeText(message.body, locale)}
              </AppText>
              <AppText style={trader && { color: `${palette.panel}CC` }} tone={trader ? 'default' : 'dim'} variant="caption">
                {message.createdAt}
              </AppText>
            </View>
          );
        })}
      </View>

      {!readonly && !pending && !approved ? (
        <View style={styles.applyForm}>
          <View style={styles.chipRow}>
            {chips.map((chip) => (
              <NativePressable
                accessibilityRole="button"
                key={chip}
                minTouch={34}
                onPress={() => setReason(chip)}
                style={StyleSheet.flatten([styles.reasonChip, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
                <AppText numberOfLines={1} variant="caption">
                  {chip}
                </AppText>
              </NativePressable>
            ))}
          </View>
          <View style={StyleSheet.flatten([styles.inputShell, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
            <PhosphorIcon color={palette.brand} name="chat-circle" size={15} />
            <TextInput
              multiline
              onChangeText={setReason}
              placeholder={t('upgrade.reasonPlaceholder')}
              placeholderTextColor={palette.textDim}
              selectionColor={palette.brand}
              style={StyleSheet.flatten([styles.input, { color: palette.text }])}
              value={reason}
            />
          </View>
          <ActionButton label={t('upgrade.submit')} onPress={submit} tone="brand" />
        </View>
      ) : null}

      {!readonly && pending ? (
        <View style={StyleSheet.flatten([styles.waitingBox, { backgroundColor: `${palette.amber}10`, borderColor: palette.amber }])}>
          <PhosphorIcon color={palette.amber} name="clock" size={15} />
          <AppText tone="amber" variant="caption">
            {t('upgrade.pendingHint')}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  applyForm: {
    gap: 10,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 13,
    minHeight: 54,
    padding: 0,
    textAlignVertical: 'top',
  },
  inputShell: {
    alignItems: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  messageBubble: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    maxWidth: '86%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messages: {
    gap: 8,
    marginTop: 12,
  },
  reasonChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  waitingBox: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    minHeight: 40,
    paddingHorizontal: 10,
  },
});
