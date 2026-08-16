'use client'

import { supabase } from "../_libs/supabase"

export default function LoginPage() {
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
    </div>
  );
};

