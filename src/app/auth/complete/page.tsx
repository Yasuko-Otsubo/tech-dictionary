'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react";

const AuthCompletePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <p>ログイン処理中です...</p>
  );
};

export default AuthCompletePage;