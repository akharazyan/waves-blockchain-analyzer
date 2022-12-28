import path from 'path';
import type { IParseOptions, IConversionOptions } from 'protobufjs';
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';

export const PROTOS_FOLDER = path.resolve(require.resolve('@waves/protobuf-serialization'), '../../proto');

const loadProto = <T extends grpc.GrpcObject>(
    path: string | string[],
    options: (IParseOptions & IConversionOptions) | { includeDirs: string[] } = {},
): T => {
    const packageDefinition = protoLoader.loadSync(path, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        ...options,
    });

    return grpc.loadPackageDefinition(packageDefinition) as T;
};

export default loadProto;
