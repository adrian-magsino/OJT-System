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

  const profilePictureUrl = user.user_metadata?.avatar_url || null;

  const enrichedUser = {
    ...userData,
    profile_picture_url: profilePictureUrl
  }

  return { user: enrichedUser, error: null}
}