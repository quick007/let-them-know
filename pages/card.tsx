import { Menu, Transition } from "@headlessui/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment } from "react";
import { getCardsByID } from "../lib/cards";
import { getProfile } from "../lib/profile";
import { Card } from "../typings/cards";
import { ProfileResponse } from "../typings/profile";

export default function CardPage() {
  const router = useRouter();
  const { creator, id } = router.query;
  const { user, isLoading } = useUser();
  const [card, setCard] = useState<null | Card>(null);
  const [profile, setProfile] = useState<null | ProfileResponse>(null);

  useEffect(() => {
    (async function prof() {
      if (creator) {
        const profile = await getCardsByID(creator as string);
        setCard(profile.cards.find(findCard));
      }
    })();
    (async function prof() {
      if (user) {
        const profile = await getProfile(user);
        if (profile.success) setProfile(profile);
      }
    })();
		function findCard(card: Card) {
			return card.id == Number.parseInt(id as string);
		}
  }, [user, creator, id]);

  

  if (!router.query) {
    return null;
  }

  return (
    <div className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat [background-image:url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')]">
      <div className="absolute flex h-screen w-screen justify-center overflow-x-hidden bg-black/25 ">
        <div className="flex w-full flex-col px-2">
          <Profile />
          <div className="mx-auto mt-32 flex h-min min-w-[15rem] max-w-xl flex-col items-center justify-center rounded-xl bg-gray-100 p-8 shadow-lg">
            {card ? (
              <>
                <h1 className="font-2xl font-medium">{card.name}</h1>
                <h2 className="">{card.design}</h2>
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-4 text-lg font-medium">Loading Your Card</p>
              </>
            )}
          </div>
          <Link href="/">
            <a className="group mx-auto mt-10 mb-32 flex w-max cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-900/20 px-2 py-1 ring-1 ring-gray-800/30 transition duration-300 hover:-translate-y-1 hover:bg-gray-900/30 hover:shadow-2xl">
              <h3 className="text-sm font-medium text-gray-50 transition duration-300 group-hover:font-semibold">
                Made with Let Them Know
              </h3>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );

  function Profile() {
    if (profile) {
      return (
        <div className="ml-auto h-16 flex">
          <Menu as="div" className="relative mt-auto pr-3">
            <Menu.Button className="">
              <img
                src="https://images.unsplash.com/photo-1657716143739-926c158187b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                className=" h-10 w-10 rounded-full object-cover ring-1 ring-gray-900/20"
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-2 w-48 rounded-md bg-gray-200/50 p-1 shadow-xl ring-1 ring-black ring-opacity-5 backdrop-blur-xl backdrop-filter focus:outline-none">
                <h2 className="py-1 px-2">
                  Logged in as{" "}
                  <span className="font-medium">{profile.data.username}</span>
                </h2>
                <hr className="border-top-2 border-white/25" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-cyan-600 text-white" : "text-gray-900"
                      } group my-1 flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Link href="/dashboard">
                  <a>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-cyan-600 text-white" : "text-gray-900"
                          } group my-1 flex w-full items-center rounded-md px-2  py-2 text-sm`}
                        >
                          Dashboard
                        </button>
                      )}
                    </Menu.Item>
                  </a>
                </Link>
                <hr className="border-top-2 border-white/25" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-500 text-white" : "text-red-500"
                      } group mt-1 flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => supabaseClient.auth.signOut()}
                    >
                      Log Out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      );
    }
    return <div className="h-16"></div>
  }
}
