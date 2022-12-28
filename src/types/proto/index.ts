import type { GrpcObject } from '@grpc/grpc-js';

import type { ProtoGrpcType as BUProtoGrpcType } from './blockchain_updates';
import type { ProtoGrpcType as AAProtoGrpcType } from './accounts_api';

export type ProtoGrpcType = GrpcObject & BUProtoGrpcType & AAProtoGrpcType;
