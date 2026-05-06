import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PetCareInteractions } from "./pet-care-interactions";

export const dynamic = "force-dynamic";

function formatDatetimeLocalValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function withBookingDefaults(content: string) {
  const now = new Date();
  now.setSeconds(0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Render the first visible value on the server so users never see an empty datetime placeholder.
  return content.replace(
    '<input name="arrivalTime" type="datetime-local" required>',
    `<input name="arrivalTime" type="datetime-local" value="${formatDatetimeLocalValue(tomorrow)}" min="${formatDatetimeLocalValue(now)}" step="60" required>`,
  );
}

function getLegacyContent() {
  return withBookingDefaults(readFileSync(join(process.cwd(), "app", "legacy-content.html"), "utf8"));
}

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getLegacyContent() }} />
      <PetCareInteractions />
    </>
  );
}
