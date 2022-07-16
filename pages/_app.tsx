import type { AppProps } from "next/app";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { SupabaseClient } from "@supabase/supabase-js";
import "../styles/globals.css";
import Head from "next/head";

const supabaseClient = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} supabaseClient={supabaseClient} />
    </UserProvider>
  );
}
