import { FoundationsCatalog } from "@/components/catalog/FoundationsCatalog";
import { foundationsLoader } from "@/lib/content/foundations";

export default function HomePage() {
  const entries = foundationsLoader.getAllMeta();
  return <FoundationsCatalog entries={entries} featuredId="for-loop-flow" />;
}
