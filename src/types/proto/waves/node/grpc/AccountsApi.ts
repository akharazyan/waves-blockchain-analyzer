// Original file: node_modules/@waves/protobuf-serialization/proto/waves/node/grpc/accounts_api.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
    AccountRequest as _waves_node_grpc_AccountRequest,
    AccountRequest__Output as _waves_node_grpc_AccountRequest__Output,
} from '../../../waves/node/grpc/AccountRequest';
import type {
    BalanceResponse as _waves_node_grpc_BalanceResponse,
    BalanceResponse__Output as _waves_node_grpc_BalanceResponse__Output,
} from '../../../waves/node/grpc/BalanceResponse';
import type {
    BalancesRequest as _waves_node_grpc_BalancesRequest,
    BalancesRequest__Output as _waves_node_grpc_BalancesRequest__Output,
} from '../../../waves/node/grpc/BalancesRequest';
import type {
    BytesValue as _google_protobuf_BytesValue,
    BytesValue__Output as _google_protobuf_BytesValue__Output,
} from '../../../google/protobuf/BytesValue';
import type {
    DataEntryResponse as _waves_node_grpc_DataEntryResponse,
    DataEntryResponse__Output as _waves_node_grpc_DataEntryResponse__Output,
} from '../../../waves/node/grpc/DataEntryResponse';
import type {
    DataRequest as _waves_node_grpc_DataRequest,
    DataRequest__Output as _waves_node_grpc_DataRequest__Output,
} from '../../../waves/node/grpc/DataRequest';
import type {
    LeaseResponse as _waves_node_grpc_LeaseResponse,
    LeaseResponse__Output as _waves_node_grpc_LeaseResponse__Output,
} from '../../../waves/node/grpc/LeaseResponse';
import type {
    ScriptData as _waves_node_grpc_ScriptData,
    ScriptData__Output as _waves_node_grpc_ScriptData__Output,
} from '../../../waves/node/grpc/ScriptData';
import type {
    StringValue as _google_protobuf_StringValue,
    StringValue__Output as _google_protobuf_StringValue__Output,
} from '../../../google/protobuf/StringValue';

