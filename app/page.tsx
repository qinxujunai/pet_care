import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PetCareInteractions } from "./pet-care-interactions";

function getLegacyContent() {
  return readFileSync(join(process.cwd(), "app", "legacy-content.html"), "utf8");
}

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getLegacyContent() }} />
      <PetCareInteractions />
    </>
  );
}
