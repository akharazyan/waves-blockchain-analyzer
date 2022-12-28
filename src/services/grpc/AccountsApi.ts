import bs58 from 'bs58';
import * as grpc from '@grpc/grpc-js';

import type { DataEntryResponse } from '../../types/proto/waves/node/grpc/DataEntryResponse';
import type { AccountsApiClient } from '../../types/proto/waves/node/grpc/AccountsApi';
import type { IDataStateApi, ProtoGrpcType, StateData } from '../../types';
import { valueFromDataEntry } from '../../domain/converters';
import { getProtosInFolder } from '../../utils/proto-loader';
import { log } from '../logger';
import loadProto, { PROTOS_FOLDER } from './loader';

const HOST = 'grpc.wavesnodes.com:6870';
const ClientApi = loadProto<ProtoGrpcType>(getProtosInFolder(PROTOS_FOLDER)).waves.node.grpc.AccountsApi;

class AccountsApi implements IDataStateApi {
    protected status: 'INITIAL' | 'CONNECTED' | 'RUNNING' | 'PAUSED' | 'STOPPED' = 'INITIAL';
    protected client: AccountsApiClient;

    connect() {
        this.client = new ClientApi(HOST, grpc.credentials.createInsecure());
        this.status = 'CONNECTED';
    }

    getStatus() {
        return this.status;
    }

    async fetchState(address: string): Promise<StateData[]> {
        if (this.status === 'INITIAL') {
            await this.connect();
        }

        return new Promise((resolve, reject) => {
            const data: StateData[] = [];

            try {
                const stream = this.client.getDataEntries({ address: bs58.decode(address) });

                stream.on('data', (item: DataEntryResponse) => {
                    this.status = 'RUNNING';
                    data.push({
                        key: item.entry.key,
                        ...valueFromDataEntry(item.entry),
                    });
                });
                stream.on('end', () => {
                    this.status = 'CONNECTED';
                    resolve(data);
                });
                stream.on('error', (e) => {
                    log('[ERROR][ACCOUNTS API SYNC]', e);
                    this.status = 'PAUSED';
                    reject(e);
                });
            } catch (e) {
                this.status = 'STOPPED';
                reject(e);
            }
        });
    }
}

export default AccountsApi;
