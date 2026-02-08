import { HttpRequestTransfer } from "../../types/types_transfer";
import { importParsers, ImportParserType } from "./types";

export function suitsAuto(): boolean {
    return false
}

export function parseAuto(input: string): HttpRequestTransfer[] {
    const suitableTypes = (Object.keys(importParsers) as ImportParserType[])
        .filter(type => importParsers[type].suits(input))

    if (suitableTypes.length !== 1) {
        throw new Error('Suiting parser not found or ambiguous');
    }

    return importParsers[suitableTypes[0]].parse(input)
}