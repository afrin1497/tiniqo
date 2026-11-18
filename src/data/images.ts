// Maps image keys used in the JSON data files to bundled images.
// To swap a photo, replace the file or point a key at a new import / URL.
import heroKids from "@/assets/hero-kids-garden.jpg";
import categoryGirls from "@/assets/category-girls.jpg";
import categoryBoys from "@/assets/category-boys.jpg";
import categoryBaby from "@/assets/category-baby.jpg";
import studioStory from "@/assets/studio-story.jpg";
import girlsFloralFrock from "@/assets/products/girls-floral-frock.jpg";
import girlsLehenga from "@/assets/products/girls-lehenga.jpg";
import girlsPartyDress from "@/assets/products/girls-party-dress.jpg";
import girlsCoordSet from "@/assets/products/girls-coord-set.jpg";
import boysKurtaSet from "@/assets/products/boys-kurta-set.jpg";
import boysShirtShorts from "@/assets/products/boys-shirt-shorts.jpg";
import boysPartySet from "@/assets/products/boys-party-set.jpg";
import boysTeeSet from "@/assets/products/boys-tee-set.jpg";
import babyRomper from "@/assets/products/baby-romper.jpg";
import babyJhablaSet from "@/assets/products/baby-jhabla-set.jpg";
import babyDress from "@/assets/products/baby-dress.jpg";

export const images: Record<string, string> = {
  "hero-kids-garden": heroKids,
  "category-girls": categoryGirls,
  "category-boys": categoryBoys,
  "category-baby": categoryBaby,
  "studio-story": studioStory,
  "girls-floral-frock": girlsFloralFrock,
  "girls-lehenga": girlsLehenga,
  "girls-party-dress": girlsPartyDress,
  "girls-coord-set": girlsCoordSet,
  "boys-kurta-set": boysKurtaSet,
  "boys-shirt-shorts": boysShirtShorts,
  "boys-party-set": boysPartySet,
  "boys-tee-set": boysTeeSet,
  "baby-romper": babyRomper,
  "baby-jhabla-set": babyJhablaSet,
  "baby-dress": babyDress,
};

export function img(key: string): string {
  return images[key] ?? key;
}
