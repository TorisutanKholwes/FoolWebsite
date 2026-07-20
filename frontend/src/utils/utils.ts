import { EmptyFunction } from "./types.ts";

export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

export function newEmptyFunction(): EmptyFunction {
    return () => { };
}