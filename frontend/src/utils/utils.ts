import { EmptyFunction } from "./types.ts";

export const AUTHOR_MESSAGE_COLOR = "#CC00CC"
export const RESPONSE_MESSAGE_COLOR = "#FFAA00"

export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

export function newEmptyFunction(): EmptyFunction {
    return () => { };
}

export async function getImageOfMusic(name: string, author: string): Promise<string> {
    const url = `https://musicbrainz.org/ws/2/release?query=artist:"${author}" AND release:"${name}"&fmt=json`
    const res = await fetch(url);
    if (res.ok && res.status === 200) {
        const data = await res.json();
        if (data.count > 0) {
            const id = data.releases[0].id
            return `https://coverartarchive.org/release/${id}/front`
        }
    }
    return ""
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}