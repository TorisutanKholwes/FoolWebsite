import { CountryData, EmptyFunction, PeriodicElement } from "./types.ts";

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

export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function boring(num: number) {
    const x = getRandomInt(2, 20);
    const y = getRandomInt(2, 10);

    const calculs = [
        `(((${num + x} * ${y}) - (${x} * ${y})) / ${y})`,
        `(((${num * x} + ${x * y}) - ${x * y}) / ${x})`,
        `(((${num + x} ** 2) - (${x} ** 2)) / (${num + x - x}))`,
        `Math.floor((${num * x + y} - ${y}) / ${x})`,
        `(((${num + x} * ${x}) - (${x} * ${x})) / ${x})`,
        `Math.sqrt((${num * num}))`,
        `(((${num + y} * ${x}) - (${y} * ${x})) / ${x})`
    ];

    return calculs[getRandomInt(0, calculs.length - 1)];
}

export async function getCountriesAndPhone() {
    const url = "https://countries.dev/countries"
    const res = await fetch(url);
    const countries: CountryData[] = []
    if (res.ok && res.status === 200) {
        const data = await res.json();
        for (const country of data) {
            if (country.name.includes("(")) {
                continue;
            }
            if (country && country.translations && country.independent && country.translations.ja) {
                countries.push({
                    name: country.name,
                    japaneseName: country.translations.ja
                })
            }
        }
    }
    return countries;
}

export async function getPokemonName(id: number): Promise<string> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url);
    const pokemon = await res.json();
    return pokemon.name;
}

export const COUNTRIES: CountryData[] = await getCountriesAndPhone();

export const PERIODIC_TABLE: PeriodicElement[] = [
    { id: 1, name: "H" },
    { id: 2, name: "He" },
    { id: 3, name: "Li" },
    { id: 4, name: "Be" },
    { id: 5, name: "B" },
    { id: 6, name: "C" },
    { id: 7, name: "N" },
    { id: 8, name: "O" },
    { id: 9, name: "F" },
    { id: 10, name: "Ne" },
    { id: 11, name: "Na" },
    { id: 12, name: "Mg" },
    { id: 13, name: "Al" },
    { id: 14, name: "Si" },
    { id: 15, name: "P" },
    { id: 16, name: "S" },
    { id: 17, name: "Cl" },
    { id: 18, name: "Ar" },
    { id: 19, name: "K" },
    { id: 20, name: "Ca" },
    { id: 21, name: "Sc" },
    { id: 22, name: "Ti" },
    { id: 23, name: "V" },
    { id: 24, name: "Cr" },
    { id: 25, name: "Mn" },
    { id: 26, name: "Fe" },
    { id: 27, name: "Co" },
    { id: 28, name: "Ni" },
    { id: 29, name: "Cu" },
    { id: 30, name: "Zn" },
    { id: 31, name: "Ga" },
    { id: 32, name: "Ge" },
    { id: 33, name: "As" },
    { id: 34, name: "Se" },
    { id: 35, name: "Br" },
    { id: 36, name: "Kr" },
    { id: 37, name: "Rb" },
    { id: 38, name: "Sr" },
    { id: 39, name: "Y" },
    { id: 40, name: "Zr" },
    { id: 41, name: "Nb" },
    { id: 42, name: "Mo" },
    { id: 43, name: "Tc" },
    { id: 44, name: "Ru" },
    { id: 45, name: "Rh" },
    { id: 46, name: "Pd" },
    { id: 47, name: "Ag" },
    { id: 48, name: "Cd" },
    { id: 49, name: "In" },
    { id: 50, name: "Sn" },
    { id: 51, name: "Sb" },
    { id: 52, name: "Te" },
    { id: 53, name: "I" },
    { id: 54, name: "Xe" },
    { id: 55, name: "Cs" },
    { id: 56, name: "Ba" },
    { id: 57, name: "La" },
    { id: 58, name: "Ce" },
    { id: 59, name: "Pr" },
    { id: 60, name: "Nd" },
    { id: 61, name: "Pm" },
    { id: 62, name: "Sm" },
    { id: 63, name: "Eu" },
    { id: 64, name: "Gd" },
    { id: 65, name: "Tb" },
    { id: 66, name: "Dy" },
    { id: 67, name: "Ho" },
    { id: 68, name: "Er" },
    { id: 69, name: "Tm" },
    { id: 70, name: "Yb" },
    { id: 71, name: "Lu" },
    { id: 72, name: "Hf" },
    { id: 73, name: "Ta" },
    { id: 74, name: "W" },
    { id: 75, name: "Re" },
    { id: 76, name: "Os" },
    { id: 77, name: "Ir" },
    { id: 78, name: "Pt" },
    { id: 79, name: "Au" },
    { id: 80, name: "Hg" },
    { id: 81, name: "Tl" },
    { id: 82, name: "Pb" },
    { id: 83, name: "Bi" },
    { id: 84, name: "Po" },
    { id: 85, name: "At" },
    { id: 86, name: "Rn" },
    { id: 87, name: "Fr" },
    { id: 88, name: "Ra" },
    { id: 89, name: "Ac" },
    { id: 90, name: "Th" },
    { id: 91, name: "Pa" },
    { id: 92, name: "U" },
    { id: 93, name: "Np" },
    { id: 94, name: "Pu" },
    { id: 95, name: "Am" },
    { id: 96, name: "Cm" },
    { id: 97, name: "Bk" },
    { id: 98, name: "Cf" },
    { id: 99, name: "Es" },
    { id: 100, name: "Fm" },
    { id: 101, name: "Md" },
    { id: 102, name: "No" },
    { id: 103, name: "Lr" },
    { id: 104, name: "Rf" },
    { id: 105, name: "Db" },
    { id: 106, name: "Sg" },
    { id: 107, name: "Bh" },
    { id: 108, name: "Hs" },
    { id: 109, name: "Mt" },
    { id: 110, name: "Ds" },
    { id: 111, name: "Rg" },
    { id: 112, name: "Cn" },
    { id: 113, name: "Nh" },
    { id: 114, name: "Fl" },
    { id: 115, name: "Mc" },
    { id: 116, name: "Lv" },
    { id: 117, name: "Ts" },
    { id: 118, name: "Og" }
];