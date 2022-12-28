import fs from 'fs';
import path from 'path';

function* walkSync(dir: string): Generator<string, string | void, string | Generator<string>> {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            yield* walkSync(path.join(dir, file.name));
        } else {
            yield path.join(dir, file.name);
        }
    }
}

function* filter<T>(iter: Iterable<T>, predicate: (item: T) => boolean): Generator<T, T | void, T> {
    for (let i of iter) {
        if (predicate(i) === true) {
            yield i;
        }
    }
}

function protosInSubDir(subDir: string) {
    return filter(walkSync(path.resolve(__dirname, subDir)), (x) => x.endsWith('.proto'));
}

export const getProtosInFolder = (pathToFolder: string): string[] => [...protosInSubDir(pathToFolder)];
