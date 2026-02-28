
export function parseList(items: string[], allAvailable: string[]): string[] {
  if (!items || items.length === 0) {
    return [];
  }

  const allow = items.filter((i) => !i.startsWith("!"));
  const deny = items.filter((i) => i.startsWith("!")).map((i) => i.slice(1));

  if (deny.includes("*")) {
    return [];
  }

  let result: string[];
  if (allow.includes("*")) {
    result = allAvailable.filter((item) => !deny.includes(item));
  } else {
    result = allow.filter((item) => !deny.includes(item) && allAvailable.includes(item));
  }

  return [...new Set(result)];
}
