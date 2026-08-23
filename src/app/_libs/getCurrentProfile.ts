import { prisma } from "./prisma";
import { createSupabaseServerClient } from "./supabase-server";

export async function getCurrentProfile() {
  //サーバー用クライアントを取得
  const supabase = await createSupabaseServerClient();
  //ログイン中のSupabaseユーザー」を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  //ログインしていれば、そのSupabaseのユーザーIDを使って、profilesテーブルから対応する行を探して返す
  const profile = await prisma.profile.findUnique({
    where: { supabaseUserId: user.id },
  });

  return profile;
}