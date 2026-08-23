import { getCurrentProfile } from "@/app/_libs/getCurrentProfile";
import { redirect } from "next/navigation";
import NewTermForm from "./_components/NewTermForm";

export default async function NewTermPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return <NewTermForm />;
}

