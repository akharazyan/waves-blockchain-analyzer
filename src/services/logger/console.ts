export const log = (...args: any[]) => {
    console.log(`${process.env.pm_id != null ? `[${process.env.pm_id}]` : ''}[${new Date().toISOString()}]`, ...args);
};

export const devLog = (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
        log(...args);
    }
};
