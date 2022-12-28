import type { AssetDetails, AssetStateUpdate, ParsedTransaction } from '../types';

export const getNftType = (name: string) => {
    if (name.startsWith('DUCK-MANTLE')) {
        return 'MANTLE';
    }
    if (name.startsWith('ACCESS')) {
        return 'ACCESS';
    }
    if (name.startsWith('DUCK')) {
        return 'DUCK';
    }
    if (name.startsWith('BABY')) {
        return 'DUCKLING';
    }
    if (name.startsWith('ART')) {
        return 'ARTEFACT';
    }
};

export const hasNewAsset = ({ before, after }: AssetStateUpdate) =>
    before == null &&
    after.nft === true &&
    (after.name.startsWith('DUCK-') ||
        after.name.startsWith('ART-') ||
        after.name.startsWith('ACCESS-') ||
        after.name.startsWith('BABY-'));

export const hasAssetBurn = ({ before, after }: AssetStateUpdate) =>
    before?.volume == 1 &&
    after?.volume == 0 &&
    after.nft === true &&
    (after.name.startsWith('DUCK-') ||
        after.name.startsWith('ART-') ||
        after.name.startsWith('ACCESS-') ||
        after.name.startsWith('BABY-'));

export const getChangedAsset = (assetStateUpdate: AssetStateUpdate): AssetDetails => assetStateUpdate.after;

export const getIssuedAssets = (transaction: ParsedTransaction) => {
    return transaction.stateUpdates.assets.filter(hasNewAsset).map(getChangedAsset);
};
