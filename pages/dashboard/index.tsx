import { useUser } from "@supabase/supabase-auth-helpers/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Layout from "../../components/layout";
import { getCards } from "../../lib/cards";
import { CardsResponse } from "../../typings/cards";
import { EyeIcon, EyeOffIcon, PencilIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Tooltip from "../../components/tooltip";
import { Transition, Dialog } from "@headlessui/react";
import Button from "../../components/button";

export default function Dash() {
  const { user, isLoading } = useUser();
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const [profile, setProfile] = useState<null | CardsResponse>(null);
  useEffect(() => {
    (async function prof() {
      if (user) {
        const profile = await getCards(user);
        setProfile(profile);
      }
    })();
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Layout nav="fixed" scrollbar={true}>
        <div className="relative ">
          {user ? (
            <div className="  z-20 mx-auto w-full max-w-screen-xl  pt-24">
              <h2 className="mb-4 text-4xl font-bold text-gray-50">
                Quick Start
              </h2>
              <div className="flex space-x-10">
                <Card
                  image="https://images.unsplash.com/photo-1657895116602-9f49a1eef455?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  name="Wedding"
                />
              </div>
            </div>
          ) : (
            <h2 className="mb-4 text-4xl font-bold text-gray-50">
              You aren&apos;t logged in!
            </h2>
          )}
          <div className="absolute top-0 right-0 left-0 -z-10 h-96 bg-gradient-to-b from-cyan-900"></div>
        </div>
        {profile && profile.cards ? (
          <div className="mx-auto mt-10 mb-10 w-full max-w-screen-xl">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 ">
              Saved Cards
            </h2>
            <div className="flex flex-wrap gap-10 ">
              {profile.cards.map((card) => (
                <span key={card.id}>
                  <SavedCard
                    name={card.name}
                    design={card.design}
                    id={card.id}
                    public={card.public}
                  />
                </span>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </Layout>
      <MyDialog />
    </>
  );

  function Card(props: { image: string; name: string }) {
    return (
      <Link href="/dashboard/create-card?starter=wedding">
        <div className="group flex h-60 w-44 cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-400/20 ring-1 ring-gray-800/20 transition duration-300 hover:bg-gray-500/20 hover:shadow-xl">
          <img
            src={props.image}
            className="h-36 w-28 rounded-2xl object-cover shadow-md brightness-95 transition duration-300 group-hover:brightness-100"
          ></img>
          <h3 className="mt-2 text-sm font-medium">{props.name}</h3>
        </div>
      </Link>
    );
  }

  function SavedCard(props: {
    name: string;
    design: string;
    id: number;
    public: boolean;
  }) {
    return (
      <div className="group relative">
        <Link href={`/card?creator=${user.id}&id=${props.id}`}>
          <a className="group flex h-64 w-48 cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-400/20 ring-1 ring-gray-800/20 transition duration-300 group-hover:bg-gray-500/20 group-hover:shadow-xl">
            <div className="my-auto -translate-y-1 transition group-hover:-translate-y-5">
              <h2 className="mt-2 text-lg font-medium">{props.name}</h2>
              <h3 className="mt-2 text-sm font-medium">{props.design}</h3>
            </div>
          </a>
        </Link>
        <div className="invisible absolute right-0 bottom-0 ml-auto mr-1.5 mb-1.5 flex translate-y-4 cursor-pointer transition group-hover:visible group-hover:translate-y-0">
          <Tooltip text="Visability Settings">
            <div
              className="relative flex items-center justify-center"
              onClick={() => alert(1)}
            >
              {props.public ? (
                <EyeIcon className="peer fixed h-6 w-6 p-1 text-gray-800" />
              ) : (
                <EyeOffIcon className="peer fixed h-6 w-6 p-1 text-gray-800" />
              )}
              <div className="h-8 w-8 rounded-full peer-hover:bg-gray-400/50"></div>
            </div>
          </Tooltip>
          <Tooltip text="Edit Card">
            <Link href={`/edit-card?id=${props.id}`}>
              <a className="relative flex items-center justify-center">
                <PencilIcon className="peer fixed h-6 w-6 p-1 text-gray-800" />
                <div className="h-8 w-8 rounded-full peer-hover:bg-gray-400/50"></div>
              </a>
            </Link>
          </Tooltip>
        </div>
      </div>
    );
  }
  function MyDialog() {
    return (
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Email Sent
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please check your email for a magic link to log in. Make
                      sure to check your spam folder if its not in your inbox.
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button
                      color="cyan"
                      use="secondary"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
}
