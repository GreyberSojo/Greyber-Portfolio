import es from "./es.json";

// Simple translation helper. Only Spanish is provided for now.
export function t(key: string): string {
  const parts = key.split(".");
  let result: any = es as any;
  for (const part of parts) {
    result = result?.[part];
    if (result == null) {
      return key;
    }
  }
  if (Array.isArray(result)) {
    return result.join("");
  }
  return result as string;
}
