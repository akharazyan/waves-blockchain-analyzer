import * as grpc from '@grpc/grpc-js';

import type { SubscribeEvent } from '../../types/proto/waves/events/grpc/SubscribeEvent';
import type { GetBlockUpdateResponse } from '../../types/proto/waves/events/grpc/GetBlockUpdateResponse';
import type { BlockchainUpdatesApiClient } from '../../types/proto/waves/events/grpc/BlockchainUpdatesApi';
import type { BlockchainUpdated } from '../../types/proto/waves/events/BlockchainUpdated';
import type { IUpdatesListener, ProtoGrpcType } from '../../types';
import loadProto, { PROTOS_FOLDER } from './loader';
import { sleep } from '../../utils/asyncs';
import { log } from '../logger';

const BLOCKCHAIN_UPDATES_PATH = require.resolve(`${PROTOS_FOLDER}/waves/events/grpc/blockchain_updates.proto`);

const BlockchainUpdatesApi = loadProto<ProtoGrpcType>(BLOCKCHAIN_UPDATES_PATH, { includeDirs: [PROTOS_FOLDER] }).waves
    .events.grpc.BlockchainUpdatesApi;

const LIVENESS_CHECK_INTERVAL = 5 * 60 * 60 * 1000;

class BlockchainUpdatesStreamListener implements IUpdatesListener<BlockchainUpdated> {
    private readonly grpcURI = 'grpc-wavesducks.wavesnodes.com:6881';
    private readonly label: string;
    private queue: BlockchainUpdated[] = [];
    private service: BlockchainUpdatesApiClient;
    private stream: grpc.ClientReadableStream<SubscribeEvent>;
    private lastSeenTimestamp: number;
    private currentHeight: number;
    private toHeight?: number;
    private livenessCheckIntervalId: NodeJS.Timer;
    private status: 'INITIAL' | 'CONNECTED' | 'CONNECTING' | 'RUNNING' | 'PAUSED' | 'STOPPED' = 'INITIAL';
    private onDataHandler: (value: BlockchainUpdated) => Promise<void>;

    private setStatus = (
        status: 'INITIAL' | 'CONNECTED' | 'CONNECTING' | 'RUNNING' | 'PAUSED' | 'STOPPED' = 'INITIAL',
    ) => {
        if (this.status !== status) {
            log(`[${this.label}]`, status);
            this.status = status;
        }
    };

    private run = async (): Promise<void> => {
        if (this.status === 'RUNNING') {
            return;
        }
        this.setStatus('RUNNING');

        return new Promise(async (resolve) => {
            while (true) {
                if (this.status !== 'RUNNING') {
                    return resolve();
                }
                if (this.queue.length === 0) {
                    await sleep(1000);
                    continue;
                }
                const update = this.queue.shift();
                try {
                    await this.onDataHandler(update);
                } catch (e) {
                    log(`[ERROR][HANDLE UPDATE][${this.label}] at height ${this.currentHeight}`, e);
                    this.stop(e);
                    resolve();
                    return this.restart();
                }
            }
        });
    };

    private handleUpdates = (value: GetBlockUpdateResponse) => {
        this.lastSeenTimestamp = Date.now();
        this.startLivenessCheck();
        this.run();

        if (value.update.update === 'append') {
            this.queue.push(value.update);
        }
    };

    private connect() {
        if (this.status === 'CONNECTING') {
            return;
        }
        this.setStatus('CONNECTING');
        this.service = new BlockchainUpdatesApi(this.grpcURI, grpc.credentials.createInsecure(), {
            'grpc.max_receive_message_length': 10000000,
        });
        this.stream = this.service.Subscribe({
            from_height: this.currentHeight,
            to_height: this.toHeight,
        });
        this.stream.once('error', (err) => {
            log(`[ERROR][BU][${this.label}]`, err);
            this.stop(err).restart();
        });

        this.setStatus('CONNECTED');

        if (this.onDataHandler) {
            this.stream.on('data', this.handleUpdates);
        }
    }

    private startLivenessCheck() {
        this.stopLivenessCheck();
        if (this.toHeight) {
            return;
        }
        this.livenessCheckIntervalId = setInterval(() => {
            if (Date.now() - this.lastSeenTimestamp > LIVENESS_CHECK_INTERVAL) {
                this.stop().restart();
            }
        }, LIVENESS_CHECK_INTERVAL);
    }

    private stopLivenessCheck() {
        clearInterval(this.livenessCheckIntervalId);
    }

    constructor(label: string = 'GRPC') {
        this.label = label;
    }

    from(height: number): this {
        this.currentHeight = height;
        return this;
    }

    to(height: number): this {
        this.toHeight = height;
        return this;
    }

    onData(handler: (value: BlockchainUpdated) => Promise<void>): this {
        this.onDataHandler = handler;

        if (this.stream) {
            this.stream.on('data', this.handleUpdates);
        }

        return this;
    }

    start(): this {
        this.connect();

        return this;
    }

    pause(): this {
        this.stopLivenessCheck();
        this.stream.pause();
        this.setStatus('PAUSED');

        return this;
    }

    resume(): this {
        this.startLivenessCheck();
        this.stream.resume();

        return this;
    }

    async restart(): Promise<this> {
        await sleep(4000);
        this.from(this.currentHeight - 3).start();
        this.startLivenessCheck();
        return this;
    }

    stop(error?: Error): this {
        this.stopLivenessCheck();
        this.queue = [];
        this.stream.pause();
        this.stream.destroy(error);
        this.service.close();
        this.setStatus('STOPPED');

        return this;
    }

    getStatus(): string {
        return this.status;
    }
}

export default BlockchainUpdatesStreamListener;
