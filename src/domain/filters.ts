import type { BalanceUpdate, DataEntryUpdate } from '../types';

export const getBalanceUpdatesByAsset = (balanceUpdates: BalanceUpdate[], assetId: string): BalanceUpdate[] =>
    balanceUpdates.filter((update) => update.assetId === assetId) ?? null;

export const getNewOwnerOfAsset = (balanceUpdates: BalanceUpdate[], assetId: string): string | null => {
    const balanceUpdate = getBalanceUpdatesByAsset(balanceUpdates, assetId).find(({ before }) => before == 0);

    if (!balanceUpdate) {
        return null;
    }

    return balanceUpdate.address;
};

export const findDataEntryByKey = (key: string, dataEntries: DataEntryUpdate[]): DataEntryUpdate | null => {
    return dataEntries.find((entry) => entry.key === key) ?? null;
};

export const findDataEntryByMatch = (regexp: RegExp, dataEntries: DataEntryUpdate[]): DataEntryUpdate | null => {
    return dataEntries.find((entry) => regexp.test(entry.key)) ?? null;
};

export const findDataEntriesByValue = (value: string, dataEntries: DataEntryUpdate[]): DataEntryUpdate | null => {
    return dataEntries.find((entry) => entry.value === value) ?? null;
};

export const findAllDataEntriesByMatch = (regexp: RegExp, dataEntries: DataEntryUpdate[]): DataEntryUpdate[] => {
    return dataEntries.filter((entry) => regexp.test(entry.key));
};

export const getKeyPart = (part: number) => (entry: DataEntryUpdate | undefined) =>
    (entry?.key.split('_') ?? [])[part - 1];
