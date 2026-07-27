import { redirect } from "next/navigation";

export default function Home() {
  // For now, redirect the landing page straight to the dashboard
  redirect("/dashboard");
}
