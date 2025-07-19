

import { redirect } from "next/navigation";

export async function Login() {
  const error = false //REPLACE WITH ERROR FUNCTION OR SOMETHING FROM SUPABASE

  if (error) {
    alert("LOGIN ERROR")
    redirect("/")
  }

  redirect("/student")
}