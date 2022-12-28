import { log } from './services/logger';
import { startSync } from './sync';

process.on('unhandledRejection', (reason, p) => {
    // @ts-expect-error auto-switched from ts-ignore
    log('Unhandled Rejection at: Promise', p, 'reason:', reason, 'stack', reason.stack);
});

startSync({ since: 3192441 });
