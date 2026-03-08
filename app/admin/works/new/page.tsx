import { redirect } from "next/navigation";
export default function NewWorkRedirect() {
  redirect("/admin/works/new-editor");
}
