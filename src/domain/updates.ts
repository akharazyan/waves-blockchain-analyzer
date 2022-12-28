import type { InvokeMethod, DataEntryUpdate, ParsedTransaction } from '../types';

type Prop = { regexp: RegExp; getKey: (entry: DataEntryUpdate | undefined) => string };

const DEFAULT_INVOKE = { dApp: '', subCalls: [], functionName: '', args: [], payments: [] };

export const checkScriptInvocation = (invokeScript: InvokeMethod = DEFAULT_INVOKE) => {
    return (...dApps: string[]) => {
        const hasDesiredDapp = ({ dApp }: { dApp: string }): boolean => dApps.includes(dApp);

        return {
            methods: (...functions: string[]): boolean => {
                const hasDesiredInvocation = ({
                    dApp,
                    functionName,
                }: {
                    dApp: string;
                    functionName: string;
                }): boolean => hasDesiredDapp({ dApp }) && functions.some((func) => func === functionName);

                return hasDesiredInvocation(invokeScript) || invokeScript.subCalls.some(hasDesiredInvocation);
            },
            valueOf: () => hasDesiredDapp(invokeScript) || invokeScript.subCalls.some(hasDesiredDapp),
        };
    };
};

export const processUpdates = async <K extends string>(
    transaction: ParsedTransaction,
    props: Record<K, Prop>,
    processor: (key: string, update: Record<K, any>) => Promise<any>,
) => {
    const updates = transaction.stateUpdates.dataEntries.reduce((res, entry) => {
        const found = Object.entries(props).find(([, { regexp }]: [K, Prop]) => regexp.test(entry.key));

        if (!found) {
            return res;
        }
        const [prop, { getKey }] = found as [K, Prop];
        const key = getKey(entry);

        if (!(key in res)) {
            res[key] = {};
        }
        res[key][prop] = entry.value;

        return res;
    }, {});

    for (const key in updates) {
        await processor(key, updates[key]);
    }
};
