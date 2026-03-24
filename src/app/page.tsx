import { redirect } from "next/navigation";

import { DEFAULT_LANGUAGE } from "@/lib/i18n";

export default function Home() {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