export interface AccountsApiClient extends grpc.Client {
    GetActiveLeases(
        argument: _waves_node_grpc_AccountRequest,
        metadata: grpc.Metadata,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_LeaseResponse__Output>;
    GetActiveLeases(
        argument: _waves_node_grpc_AccountRequest,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_LeaseResponse__Output>;
    getActiveLeases(
        argument: _waves_node_grpc_AccountRequest,
        metadata: grpc.Metadata,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_LeaseResponse__Output>;
    getActiveLeases(
        argument: _waves_node_grpc_AccountRequest,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_LeaseResponse__Output>;

    GetBalances(
        argument: _waves_node_grpc_BalancesRequest,
        metadata: grpc.Metadata,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_BalanceResponse__Output>;
    GetBalances(
        argument: _waves_node_grpc_BalancesRequest,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_BalanceResponse__Output>;
    getBalances(
        argument: _waves_node_grpc_BalancesRequest,
        metadata: grpc.Metadata,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_BalanceResponse__Output>;
    getBalances(
        argument: _waves_node_grpc_BalancesRequest,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_BalanceResponse__Output>;

    GetDataEntries(
        argument: _waves_node_grpc_DataRequest,
        metadata: grpc.Metadata,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_DataEntryResponse__Output>;
    GetDataEntries(
        argument: _waves_node_grpc_DataRequest,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_DataEntryResponse__Output>;
    getDataEntries(
        argument: _waves_node_grpc_DataRequest,
        metadata: grpc.Metadata,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_DataEntryResponse__Output>;
    getDataEntries(
        argument: _waves_node_grpc_DataRequest,
        options?: grpc.CallOptions,
    ): grpc.ClientReadableStream<_waves_node_grpc_DataEntryResponse__Output>;

    GetScript(
        argument: _waves_node_grpc_AccountRequest,
        metadata: grpc.Metadata,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;
    GetScript(
        argument: _waves_node_grpc_AccountRequest,
        metadata: grpc.Metadata,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;
    GetScript(
        argument: _waves_node_grpc_AccountRequest,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;
    GetScript(
        argument: _waves_node_grpc_AccountRequest,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;
    getScript(
        argument: _waves_node_grpc_AccountRequest,
        metadata: grpc.Metadata,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;
    getScript(
        argument: _waves_node_grpc_AccountRequest,
        metadata: grpc.Metadata,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;
    getScript(
        argument: _waves_node_grpc_AccountRequest,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;
    getScript(
        argument: _waves_node_grpc_AccountRequest,
        callback: grpc.requestCallback<_waves_node_grpc_ScriptData__Output>,
    ): grpc.ClientUnaryCall;

    ResolveAlias(
        argument: _google_protobuf_StringValue,
        metadata: grpc.Metadata,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
    ResolveAlias(
        argument: _google_protobuf_StringValue,
        metadata: grpc.Metadata,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
    ResolveAlias(
        argument: _google_protobuf_StringValue,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
    ResolveAlias(
        argument: _google_protobuf_StringValue,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
    resolveAlias(
        argument: _google_protobuf_StringValue,
        metadata: grpc.Metadata,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
    resolveAlias(
        argument: _google_protobuf_StringValue,
        metadata: grpc.Metadata,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
    resolveAlias(
        argument: _google_protobuf_StringValue,
        options: grpc.CallOptions,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
    resolveAlias(
        argument: _google_protobuf_StringValue,
        callback: grpc.requestCallback<_google_protobuf_BytesValue__Output>,
    ): grpc.ClientUnaryCall;
}

export interface AccountsApiHandlers extends grpc.UntypedServiceImplementation {
    GetActiveLeases: grpc.handleServerStreamingCall<
        _waves_node_grpc_AccountRequest__Output,
        _waves_node_grpc_LeaseResponse
    >;

    GetBalances: grpc.handleServerStreamingCall<
        _waves_node_grpc_BalancesRequest__Output,
        _waves_node_grpc_BalanceResponse
    >;

    GetDataEntries: grpc.handleServerStreamingCall<
        _waves_node_grpc_DataRequest__Output,
        _waves_node_grpc_DataEntryResponse
    >;

    GetScript: grpc.handleUnaryCall<_waves_node_grpc_AccountRequest__Output, _waves_node_grpc_ScriptData>;

    ResolveAlias: grpc.handleUnaryCall<_google_protobuf_StringValue__Output, _google_protobuf_BytesValue>;
}

export interface AccountsApiDefinition extends grpc.ServiceDefinition {
    GetActiveLeases: MethodDefinition<
        _waves_node_grpc_AccountRequest,
        _waves_node_grpc_LeaseResponse,
        _waves_node_grpc_AccountRequest__Output,
        _waves_node_grpc_LeaseResponse__Output
    >;
    GetBalances: MethodDefinition<
        _waves_node_grpc_BalancesRequest,
        _waves_node_grpc_BalanceResponse,
        _waves_node_grpc_BalancesRequest__Output,
        _waves_node_grpc_BalanceResponse__Output
    >;
    GetDataEntries: MethodDefinition<
        _waves_node_grpc_DataRequest,
        _waves_node_grpc_DataEntryResponse,
        _waves_node_grpc_DataRequest__Output,
        _waves_node_grpc_DataEntryResponse__Output
    >;
    GetScript: MethodDefinition<
        _waves_node_grpc_AccountRequest,
        _waves_node_grpc_ScriptData,
        _waves_node_grpc_AccountRequest__Output,
        _waves_node_grpc_ScriptData__Output
    >;
    ResolveAlias: MethodDefinition<
        _google_protobuf_StringValue,
        _google_protobuf_BytesValue,
        _google_protobuf_StringValue__Output,
        _google_protobuf_BytesValue__Output
    >;
}
