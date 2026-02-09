import { assertHttpMethod } from '../../types/types';
import { HttpRequestTransfer } from '../../types/types_transfer';

export function suitsHttp(input: string): boolean {
    if (input.includes('curl ')) {
        return false;
    }

    const httpRequestPattern = /^\s*(###.*\n)?\s*(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\s+https?:\/\//im;
    const hasHttpSeparator = /^###/m.test(input);

    return httpRequestPattern.test(input) || hasHttpSeparator;
}

export function parseHttp(input: string): HttpRequestTransfer[] {
  const requests: HttpRequestTransfer[] = [];
  // Split by ### separator (standard .http file format)
  const blocks = input.split(/^###.*$/m).filter(block => block.trim());

  for (const block of blocks) {
    const lines = block.split('\n');

    // Find the first non-empty, non-comment line (the request line)
    let requestLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed && !trimmed.startsWith('#')) {
        requestLineIndex = i;
        break;
      }
    }

    if (requestLineIndex === -1) continue;

    const requestLine = lines[requestLineIndex].trim();
    let [method, url] = requestLine.split(/\s+/); // First line contains method and URL
    method = method.toUpperCase();
    assertHttpMethod(method);

    if (!method || !url) {
      throw new Error('Invalid HTTP request: Missing method or URL.');
    }

    const headers: { key: string; value: string }[] = [];
    const bodyLines: string[] = [];
    let isBody = false;

    for (let i = requestLineIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip comment lines
      if (trimmedLine.startsWith('#')) continue;

      if (trimmedLine === '') {
        if (!isBody && headers.length > 0) {
          // First empty line after headers marks start of body
          isBody = true;
        }
        continue;
      }

      if (isBody) {
        bodyLines.push(line);
      } else {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          headers.push({ key, value });
        } else {
          throw new Error(`Invalid header format: ${line}`);
        }
      }
    }

    requests.push({
      typename: 'HttpRequest',
      label: 'Imported HTTP Request',
      id: undefined,
      method,
      url,
      headers,
      body: bodyLines.join('\n'),
    });
  }

  if (requests.length === 0) {
    throw new Error('No valid HTTP requests found.');
  }

  return requests;
}