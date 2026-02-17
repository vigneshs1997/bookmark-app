'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {

  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {

      
      await supabase.auth.getSession();

      router.push('/');
    };

    handleLogin();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging you in...</p>
    </div>
  );
}
