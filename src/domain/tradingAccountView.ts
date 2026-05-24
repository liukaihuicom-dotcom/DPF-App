import { buildTradingAccountProfiles, type TradingAccountManagementSettings, type TradingAccountScenario } from './accountProfiles';
import type { Account, Position } from './types';

export function buildSharedTradingAccountProfiles(
  account: Account,
  positions: Position[],
  scenario: TradingAccountScenario,
  management: TradingAccountManagementSettings,
) {
  return buildTradingAccountProfiles(account, positions, scenario, {
    countPreset: management.countPreset === 'scenario' ? 'three' : management.countPreset,
    dataPreset: management.dataPreset === 'scenario' ? 'balanced' : management.dataPreset,
    statusPreset: management.statusPreset === 'scenario' ? 'mixed' : management.statusPreset,
  });
}
