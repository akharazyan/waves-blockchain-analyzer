import type { StateData } from './data-entries';

export interface IUpdatesListener<S> {
    from(height: number): this;
    to(height: number): this;
    onData(handler: (value: S) => Promise<void>): this;
    start(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    getStatus(): string;
}

export interface IDataStateApi {
    getStatus(): string;
    fetchState(address: string): Promise<StateData[]>;
}
