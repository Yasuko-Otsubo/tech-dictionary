//サーバー用クライアント(App router対応) supabaseクライアント生成関数
//supabaseクライアントにこのリクエストcookieを使って認証してと設定している関数

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  //createServerClient(url, key, {cookies})= このリクエストのcookiesを認証
  return createServerClient(
    //supabaseクライアントにcookiesを設定して返す
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        //これから定義する自分たちのgetALL
        getAll() {
          return cookieStore.getAll(); //Next.js標準のgetAll
        },
        //supabaseがcookieをセットする時に呼ばれる関数
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) =>
                cookieStore.set(name, value, options), //ブラウザに新しいcookieをセットする
            );
          } catch {}
        },
      },
    },
  );
}
