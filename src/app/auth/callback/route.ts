import { prisma } from "@/app/_libs/prisma";
import { createSupabaseServerClient } from "@/app/_libs/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/auth/complete";

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { supabaseUserId: data.user.id },
  });

  if (!existingProfile) {
    const emailConflict = await prisma.profile.findUnique({
      where: { email: data.user.email! },
    });

    if (emailConflict) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL("/login?error=email_already_registered", request.url),
      );
    }

    const name =
      data.user.user_metadata?.full_name ??
      data.user.email?.split("@")[0] ??
      "unknown";

    await prisma.profile.create({
      data: {
        name,
        email: data.user.email!,
        authProvider: "GOOGLE",
        supabaseUserId: data.user.id,
      },
    });
  }

  return NextResponse.redirect(new URL(next, request.url));
}
