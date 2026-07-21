import { EmptyFunction } from "./types.ts";

export const AUTHOR_MESSAGE_COLOR = "#CC00CC"
export const RESPONSE_MESSAGE_COLOR = "#FFAA00"

export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

export function newEmptyFunction(): EmptyFunction {
    return () => { };
}