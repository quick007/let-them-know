import { useUser } from "@supabase/supabase-auth-helpers/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { getCards, getProfile } from "../../lib/profile";
import { CardsResponse } from "../../typings/cards";

export default function Dash() {
  const { user, isLoading } = useUser();
  const [profile, setProfile] = useState<null | CardsResponse>(null)
  useEffect(() => {
    (async function prof() {
      const profile = await getCards(user);
      setProfile(profile);
      console.log(profile)
    })();
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <Layout nav="fixed">
      <div className="relative ">
        {user ?
        <div className="  z-20 mx-auto w-full max-w-screen-xl  pt-24">
          <h2 className="mb-4 text-4xl font-bold text-gray-50">Quick Start</h2>
          <div className="flex space-x-10">
            <Card
              image="https://images.unsplash.com/photo-1657895116602-9f49a1eef455?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              name="Wedding"
            />
          </div>
        </div>
        : 
        <h2 className="mb-4 text-4xl font-bold text-gray-50">You aren't logged in!</h2>
        }
        <div className="absolute top-0 right-0 left-0 -z-10 h-96 bg-gradient-to-b from-cyan-900"></div>
      </div>
      {profile.cards ?
      
      <div className="mx-auto mt-10 w-full max-w-screen-xl">
        <h2 className="mb-4 text-4xl font-bold text-gray-900 ">Saved Cards</h2>
        <div className="flex space-x-10">
          {profile.cards.map((card) => 
          <SavedCard name={card.name} design={card.design} />
          )}
        </div>
      </div>
      : ""}
    </Layout>
  );

  function Card(props: { image: string; name: string }) {
    return (
      <Link href="/dashboard/create-card?starter=wedding">
        <div className="group flex h-60 w-44 cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-400/20 ring-1 ring-gray-800/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <img
            src={props.image}
            className="h-36 w-28 rounded-2xl object-cover shadow-md brightness-95 transition duration-300 group-hover:brightness-100"
          ></img>
          <h3 className="mt-2 text-sm font-medium">{props.name}</h3>
        </div>
      </Link>
    );
  }

  function SavedCard(props: { name: string; design: string }) {
    return (
      <Link href="/dashboard/create-card?starter=wedding">
        <div className="group flex h-64 w-48 cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-400/20 ring-1 ring-gray-800/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h2 className="mt-2 text-lg font-medium">{props.name}</h2>
          <h3 className="mt-2 text-sm font-medium">{props.design}</h3>
        </div>
      </Link>
    );
  }
}
