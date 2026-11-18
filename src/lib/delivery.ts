export interface PincodeResult {
  valid: boolean;
  serviceable: boolean;
  codAvailable: boolean;
  minDays: number;
  maxDays: number;
}

const METRO_PREFIXES = ["11", "40", "56", "60", "70", "50", "41", "38"];
const NO_COD_PREFIXES = ["19", "79", "18", "74"];

/** Mock pincode check — replace with your courier's API later. */
export function checkPincode(pin: string): PincodeResult {
  const valid = /^[1-9]\d{5}$/.test(pin.trim());
  if (!valid) return { valid: false, serviceable: false, codAvailable: false, minDays: 0, maxDays: 0 };
  const p = pin.trim();
  const metro = METRO_PREFIXES.some((x) => p.startsWith(x));
  return {
    valid: true,
    serviceable: true,
    codAvailable: !NO_COD_PREFIXES.some((x) => p.startsWith(x)),
    minDays: metro ? 2 : 4,
    maxDays: metro ? 4 : 7,
  };
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
