"use client";

import { useActionState } from "react";
import { signUpWithEmail } from "../_libs/_actions/emailAuth";
import { supabase } from "../_libs/supabase";
import Link from "next/link";

export default function SignupPage() {
  const [state, formAction] = useActionState(signUpWithEmail, null);

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };
  return (
    <div>
      <button onClick={handleGoogleSignup}>Googleで新規登録</button>
      <form action={formAction}>
        <input type="email" name="email" placeholder="メールアドレス" />
        <input type="password" name="password" placeholder="パスワード" />
        <button type="submit">新規登録</button>
      </form>
      {state && !state.success && <p>{state.error}</p>}
      <Link href="/login">すでにアカウントをお持ちの方はこちら</Link>
    </div>
  );
}
