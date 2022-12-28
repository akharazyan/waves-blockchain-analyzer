import type { Long } from '@grpc/proto-loader';

export type Transfer = { from: string; to: string; amount: number };

export interface StateData {
    key: string;
    type: 'string' | 'integer' | 'boolean';
    value: string | number | boolean | Long;
}

interface Amount {
    assetId: string | null;
    amount: number | string | Long;
}

export type InvokeArgument = boolean | number | string | Long | Buffer | Uint8Array | InvokeArgument[];

export interface SubCall {
    functionName: string;
    dApp: string;
    args: InvokeArgument[];
    payments: Amount[];
}

export interface InvokeMethod {
    functionName: string;
    dApp: string;
    args: InvokeArgument[];
    payments: Amount[];
    subCalls: SubCall[];
}

export interface AssetDetails {
    assetId: string;
    nft: boolean;
    name: string;
    decimals: number;
    description: string;
    issuer: string;
    lastUpdatedHeight: number;
    volume: number;
}

export interface AssetStateUpdate {
    after: AssetDetails | null;
    before: AssetDetails | null;
}

export interface BalanceUpdate {
    address: string;
    assetId: string;
    after: number;
    before: number;
}

export interface DataEntryUpdate {
    address: string;
    key: string;
    value: string | Buffer | null;
    oldValue: string | Buffer | null;
}

export interface ParsedStateUpdate {
    assets: AssetStateUpdate[];
    balances: BalanceUpdate[];
    dataEntries: DataEntryUpdate[];
}

export interface Token {
    assetId: string;
    name: string;
    decimals: number;
}

export interface ITokensTransfers {
    fromAddress(address: string): string[];
    toAddress(address: string): string[];
    transferExists(transfer: { toAddress: string }): boolean;
    all(): Array<{ asset: string; from: string; to: string }>;
    eachAsset(fn: (assetId: string, transfer: Transfer) => void | Promise<void>): Promise<void>;
    getTransferredNftIds(name: string): string[];
}

export interface ParsedTransaction {
    id: string;
    height: number;
    timestamp?: Date;
    invokeMethod?: InvokeMethod;
    stateUpdates: ParsedStateUpdate;
    //    tokensTransfers: ITokensTransfers;
}
