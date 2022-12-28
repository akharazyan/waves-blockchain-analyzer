type IndexedDataValue<T> = Map<string, IndexedRecord<T>>;
type IndexedData<T> = Map<string, IndexedDataValue<T>>;
type IndexedRecord<T> = { value: Set<T>; keys: IndexedData<T> };

class IndexedSet<T extends Record<string, any>> {
    protected index: IndexedRecord<T> = { value: new Set(), keys: new Map() };

    protected static addEntry<T extends Record<string, any>, Index extends IndexedData<T>>(
        index: Index,
        entry: T,
        prev: Partial<T> = {},
    ): Index {
        const props = Object.getOwnPropertyNames(entry).filter((prop) => !(prop in prev));

        const isNotCorrect = Object.entries(prev).some(([key, value]) => entry[key] !== value);
        if (isNotCorrect) {
            return;
        }

        props.forEach((prop) => {
            const value = entry[prop];
            const map: IndexedDataValue<T> = index.get(prop) ?? new Map();
            const obj: IndexedRecord<T> = map.get(value) ?? { value: new Set(), keys: new Map() };
            const keysMap: IndexedData<T> = obj['keys'] ?? new Map();
            const set = obj['value'] ?? new Set<T>();

            index.set(
                prop,
                map.set(value, {
                    value: set.add(entry),
                    keys: IndexedSet.addEntry(keysMap, entry, { ...prev, [prop]: value }),
                }),
            );
        });

        return index;
    }

    protected static removeEntry<T extends Record<string, any>, Index extends IndexedRecord<T>>(
        index: Index,
        query: Partial<T>,
    ): Index {
        index.value.forEach((entry) => {
            const isNotSuitable = Object.entries(query).some(([key, value]) => entry[key] !== value);
            if (isNotSuitable) {
                return;
            }
            index.value.delete(entry);
        });
        index.keys.forEach((map, prop) => {
            const value = query[prop];

            map.delete(value);
            map.forEach((record) => {
                IndexedSet.removeEntry(record, query);
            });
        });

        return index;
    }

    constructor(data: T[] = []) {
        this.index.value = new Set(data);
        data.forEach((entry) => IndexedSet.addEntry(this.index.keys, entry));
    }

    get size() {
        return this.index.value.size;
    }

    add(entry: T): this {
        IndexedSet.addEntry(this.index.keys, entry);
        return this;
    }

    has(query: Partial<T>): boolean {
        const set = Object.entries(query).reduce(
            (index, [key, value]): IndexedRecord<T> => index?.keys?.get(key)?.get(value),
            this.index,
        )?.value;

        return set != null && set.size > 0;
    }

    get(query: Partial<T>): Set<T> | undefined {
        return Object.entries(query).reduce(
            (index, [key, value]): IndexedRecord<T> => index?.keys?.get(key)?.get(value),
            this.index,
        )?.value;
    }

    delete(query: Partial<T>): this {
        IndexedSet.removeEntry(this.index, query);

        return this;
    }

    clear(): this {
        this.index = { value: new Set(), keys: new Map() };
        return this;
    }

    forEach(callback: (value: T) => void): void {
        this.index.value.forEach((value) => callback(value));
    }

    values() {
        return [...this.index.value.values()];
    }

    entries() {
        return [...this.index.value.entries()];
    }

    keys() {
        return [...this.index.value.keys()];
    }
}

export default IndexedSet;
