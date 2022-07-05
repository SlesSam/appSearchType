// To parse this data:
//
//   import { Convert } from "./file";
//
//   const tvShows = Convert.toTvShows(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TvShows {
    id:             number;
    url:            string;
    name:           string;
    type:           Type;
    language:       Language;
    genres:         Genre[];
    status:         Status;
    runtime:        number | null;
    averageRuntime: number;
    premiered:      Date;
    ended:          Date | null;
    officialSite:   null | string;
    schedule:       Schedule;
    rating:         Rating;
    weight:         number;
    network:        Network | null;
    webChannel:     Network | null;
    dvdCountry:     Country | null;
    externals:      Externals;
    image:          Image;
    summary:        string;
    updated:        number;
    _links:         Links;
}

export interface Links {
    self:            Nextepisode;
    previousepisode: Nextepisode;
    nextepisode?:    Nextepisode;
}

export interface Nextepisode {
    href: string;
}

export interface Country {
    name:     Name;
    code:     Code;
    timezone: Timezone;
}

export enum Code {
    CA = "CA",
    De = "DE",
    Fr = "FR",
    GB = "GB",
    Jp = "JP",
    Us = "US",
}

export enum Name {
    Canada = "Canada",
    France = "France",
    Germany = "Germany",
    Japan = "Japan",
    UnitedKingdom = "United Kingdom",
    UnitedStates = "United States",
}

export enum Timezone {
    AmericaHalifax = "America/Halifax",
    AmericaNewYork = "America/New_York",
    AsiaTokyo = "Asia/Tokyo",
    EuropeBusingen = "Europe/Busingen",
    EuropeLondon = "Europe/London",
    EuropeParis = "Europe/Paris",
}

export interface Externals {
    tvrage:  number;
    thetvdb: number | null;
    imdb:    null | string;
}

export enum Genre {
    Action = "Action",
    Adventure = "Adventure",
    Anime = "Anime",
    Comedy = "Comedy",
    Crime = "Crime",
    Drama = "Drama",
    Espionage = "Espionage",
    Family = "Family",
    Fantasy = "Fantasy",
    History = "History",
    Horror = "Horror",
    Legal = "Legal",
    Medical = "Medical",
    Music = "Music",
    Mystery = "Mystery",
    Romance = "Romance",
    ScienceFiction = "Science-Fiction",
    Sports = "Sports",
    Supernatural = "Supernatural",
    Thriller = "Thriller",
    War = "War",
    Western = "Western",
}

export interface Image {
    medium:   string;
    original: string;
}

export enum Language {
    English = "English",
    Japanese = "Japanese",
}

export interface Network {
    id:           number;
    name:         string;
    country:      Country | null;
    officialSite: null | string;
}

export interface Rating {
    average: number | null;
}

export interface Schedule {
    time: Time;
    days: Day[];
}

export enum Day {
    Friday = "Friday",
    Monday = "Monday",
    Saturday = "Saturday",
    Sunday = "Sunday",
    Thursday = "Thursday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
}

export enum Time {
    Empty = "",
    The0900 = "09:00",
    The1200 = "12:00",
    The1300 = "13:00",
    The2000 = "20:00",
    The2030 = "20:30",
    The2100 = "21:00",
    The2130 = "21:30",
    The2200 = "22:00",
    The2230 = "22:30",
    The2300 = "23:00",
    The2330 = "23:30",
}

export enum Status {
    Ended = "Ended",
    Running = "Running",
}

export enum Type {
    Animation = "Animation",
    Documentary = "Documentary",
    Reality = "Reality",
    Scripted = "Scripted",
    TalkShow = "Talk Show",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTvShows(json: string): TvShows[] {
        return cast(JSON.parse(json), a(r("TvShows")));
    }

