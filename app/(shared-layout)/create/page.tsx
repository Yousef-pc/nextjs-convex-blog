import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import CreateForm from "@/components/web/CreateForm";

export const instant = false;

const CreateRoute = async () => {
  const token = await getToken();

  // The REAL page-level check
  if (!token) {
    redirect("/auth/login");
  }

  return <CreateForm />;
}

export default CreateRoute