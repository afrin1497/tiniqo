import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  const messages = siteConfig.announcements;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => window.clearInterval(t);
  }, [paused, messages.length]);

  return (
    <div className="bg-sage-deep text-background">
      <div className="container-page flex h-9 items-center justify-center gap-3 text-xs font-semibold md:text-sm">
        <p key={index} aria-live={paused ? "polite" : "off"} className="animate-marquee-fade truncate text-center">
          {messages[index]}
        </p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play announcements" : "Pause announcements"}
          className="grid size-6 shrink-0 place-items-center rounded-full hover:bg-background/15"
        >
          {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
        </button>
      </div>
    </div>
  );
}
