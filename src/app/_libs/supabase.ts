//ブラウザ用クライアント
//ログイン、OTP、パスワード再設定、updateUser() など、クライアント側で使う

import { createBrowserClient } from "@supabase/ssr";

//ブラウザ用のクライアントを作る関数」を読みこむ
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce", //サーバー側でログイン状態を確認できるようになる
      detectSessionInUrl: true,
      persistSession: true, //ログイン情報をブラウザに保存するかどうか
      autoRefreshToken: true, //アクセストークンの期限が切れそうになったら自動で更新するかどうか
    },
  },
);
