import {BlockchainUpdates} from 'waves-grpc-services-client';

import type { BlockchainUpdated } from '../types/proto/waves/events/BlockchainUpdated';
import { convertTransactions } from '../domain/converters';
import { log } from '../services/logger';


const updatesListenerBuilder = BlockchainUpdates.builder().label('MAIN');

let i = 0;
let start;
let bu;

const processUpdate = async (value: BlockchainUpdated): Promise<void> => {
    if (i++ === 100) {
        i = 1;
    }
    if (i === 1) {
        console.timeLog('sync', value.height);
    }

    if (value.height === 3598714) {
        console.timeEnd('sync');
        console.log('took:', (Date.now() - start) / 1000 / 60, 'min');
        bu.stop();
    }
    return;

    if (value.update === 'append') {
        const { transactions, tokens } = convertTransactions(value);
        for (const index in transactions) {
            const transaction = transactions[index];
            
            
            if (transaction.sender === '3PCzWbccmGJmky2FrMaFc9524YFX1xK3B6V') {
                log({
                    transaction,
                    raw: {
                        meta: value.append.transactions_metadata[index],
                        state: value.append.transaction_state_updates[index],
                    },
                });
            }
            
//            if (transaction.invokeMethod?.functionName === 'finishRebirth') {
//                log({
//                    transaction,
//                    raw: {
//                        meta: value.append.transactions_metadata[index],
//                        state: value.append.transaction_state_updates[index],
//                    },
//                });
//            }
        }
    }
};

export const startSync = async ({ since, until }: { since: number; until?: number }) => {
    start = Date.now();
    console.time('sync');
    bu = updatesListenerBuilder.from(since).to(until).onData(processUpdate).build();
    await bu.start();
};
