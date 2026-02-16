'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {

  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (error) {
          console.error("Login error:", error.message);
        }
      }
 
      router.push('/');
    };

    handleLogin();
  }, []);

  return <p>Logging in...</p>;
}
