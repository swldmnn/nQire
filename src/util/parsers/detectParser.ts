import { importExportFormat } from "../../types/types";

export function detectImportFormat(input: string): importExportFormat {
    const isCurl = input.includes('curl ');
    const isHttp = /^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\s+https?:\/\//i.test(input);

    if ([isCurl, isHttp].filter(Boolean).length > 1) {
        throw new Error('Ambiguous import format');
    }

    if (isCurl) {
        return 'curl';
    } else if (isHttp) {
        return 'http';
    } else {
        throw new Error('Unrecognized import format');
    }
}