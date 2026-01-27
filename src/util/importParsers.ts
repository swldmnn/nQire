import { HttpRequestTransfer } from '../types/types_transfer';

export function parseCurlCommands(input: string): HttpRequestTransfer[] {
  try {
    const lines = input.split('\n');
    const requests: HttpRequestTransfer[] = [];
    let currentCommand = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('curl')) {
        if (currentCommand) {
          requests.push(parseSingleCurlCommand(currentCommand));
        }
        currentCommand = trimmedLine;
      } else {
        currentCommand += ` ${trimmedLine}`;
      }
    }

    if (currentCommand) {
      requests.push(parseSingleCurlCommand(currentCommand));
    }

    if (requests.length === 0) {
      throw new Error('No valid curl commands found.');
    }

    return requests;
  } catch (error) {
    throw new Error(`Failed to parse curl commands: ${error}`);
  }
}

function parseSingleCurlCommand(command: string): HttpRequestTransfer {
  const urlMatch = command.match(/https?:\/\/[^\s'"]+/);
  const methodMatch = command.match(/-X\s+(\w+)/) || command.match(/--request\s+(\w+)/);
  const headerMatches = [...command.matchAll(/-H\s+['"]?([^:]+):\s*([^'"\n]+)['"]?/g)];
  const bodyMatch = command.match(/--data(?:-raw)?\s+['"]?([^'"\n]+)['"]?/);

  if (urlMatch) {
    const headers = headerMatches.map(match => ({
      key: match[1].trim(),
      value: match[2].trim(),
    }));

    return {
      typename: 'HttpRequest',
      label: 'Imported Request',
      id: undefined,
      method: methodMatch ? methodMatch[1].toUpperCase() : 'GET',
      url: urlMatch[0],
      headers,
      body: bodyMatch ? bodyMatch[1] : '',
    };
  } else {
    throw new Error('Invalid curl command: URL not found.');
  }
}