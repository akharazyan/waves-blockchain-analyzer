import BlockchainUpdatesStreamListener from '../services/grpc/BlockchainUpdatesStreamListener';
import type { BlockchainUpdated } from '../types/proto/waves/events/BlockchainUpdated';
import { convertTransactions } from '../domain/converters';
import { log } from '../services/logger';

const grpcStreamListener = new BlockchainUpdatesStreamListener('MAIN');

let i = 0;

const processUpdate = async (value: BlockchainUpdated): Promise<void> => {
    if (i === 0) {
        log(value.height);
    }
    if (i++ === 100) {
        i = 0;
    }

    if (value.update === 'append') {
        const { transactions, tokens } = convertTransactions(value);
        for (const transaction of transactions) {
            //            if (transaction.id === '7XHFnzXJwXwG2TGKgLR7mSB43D2HC46gazyRxYqd9fk2') {
            //                log({ transaction: transaction.id });
            //            }
        }
    }
};

export const startSync = ({ since, until }: { since: number; until?: number }) => {
    grpcStreamListener.from(since).to(until).onData(processUpdate).start();

    return grpcStreamListener;
};
