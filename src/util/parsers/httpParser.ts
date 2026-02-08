import { assertHttpMethod } from '../../types/types';
import { HttpRequestTransfer } from '../../types/types_transfer';

export function suitsHttp(input: string): boolean {
    return /^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\s+https?:\/\//i.test(input)
}

export function parseHttp(input: string): HttpRequestTransfer[] {
  const requests: HttpRequestTransfer[] = [];
  const blocks = input.split(/\n{2,}/); // Split by double newlines (separates requests)

  for (const block of blocks) {
    const lines = block.split('\n').map(line => line.trim());
    if (lines.length === 0) continue;

    let [method, url] = lines[0].split(/\s+/); // First line contains method and URL
    method = method.toUpperCase();
    assertHttpMethod(method);

    if (!method || !url) {
      throw new Error('Invalid HTTP request: Missing method or URL.');
    }

    const headers: { key: string; value: string }[] = [];
    let body = '';
    let isBody = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line === '') {
        isBody = true; // Empty line indicates start of body
        continue;
      }

      if (isBody) {
        body += line;
      } else {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          headers.push({ key: key.trim(), value: valueParts.join(':').trim() });
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
      body,
    });
  }

  if (requests.length === 0) {
    throw new Error('No valid HTTP requests found.');
  }

  return requests;
}