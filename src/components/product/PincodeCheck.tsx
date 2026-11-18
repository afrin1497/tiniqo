import { MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDays, checkPincode, type PincodeResult } from "@/lib/delivery";

export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<PincodeResult | null>(null);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(checkPincode(pin));
  };
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <label htmlFor="pincode" className="sr-only">Delivery pincode</label>
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="pincode"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter pincode"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <Button type="submit" variant="outline">Check</Button>
      </form>
      <div aria-live="polite" className="mt-2 text-sm">
        {result && !result.valid && <p className="text-destructive">Please enter a valid 6-digit pincode.</p>}
        {result?.valid && (
          <ul className="space-y-1">
            <li className="text-foreground">
              Delivery by <strong>{fmt(addDays(new Date(), result.minDays))} – {fmt(addDays(new Date(), result.maxDays))}</strong>
            </li>
            <li className={result.codAvailable ? "text-success" : "text-muted-foreground"}>
              {result.codAvailable ? "✓ Cash on Delivery available" : "Cash on Delivery not available — prepaid only"}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
