export function decodeString(s: string): string {
  if (s.startsWith("0x")) {
    return Buffer.from(s.slice(2), "hex")
      .toString()
      .replace(/\0/g, "");
  } else {
    return s
  }
}