    public static tvShowsToJson(value: TvShows[]): string {
        return JSON.stringify(uncast(value, a(r("TvShows"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "TvShows": o([
        { json: "id", js: "id", typ: 0 },
        { json: "url", js: "url", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
        { json: "language", js: "language", typ: r("Language") },
        { json: "genres", js: "genres", typ: a(r("Genre")) },
        { json: "status", js: "status", typ: r("Status") },
        { json: "runtime", js: "runtime", typ: u(0, null) },
        { json: "averageRuntime", js: "averageRuntime", typ: 0 },
        { json: "premiered", js: "premiered", typ: Date },
        { json: "ended", js: "ended", typ: u(Date, null) },
        { json: "officialSite", js: "officialSite", typ: u(null, "") },
        { json: "schedule", js: "schedule", typ: r("Schedule") },
        { json: "rating", js: "rating", typ: r("Rating") },
        { json: "weight", js: "weight", typ: 0 },
        { json: "network", js: "network", typ: u(r("Network"), null) },
        { json: "webChannel", js: "webChannel", typ: u(r("Network"), null) },
        { json: "dvdCountry", js: "dvdCountry", typ: u(r("Country"), null) },
        { json: "externals", js: "externals", typ: r("Externals") },
        { json: "image", js: "image", typ: r("Image") },
        { json: "summary", js: "summary", typ: "" },
        { json: "updated", js: "updated", typ: 0 },
        { json: "_links", js: "_links", typ: r("Links") },
    ], false),
    "Links": o([
        { json: "self", js: "self", typ: r("Nextepisode") },
        { json: "previousepisode", js: "previousepisode", typ: r("Nextepisode") },
        { json: "nextepisode", js: "nextepisode", typ: u(undefined, r("Nextepisode")) },
    ], false),
    "Nextepisode": o([
        { json: "href", js: "href", typ: "" },
    ], false),
    "Country": o([
        { json: "name", js: "name", typ: r("Name") },
        { json: "code", js: "code", typ: r("Code") },
        { json: "timezone", js: "timezone", typ: r("Timezone") },
    ], false),
    "Externals": o([
        { json: "tvrage", js: "tvrage", typ: 0 },
        { json: "thetvdb", js: "thetvdb", typ: u(0, null) },
        { json: "imdb", js: "imdb", typ: u(null, "") },
    ], false),
    "Image": o([
        { json: "medium", js: "medium", typ: "" },
        { json: "original", js: "original", typ: "" },
    ], false),
    "Network": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "country", js: "country", typ: u(r("Country"), null) },
        { json: "officialSite", js: "officialSite", typ: u(null, "") },
    ], false),
    "Rating": o([
        { json: "average", js: "average", typ: u(3.14, null) },
    ], false),
    "Schedule": o([
        { json: "time", js: "time", typ: r("Time") },
        { json: "days", js: "days", typ: a(r("Day")) },
    ], false),
    "Code": [
        "CA",
        "DE",
        "FR",
        "GB",
        "JP",
        "US",
    ],
    "Name": [
        "Canada",
        "France",
        "Germany",
        "Japan",
        "United Kingdom",
        "United States",
    ],
    "Timezone": [
        "America/Halifax",
        "America/New_York",
        "Asia/Tokyo",
        "Europe/Busingen",
        "Europe/London",
        "Europe/Paris",
    ],
    "Genre": [
        "Action",
        "Adventure",
        "Anime",
        "Comedy",
        "Crime",
        "Drama",
        "Espionage",
        "Family",
        "Fantasy",
        "History",
        "Horror",
        "Legal",
        "Medical",
        "Music",
        "Mystery",
        "Romance",
        "Science-Fiction",
        "Sports",
        "Supernatural",
        "Thriller",
        "War",
        "Western",
    ],
    "Language": [
        "English",
        "Japanese",
    ],
    "Day": [
        "Friday",
        "Monday",
        "Saturday",
        "Sunday",
        "Thursday",
        "Tuesday",
        "Wednesday",
    ],
    "Time": [
        "",
        "09:00",
        "12:00",
        "13:00",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
    ],
    "Status": [
        "Ended",
        "Running",
    ],
    "Type": [
        "Animation",
        "Documentary",
        "Reality",
        "Scripted",
        "Talk Show",
    ],
};
