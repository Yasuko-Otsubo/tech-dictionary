"use client";

import { useActionState } from "react";
import { signUpWithEmail } from "../_libs/_actions/emailAuth";
import { supabase } from "../_libs/supabase";
import Link from "next/link";
import { BUTTON_BASE, BUTTON_PRIMARY, LABEL_TEXT } from "../_libs/buttonStyles";

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
    <div className="max-w-sm mx-auto mt-12 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>

      <button
        onClick={handleGoogleSignup}
        type="button"
        className={`${BUTTON_BASE} w-full mb-4`}
      >
        Googleで新規登録
      </button>

      <div className="text-center text-sm text-gray-400 mb-4">または</div>

      <form action={formAction}>
        <div className="mb-3">
          <p className={LABEL_TEXT}>メールアドレス</p>
          <input
            type="email"
            name="email"
            placeholder="メールアドレス"
            className={`${BUTTON_BASE} w-full`}
          />
        </div>
        <div className="mb-4">
          <p className={LABEL_TEXT}>パスワード</p>
          <input
            type="password"
            name="password"
            placeholder="パスワード"
            className={`${BUTTON_BASE} w-full`}
          />
        </div>
        <button type="submit" className={`${BUTTON_PRIMARY} w-full`}>
          新規登録
        </button>
      </form>

      {state && !state.success && (
        <p className="text-red-500 text-sm mt-3">{state.error}</p>
      )}

      <Link
        href="/login"
        className="block text-sm text-gray-400 hover:text-[#1F2937] mt-4 text-center"
      >
        すでにアカウントをお持ちの方はこちら
      </Link>
    </div>
  );
}