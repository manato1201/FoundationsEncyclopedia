import { FoundationsCatalog } from "@/components/catalog/FoundationsCatalog";
import { ReviewPanel } from "@/components/quiz/ReviewPanel";
import { foundationsLoader } from "@/lib/content/foundations";

export default function HomePage() {
  const entries = foundationsLoader.getAllMeta();
  const titles = Object.fromEntries(
    entries.map((entry) => [entry.id, entry.name]),
  );
  return (
    <>
      <FoundationsCatalog entries={entries} featuredId="for-loop-flow" />
      <ReviewPanel titles={titles} />
    </>
  );
}
