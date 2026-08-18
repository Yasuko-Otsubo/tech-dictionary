"use client";

import { useActionState } from "react";
import { signInWithEmail } from "../_libs/_actions/emailAuth";
import { supabase } from "../_libs/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [loginState, loginAction] = useActionState(signInWithEmail, null);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Googleでログイン</button>

      <form action={loginAction}>
        <input type="email" name="email" placeholder="メールアドレス" />
        <input type="password" name="password" placeholder="パスワード" />
        <button type="submit">ログイン</button>
      </form>

      {loginState && !loginState.success && <p>{loginState.error}</p>}
      <Link href="/sign_up">アカウントをお持ちでない方はこちら</Link>
    </div>
  );
}
