export function isObject(value: unknown): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function getAsObject(value: unknown) {
    return isObject(value) ? value as object: {};
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}