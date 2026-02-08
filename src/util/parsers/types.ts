import { HttpRequestTransfer } from "../../types/types_transfer";
import { parseAuto, suitsAuto } from "./autoParser";
import { parseCurl, suitsCurl } from "./curlParser";
import { parseHttp, suitsHttp } from "./httpParser";

export type ImportParserSuitability = (input: string) => boolean
export type ImportParser = (input: string) => HttpRequestTransfer[]

export const importParsers = {
    auto: { suits: suitsAuto, parse: parseAuto },
    curl: { suits: suitsCurl, parse: parseCurl },
    http: { suits: suitsHttp, parse: parseHttp },
} satisfies Record<string, { suits: ImportParserSuitability, parse: ImportParser }>

export type ImportParserType = keyof typeof importParsers