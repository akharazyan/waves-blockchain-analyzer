import type { Long } from '@grpc/proto-loader';
import { base58Encode } from '@waves/ts-lib-crypto';

import type { StateUpdate } from '../types/proto/waves/events/StateUpdate';
import type { TransactionMetadata } from '../types/proto/waves/events/TransactionMetadata';
import type { _waves_DataTransactionData_DataEntry } from '../types/proto/waves/DataTransactionData';
import type { _waves_InvokeScriptResult_Call_Argument } from '../types/proto/waves/InvokeScriptResult';
import {
    _waves_events_StateUpdate_AssetDetails,
    _waves_events_StateUpdate_BalanceUpdate,
    _waves_events_StateUpdate_DataEntryUpdate,
} from '../types/proto/waves/events/StateUpdate';
import type {
    AssetDetails,
    BalanceUpdate,
    DataEntryUpdate,
    InvokeArgument,
    InvokeMethod,
    ParsedStateUpdate,
    ParsedTransaction,
    SubCall,
    Token,
} from '../types';
import TokensTransfers from '../structures/TokensTransfers';
import { BlockchainUpdated } from '../types/proto/waves/events/BlockchainUpdated';
import { InvokeScriptResult } from '../types/proto/waves/InvokeScriptResult';

export const valueFromDataEntry = (
    kv: _waves_DataTransactionData_DataEntry,
): {
    value: string | number | Long | boolean;
    type: 'string' | 'boolean' | 'integer';
} => {
    if (kv.value === 'int_value') {
        return {
            type: 'integer',
            value: typeof kv.int_value === 'string' ? parseInt(kv.int_value) : kv.int_value,
        };
    }
    if (kv.value === 'bool_value') {
        return {
            type: 'boolean',
            value: kv.bool_value,
        };
    }
    if (kv.value === 'string_value') {
        return {
            type: 'string',
            value: kv.string_value,
        };
    }

    return {
        value: kv.binary_value.toString(),
        type: 'string',
    };
};

export const getNumberValue = (entry: DataEntryUpdate): number | undefined => (entry ? Number(entry.value) : undefined);

const convertAssetId = (assetId?: Buffer | Uint8Array | string | null) =>
    !assetId || assetId.length === 0 ? null : base58Encode(assetId);

const convertArgument = (arg: _waves_InvokeScriptResult_Call_Argument): InvokeArgument => {
    if (arg.value === 'list') {
        return arg.list.items.map(convertArgument);
    }
    if (arg.value === 'integer_value') {
        return parseInt(arg.integer_value.toString());
    }

    return arg[arg.value];
};

const getSubCalls = (invokeScriptResult: InvokeScriptResult): SubCall[] => {
    return (
        invokeScriptResult.invokes?.reduce((result, { dApp, payments, call, stateChanges }) => {
            result.push({
                dApp: base58Encode(dApp),
                functionName: call.function,
                payments: payments.map(({ amount, asset_id }) => ({ assetId: convertAssetId(asset_id), amount })),
                args: call.args.map(convertArgument),
            });
            result.push(...getSubCalls(stateChanges));

            return result;
        }, []) ?? []
    );
};

const convertInvoke = (meta: TransactionMetadata): InvokeMethod | undefined => {
    const { invoke_script, metadata } = meta;

    if (metadata !== 'invoke_script') {
        return;
    }

    const { payments, result } = invoke_script;

    return {
        dApp: base58Encode(invoke_script.d_app_address),
        functionName: invoke_script.function_name,
        payments: payments.map(({ amount, asset_id }) => ({ assetId: convertAssetId(asset_id), amount })),
        args: invoke_script.arguments.map(convertArgument),
        subCalls: getSubCalls(result),
    };
};

const convertAssetDetails = (assetDetails: _waves_events_StateUpdate_AssetDetails | null): AssetDetails => {
    if (assetDetails == null) {
        return null;
    }

    return {
        assetId: convertAssetId(assetDetails.asset_id),
        nft: assetDetails.nft,
        name: assetDetails.name,
        decimals: assetDetails.decimals,
        description: assetDetails.description,
        issuer: base58Encode(assetDetails.issuer),
        lastUpdatedHeight: assetDetails.last_updated,
        volume: Number(assetDetails.volume),
    };
};

const convertBalanceUpdate = (balanceUpdate: _waves_events_StateUpdate_BalanceUpdate): BalanceUpdate => ({
    address: base58Encode(balanceUpdate.address),
    assetId: convertAssetId(balanceUpdate.amount_after?.asset_id ?? ''),
    after: Number(balanceUpdate.amount_after?.amount),
    before: Number(balanceUpdate.amount_before),
});

const convertDataEntryUpdate = (dataEntryUpdate: _waves_events_StateUpdate_DataEntryUpdate): DataEntryUpdate => ({
    address: base58Encode(dataEntryUpdate.address),
    key: dataEntryUpdate.data_entry.key,
    value: (dataEntryUpdate.data_entry[dataEntryUpdate.data_entry.value] as string) ?? null,
    oldValue: (dataEntryUpdate.data_entry_before[dataEntryUpdate.data_entry_before.value] as string) ?? null,
});

const convertStateUpdate = (stateUpdate: StateUpdate): ParsedStateUpdate => ({
    assets: stateUpdate.assets.map(({ after, before }) => ({
        after: convertAssetDetails(after),
        before: convertAssetDetails(before),
    })),
    balances: stateUpdate.balances.map(convertBalanceUpdate),
    dataEntries: stateUpdate.data_entries.map(convertDataEntryUpdate),
});

const getTransactionTimestamp = (event: BlockchainUpdated, transactionIndex: number): number => {
    const { body, block, micro_block } = event.append;

    if (body === 'micro_block') {
        return parseInt(
            micro_block.micro_block.micro_block.transactions[transactionIndex].waves_transaction.timestamp.toString(),
        );
    }

    return parseInt(block.block.transactions[transactionIndex].waves_transaction.timestamp.toString());
};

export const convertTransactions = (
    event: BlockchainUpdated,
): { transactions: ParsedTransaction[]; tokens: Record<string, Token> } => {
    const { append: update, height, referenced_assets } = event;

    const tokens = referenced_assets.reduce((res: Record<string, Token>, { id, name, decimals }) => {
        const assetId = base58Encode(id);
        res[assetId] = {
            assetId,
            name,
            decimals,
        };

        return res;
    }, {});

    const transactions = update.transaction_ids.map((transaction_id, i) => {
        const id = base58Encode(transaction_id);
        const { metadata: txType } = update.transactions_metadata[i];

        if (['ethereum', 'lease'].includes(txType)) {
            return {
                id,
                //                nftsTransfers: new TokensTransfers([]),
                stateUpdates: {
                    assets: [],
                    balances: [],
                    dataEntries: [],
                },
                height,
            };
        }

        const timestamp = new Date(getTransactionTimestamp(event, i));
        const stateUpdates = convertStateUpdate(update.transaction_state_updates[i]);

        if (['mass_transfer', 'exchange'].includes(txType)) {
            return {
                id,
                //                nftsTransfers: new TokensTransfers([]),
                stateUpdates,
                timestamp,
                height,
            };
        }

        return {
            id,
            invokeMethod: convertInvoke(update.transactions_metadata[i]),
            //            nftsTransfers: new TokensTransfers(stateUpdates.balances),
            stateUpdates,
            timestamp,
            height,
        };
    });

    return {
        transactions,
        tokens,
    };
};
