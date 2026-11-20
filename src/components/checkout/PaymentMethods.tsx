import { Banknote, Building2, CreditCard, QrCode, Smartphone, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PaymentDetails, PaymentMethod } from "@/lib/payments";
import { cn } from "@/lib/utils";

const METHODS: { id: PaymentMethod; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "upi", label: "UPI", hint: "Pay with any UPI app", icon: Smartphone },
  { id: "card", label: "Credit / Debit card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Netbanking", hint: "All major Indian banks", icon: Building2 },
  { id: "wallet", label: "Wallets", hint: "GPay, PhonePe, Paytm", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", hint: "Pay when it arrives", icon: Banknote },
];

const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank", "Yes Bank"];
const WALLETS: { id: NonNullable<PaymentDetails["wallet"]>; label: string }[] = [
  { id: "gpay", label: "GPay" },
  { id: "phonepe", label: "PhonePe" },
  { id: "paytm", label: "Paytm" },
];

export type PaymentErrors = Partial<Record<"upiId" | "cardNumber" | "cardName" | "cardExpiry" | "cardCvv" | "bank" | "wallet", string>>;

/** Validates the selected payment method's fields. Empty object = valid. */
export function validatePayment(method: PaymentMethod, d: PaymentDetails): PaymentErrors {
  const e: PaymentErrors = {};
  if (method === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(d.upiId?.trim() ?? "")) e.upiId = "Enter a valid UPI ID, e.g. name@okbank";
  if (method === "card") {
    const c = d.card ?? { number: "", name: "", expiry: "", cvv: "" };
    if (!/^\d{16}$/.test(c.number.replace(/\s/g, ""))) e.cardNumber = "Enter the 16-digit card number";
    if (c.name.trim().length < 2) e.cardName = "Enter the name on the card";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(c.expiry)) e.cardExpiry = "Use MM/YY";
    if (!/^\d{3,4}$/.test(c.cvv)) e.cardCvv = "3 or 4 digits";
  }
  if (method === "netbanking" && !d.bank) e.bank = "Choose your bank";
  if (method === "wallet" && !d.wallet) e.wallet = "Choose a wallet";
  return e;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p id={`${id}-error`} className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function PaymentMethods({
  method,
  onMethodChange,
  details,
  onDetailsChange,
  errors,
  codAvailable,
}: {
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  details: PaymentDetails;
  onDetailsChange: (d: PaymentDetails) => void;
  errors: PaymentErrors;
  /** null = pincode not entered yet */
  codAvailable: boolean | null;
}) {
  const card = details.card ?? { number: "", name: "", expiry: "", cvv: "" };
  const setCard = (patch: Partial<typeof card>) => onDetailsChange({ ...details, card: { ...card, ...patch } });

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Payment method">
      {METHODS.map((m) => {
        const selected = method === m.id;
        const disabled = m.id === "cod" && codAvailable === false;
        return (
          <div key={m.id} className={cn("rounded-xl border bg-card transition-colors", selected ? "border-primary ring-1 ring-primary" : "border-border")}>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onMethodChange(m.id)}
              className="flex w-full items-center gap-3 rounded-xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2", selected ? "border-sage-deep" : "border-border")}>
                {selected && <span className="size-2.5 rounded-full bg-sage-deep" />}
              </span>
              <m.icon className="size-5 text-sage-deep" aria-hidden />
              <span className="flex-1">
                <span className="block font-semibold">{m.label}</span>
                <span className="block text-xs text-muted-foreground">{disabled ? "Not available for this pincode" : m.hint}</span>
              </span>
            </button>

            {selected && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                {m.id === "upi" && (
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <Field id="upi-id" label="UPI ID" error={errors.upiId}>
                      <Input id="upi-id" placeholder="yourname@okbank" value={details.upiId ?? ""} onChange={(e) => onDetailsChange({ ...details, upiId: e.target.value })} aria-invalid={!!errors.upiId} />
                    </Field>
                    <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border bg-secondary/50 p-3 text-center">
                      <QrCode className="size-20 text-sage-deep" aria-hidden />
                      <span className="text-xs text-muted-foreground">Or scan the QR<br />on the next step</span>
                    </div>
                  </div>
                )}
                {m.id === "card" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field id="card-number" label="Card number" error={errors.cardNumber}>
                        <Input id="card-number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" maxLength={19} value={card.number}
                          onChange={(e) => setCard({ number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })} aria-invalid={!!errors.cardNumber} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field id="card-name" label="Name on card" error={errors.cardName}>
                        <Input id="card-name" autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ name: e.target.value })} aria-invalid={!!errors.cardName} />
                      </Field>
                    </div>
                    <Field id="card-expiry" label="Expiry (MM/YY)" error={errors.cardExpiry}>
                      <Input id="card-expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="08/29" maxLength={5} value={card.expiry}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setCard({ expiry: v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v }); }} aria-invalid={!!errors.cardExpiry} />
                    </Field>
                    <Field id="card-cvv" label="CVV" error={errors.cardCvv}>
                      <Input id="card-cvv" type="password" inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={card.cvv} onChange={(e) => setCard({ cvv: e.target.value.replace(/\D/g, "") })} aria-invalid={!!errors.cardCvv} />
                    </Field>
                  </div>
                )}
                {m.id === "netbanking" && (
                  <Field id="bank" label="Choose your bank" error={errors.bank}>
                    <Select value={details.bank ?? ""} onValueChange={(v) => onDetailsChange({ ...details, bank: v })}>
                      <SelectTrigger id="bank" aria-invalid={!!errors.bank}><SelectValue placeholder="Select a bank" /></SelectTrigger>
                      <SelectContent>{BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                )}
                {m.id === "wallet" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Wallet">
                      {WALLETS.map((w) => (
                        <button key={w.id} type="button" role="radio" aria-checked={details.wallet === w.id} onClick={() => onDetailsChange({ ...details, wallet: w.id })}
                          className={cn("rounded-xl border p-3 font-heading font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", details.wallet === w.id ? "border-primary bg-sage-soft text-sage-deep" : "border-border hover:border-primary")}>
                          {w.label}
                        </button>
                      ))}
                    </div>
                    {errors.wallet && <p className="text-xs font-medium text-destructive">{errors.wallet}</p>}
                  </div>
                )}
                {m.id === "cod" && (
                  <p className="text-sm text-muted-foreground">
                    Pay in cash or UPI when your order arrives. COD is available on most pincodes —{" "}
                    {codAvailable === null ? "enter your shipping pincode above to confirm." : "your pincode is eligible."}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
