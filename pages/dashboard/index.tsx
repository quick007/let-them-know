import { useUser } from "@supabase/supabase-auth-helpers/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Layout from "../../components/layout";
import { getCards, getCardsByID } from "../../lib/cards";
import { CardsResponse, Card } from "../../typings/cards";
import {
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  SelectorIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Tooltip from "../../components/tooltip";
import { Transition, Dialog, Listbox } from "@headlessui/react";
import Button from "../../components/button";
import { supabase } from "../../lib/init";

export default function Dash() {
  const { user, isLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<null | {
    id: number;
    visible: boolean;
  }>(null);

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
          <Tooltip text="Visibility &#x26; Sharing Settings">
            <div
              className="relative flex items-center justify-center"
              onClick={() => (
                setSelectedCardData({ id: props.id, visible: props.public }),
                setOpen(true)
              )}
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
    const options: { id: 0 | 1; name: "Yes" | "No"; unavailable: boolean }[] = [
      { id: 0, name: "Yes", unavailable: false },
      { id: 1, name: "No", unavailable: false },
    ];
    const [selectedOption, setSelectedOption] = useState(
      options[selectedCardData ? (!selectedCardData.visible ? 1 : 0) : 0]
    );
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false)

    async function updateCardData(visible: boolean) {
      const cards = JSON.parse(JSON.stringify(profile.cards));
      try {
        setSaving(true);

        let cardIndex: number = cards.findIndex(findCard);

        cards[cardIndex].public = visible;
      } catch (error) {
        console.log(error);
      } finally {
        try {
          const updates = {
            id: user.id,
            cards: cards,
            updated_at: new Date(),
          };

          const { error } = await supabase.from("profiles").upsert(updates, {
            returning: "minimal",
          });

          if (error) {
            throw error;
          }
        } catch (error) {
          console.log(error);
        } finally {
          setProfile({
            ...profile,
            cards,
          });
          setOpen(false);
          setSaving(false);
        }
      }
    }
    function findCard(card: Card) {
      return card.id == selectedCardData.id;
    }

    function close() {
      if (!saving) {
        setOpen(false);
      }
    }
    if (user && user.id && selectedCardData && selectedCardData.id) {
    return (
      
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => close()}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Visibility Settings
                  </Dialog.Title>
                  <section className="">
                    <p className="text-sm text-gray-600">
                      Change the visibility settings and copy a sharing link for
                      your card.
                    </p>
                    <div className="mt-4 -z-10   ">
                      <h4 className="mb-1.5 font-medium text-gray-800">
                        Sharing
                      </h4>
                      <div className="flex justify-between rounded-lg bg-gray-200 px-2 font-medium text-gray-800 ring-1 ring-gray-800/20 group cursor-pointer hover:ring-cyan-600/50"
                      onClick={() => (setCopied(true), navigator.clipboard.writeText(`${process.env.NODE_ENV == "production" ? process.env.NEXT_PUBLIC_WEB_LINK : "http://localhost:3000"}/card?creator=${user.id}&id=${selectedCardData.id}`), setTimeout(() => setCopied(false), 800))}
                      >
                        <p className="relative overflow-x-hidden whitespace-nowrap border-r border-gray-800/20 group-hover:border-cyan-600/50 py-1.5">
                          {`${process.env.NODE_ENV == "production" ? process.env.NEXT_PUBLIC_WEB_LINK : "http://localhost:3000"}/card?creator=${user.id}&id=${selectedCardData.id}`}
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-gray-200 to-gray-200"></div>
                        </p>
                        <div className=" shrink-0 grow  py-1.5 pl-2 relative">
                          <span className="invisible">Copy Link!!!</span>
                          <span className={`absolute left-0 right-0 text-center ml-2 px-1 rounded-lg hover:bg-cyan-300/20 ${copied ? "text-blue-600 bg-cyan-300/30" : ""}`}>{!copied ? "Copy Link" : "Copied!"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 z-10">
                      <Listbox
                        value={selectedOption}
                        onChange={setSelectedOption}
                      >
                        <h4 className="mb-1.5 font-medium text-gray-800">
                          Visible
                        </h4>
                        <Listbox.Button className="flex  w-full items-center justify-between rounded-lg bg-gray-200 py-1.5 pl-3 pr-2 font-medium text-gray-800 ring-1 ring-gray-800/20 backdrop-blur">
                          {selectedOption.name}
                          <SelectorIcon className="h-5 w-5" />
                        </Listbox.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Listbox.Options className="absolute right-0 z-[100] left-0 mt-2 rounded-lg bg-gray-200/80 p-2  font-medium text-gray-800 ring-1 ring-gray-800/20 backdrop-blur">
                            {options.map((option) => (
                              <Listbox.Option
                                key={option.id}
                                value={option}
                                disabled={option.unavailable}
                                className="cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-900/10 z-10"
                              >
                                {option.name}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </Listbox>
                      <p className="mt-1 text-xs italic text-gray-500">
                        This card is{" "}
                        {!selectedOption.id
                          ? "public to anyone with the link"
                          : "visible only to you"}
                      </p>
                    </div>
                    
                  </section>

                  <div className="mt-6 flex items-center space-x-4">
                    <Button
                      color="cyan"
                      use="secondary"
                      onClick={() =>
                        (selectedCardData.visible &&
                          selectedOption.name == "Yes") ||
                        (!selectedCardData.visible &&
                          selectedOption.name == "No")
                          ? setOpen(false)
                          : updateCardData(!selectedOption.id)
                      }
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      color="light-cyan"
                      use="tertiary"
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
                    else {
                      return null
                    }

  }
}
