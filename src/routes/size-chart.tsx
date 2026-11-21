import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Ruler } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { SizeTable } from "@/components/product/SizeTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sizeCharts, type SizeChartKey } from "@/data/sizeChart";
import { recommendByAge, recommendByChest } from "@/lib/sizing";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/size-chart")({
  head: () => seo({
    title: "Size Chart & How to Measure",
    description: "Find the right Tiniqo size for your child.",
  }),
  component: SizeChartPage,
});

const keys = Object.keys(sizeCharts) as SizeChartKey[];
const selectClass = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function MeasurementFigure({ type }: { type: "Chest" | "Waist" | "Length" }) {
  return (
    <svg viewBox="0 0 160 190" role="img" aria-label={`${type} measurement illustration`} className="mx-auto h-48 w-40 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="3">
      <circle cx="80" cy="27" r="17" />
      <path d="M62 49 42 58 25 98 39 105 53 77 53 119 47 175 65 175 80 128 95 175 113 175 107 119 107 77 121 105 135 98 118 58 98 49Z" strokeLinejoin="round" />
      <g className="text-sage-deep" strokeWidth="4">
        {type === "Chest" && <><path d="M51 77H109" strokeDasharray="5 3" /><path d="m57 71-6 6 6 6m46-12 6 6-6 6" /></>}
        {type === "Waist" && <><path d="M53 111H107" strokeDasharray="5 3" /><path d="m59 105-6 6 6 6m42-12 6 6-6 6" /></>}
        {type === "Length" && <><path d="M145 52V119" strokeDasharray="5 3" /><path d="m139 58 6-6 6 6m-12 55 6 6 6-6M112 52h39M112 119h39" /></>}
      </g>
    </svg>
  );
}

function SizeChartPage() {
  const [garment, setGarment] = useState<SizeChartKey>("frock");
  const [method, setMethod] = useState("age");
  const [years, setYears] = useState("2");
  const [months, setMonths] = useState("0");
  const [chest, setChest] = useState("");
  const rows = sizeCharts[garment].rows;
  const age = Number(years) * 12 + Number(months);
  const measurement = Number(chest);
  const recommendation = method === "age"
    ? recommendByAge(rows, age)
    : recommendByChest(rows, measurement);
  const outsideRange = method === "age"
    ? age < Math.min(...rows.map((row) => row.minMonths)) || age >= Math.max(...rows.map((row) => row.maxMonths))
    : measurement > Math.max(...rows.map((row) => row.chest));

  return (
    <>
      <PageHeader title="Size Chart & How to Measure" description="A comfy fit leaves a little room for growing." crumbs={[{ label: "Size Chart" }]} />
      <main className="container-page space-y-12 py-8">
        <section aria-labelledby="charts-title">
          <h2 id="charts-title" className="mb-4 text-2xl font-bold">Our size charts</h2>
          <p className="mb-5 text-muted-foreground">All measurements are in inches. Use measurements as your main guide; ages are approximate.</p>
          <Tabs value={garment} onValueChange={(value) => setGarment(value as SizeChartKey)}>
            <TabsList className="mb-5 flex h-auto flex-wrap justify-start">
              {keys.map((key) => <TabsTrigger key={key} value={key}>{sizeCharts[key].label}</TabsTrigger>)}
            </TabsList>
            {keys.map((key) => (
              <TabsContent key={key} value={key}>
                <p className="mb-3 text-sm text-muted-foreground">{sizeCharts[key].note}</p>
                <SizeTable rows={sizeCharts[key].rows} highlight={!outsideRange ? recommendation?.row.size : undefined} />
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section aria-labelledby="finder-title" className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
          <h2 id="finder-title" className="flex items-center gap-2 text-2xl font-bold"><Ruler className="size-6 text-sage-deep" aria-hidden /> Find my size</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="finder-garment">Garment type</Label>
                <select id="finder-garment" value={garment} onChange={(event) => setGarment(event.target.value as SizeChartKey)} className={selectClass}>
                  {keys.map((key) => <option key={key} value={key}>{sizeCharts[key].label}</option>)}
                </select>
              </div>
              <fieldset className="space-y-3">
                <legend className="mb-2 text-sm font-medium">Recommend using</legend>
                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2"><input type="radio" name="size-method" value="age" checked={method === "age"} onChange={() => setMethod("age")} /> Child’s age</label>
                  <label className="flex items-center gap-2"><input type="radio" name="size-method" value="chest" checked={method === "chest"} onChange={() => setMethod("chest")} /> Chest measurement</label>
                </div>
              </fieldset>
              {method === "age" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finder-years">Years</Label>
                    <select id="finder-years" value={years} onChange={(event) => setYears(event.target.value)} className={selectClass}>
                      {Array.from({ length: 14 }, (_, index) => <option key={index} value={index}>{index}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finder-months">Months</Label>
                    <select id="finder-months" value={months} onChange={(event) => setMonths(event.target.value)} className={selectClass}>
                      {Array.from({ length: 12 }, (_, index) => <option key={index} value={index}>{index}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="finder-chest">Chest circumference (inches)</Label>
                  <Input id="finder-chest" type="number" min="1" step="0.1" value={chest} onChange={(event) => setChest(event.target.value)} placeholder="e.g. 21.5" />
                </div>
              )}
            </div>
            <div aria-live="polite" aria-atomic="true" className="flex flex-col justify-center rounded-xl bg-sage-soft p-6 text-sage-deep">
              {!recommendation ? (
                <p>Enter a positive chest measurement to find a size.</p>
              ) : outsideRange ? (
                <p>This is outside this garment’s size range. Please compare the chart or contact us before ordering.</p>
              ) : (
                <>
                  <p className="text-sm font-semibold">Recommended size</p>
                  <p className="my-2 text-4xl font-extrabold">{recommendation.row.size}</p>
                  <p>Approximate age: {recommendation.row.age}</p>
                  {recommendation.betweenSizes && <p className="mt-4 font-bold">Between sizes? Pick the bigger one — we’ve sized up for you.</p>}
                  <p className="mt-4 text-sm">A guide, not a guarantee. Check chest, waist and length before ordering.</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="measure-title">
          <h2 id="measure-title" className="text-2xl font-bold">How to measure</h2>
          <p className="mt-2 text-muted-foreground">Use a soft tape over light clothing, with your child standing comfortably.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {([
              ["Chest", "Wrap the tape around the fullest part of the chest, under the arms. Keep it level and comfortably loose."],
              ["Waist", "Measure around the natural waist without pulling the tape tight."],
              ["Length", "Measure from shoulder to hem for frocks and tops, back collar to hem for shirts, or shoulder to crotch snap for rompers."],
            ] as const).map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <MeasurementFigure type={title} />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Between sizes? Pick the bigger one.</li>
            <li>Keep the tape level; do not hold your breath or pull it tight.</li>
            <li>Measure twice and compare with a favourite well-fitting outfit.</li>
            <li>Check the garment-specific length note above before choosing.</li>
          </ul>
        </section>
      </main>
    </>
  );
}
