import { Badge } from "./Badge";
import { categoryTone, WeightCategory } from "@/utils/bmi";

export function WeightCategoryBadge({ category }: { category: string }) {
  return <Badge tone={categoryTone(category as WeightCategory)}>{category}</Badge>;
}
