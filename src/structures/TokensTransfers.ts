import type { BalanceUpdate, Transfer, ITokensTransfers } from '../types';

const emptyTransfer: Transfer = { from: '', to: '', amount: 0 };

class TokensTransfers implements ITokensTransfers {
    protected from: Record<string, string[]> = {};

    protected to: Record<string, string[]> = {};

    protected assetsRecord: Record<string, Transfer> = {};

    constructor(balanceUpdates: BalanceUpdate[]) {
        for (const update of balanceUpdates) {
            const { assetId, address, after, before } = update;

            if (after == 0 && before == 1) {
                this.from[address] = [...(this.from[address] ?? []), assetId];
                if (this.assetsRecord[assetId]?.from) {
                    continue;
                }
                this.assetsRecord[assetId] = { ...emptyTransfer, ...(this.assetsRecord[assetId] ?? {}), from: address };
            }
            if (after == 1 && before == 0) {
                this.to[address] = [...(this.to[address] ?? []), assetId];
                this.assetsRecord[assetId] = { ...emptyTransfer, ...(this.assetsRecord[assetId] ?? {}), to: address };
            }
        }
    }

    fromAddress(address: string): string[] {
        return this.from[address] ?? [];
    }

    toAddress(address: string): string[] {
        return this.to[address] ?? [];
    }

    getTransferredNftIds(name: string): string[] {
        return Object.keys(this.to).map((address) => 'localCache.getNftByName(name, address)');
    }

    transferExists(transfer: { toAddress: string }): boolean {
        return this.toAddress(transfer.toAddress).length !== 0;
    }

    all(): Array<{ asset: string; from: string; to: string }> {
        return Object.entries(this.assetsRecord).map(([asset, { from, to }]) => ({ asset, from, to }));
    }

    async eachAsset(fn: (assetId: string, transfer: Transfer) => Promise<void> | void): Promise<void> {
        const entries = Object.entries(this.assetsRecord);

        for (const [assetId, transfer] of entries) {
            await fn(assetId, transfer);
        }
    }

    toString(): string {
        return JSON.stringify(this.assetsRecord, null, 2);
    }
}

export default TokensTransfers;
