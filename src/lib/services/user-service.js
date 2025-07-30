import { createClient } from "../supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, error: authError };
  }

  const { data: userData, error: dbError } = await supabase
    .from("users")
    .select("user_id, name, email, role")
    .eq("user_id", user.id)
    .single()

  if (dbError) {
    return { user: null, error: dbError }
  }

  return { user: userData, error: null}
}