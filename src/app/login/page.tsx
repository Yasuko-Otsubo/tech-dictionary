"use client";

import { useActionState } from "react";
import { signInWithEmail } from "../_libs/_actions/emailAuth";
import { supabase } from "../_libs/supabase";
import Link from "next/link";
import { BUTTON_BASE, BUTTON_PRIMARY, LABEL_TEXT } from "../_libs/buttonStyles";

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
    <div className="max-w-sm mx-auto mt-12 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>

      <button
        onClick={handleGoogleLogin}
        type="button"
        className={`${BUTTON_BASE} w-full mb-4`}
      >
        Googleでログイン
      </button>

      <div className="text-center text-sm text-gray-400 mb-4">または</div>

      <form action={loginAction}>
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
          ログイン
        </button>
      </form>

      {loginState && !loginState.success && (
        <p className="text-red-500 text-sm mt-3">{loginState.error}</p>
      )}

      <Link
        href="/sign_up"
        className="block text-sm text-gray-400 hover:text-[#1F2937] mt-4 text-center"
      >
        アカウントをお持ちでない方はこちら
      </Link>
    </div>
  );
}