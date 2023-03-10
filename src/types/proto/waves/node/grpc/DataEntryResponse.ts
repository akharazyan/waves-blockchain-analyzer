// Original file: node_modules/@waves/protobuf-serialization/proto/waves/node/grpc/accounts_api.proto

import type {
    _waves_DataTransactionData_DataEntry,
    _waves_DataTransactionData_DataEntry__Output,
} from '../../DataTransactionData';

export interface DataEntryResponse {
    address?: Buffer | Uint8Array | string;
    entry?: _waves_DataTransactionData_DataEntry | null;
}

export interface DataEntryResponse__Output {
    address?: Buffer;
    entry?: _waves_DataTransactionData_DataEntry__Output;
}
