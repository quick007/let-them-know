import { Menu, Transition } from "@headlessui/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import Link from "next/link";
import {
  useState,
  useEffect,
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  Fragment,
} from "react";
import { getProfile } from "../lib/profile";
import { ProfileResponse } from "../typings/profile";

export default function Layout(props: {
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
  nav?: "fixed" | "sticky";
}) {
  const { user, error, isLoading } = useUser();
  const [profile, setProfile] = useState<null | ProfileResponse>(null);
  useEffect(() => {
    (async function prof() {
      const profile = await getProfile(user);
      setProfile(profile);
    })();
  }, [user]);

  if (!profile || isLoading) {
    return (
      <>
        <div className="flex  min-h-screen flex-col">
          <Navbar loading={true} position={props.nav} />
          <div className={`${props.nav == "fixed" ? "" : "my-10"} flex-1`}>{props.children}</div>
          <Footer />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex  min-h-screen flex-col ">
        <Navbar position={props.nav} />
        <div className={`${props.nav == "fixed" ? "" : "my-10"} flex-1`}>
          {props.children}
        </div>
        <Footer />
      </div>
    </>
  );

  function Navbar(props: { loading?: boolean; position?: "sticky" | "fixed" }) {
    return (
      <div
        className={`z-40 mx-2 mt-3 flex h-14 items-center justify-between rounded-2xl bg-gray-900/10  px-2 shadow-lg ring-1 ring-gray-500/20 backdrop-blur-lg backdrop-filter lg:mx-6 lg:px-4  ${
          props.position == "fixed" ? "fixed right-0 left-0" : "sticky top-3"
        }`}
      >
        <Link href="/">
          <h1 className="text-2xl font-bold">Let Them Know</h1>
        </Link>
        <div className="flex">
          <h2 className="my-auto mr-6 text-center text-lg font-medium">
            Support
          </h2>
          {!props.loading && profile.success ? (
            <>
              <Link href="/dashboard">
                <a className="my-auto mr-8 text-center text-lg font-medium">
                  Dashboard
                </a>
              </Link>

              <div className="">
                <Menu as="div" className="relative">
                  <Menu.Button className="py-10">
                    <img
                      src="https://images.unsplash.com/photo-1657716143739-926c158187b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      className=" h-10 w-10 rounded-full object-cover "
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
                    <Menu.Items className="absolute -right-1 -mt-9 w-48 rounded-md bg-gray-200/50 p-1 shadow-xl ring-1 ring-black ring-opacity-5 backdrop-blur-xl backdrop-filter focus:outline-none">
                      <h2 className="py-1 px-2">
                        Logged in as{" "}
                        <span className="font-medium">
                          {profile.data.username}
                        </span>
                      </h2>
                      <hr className="border-top-2 border-white/25" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-cyan-600 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 my-1 text-sm`}
                          >
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-cyan-600 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2  my-1 text-sm`}
                          >
                            Other Stuff
                          </button>
                        )}
                      </Menu.Item>
                      <hr className="border-top-2 border-white/25" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-red-500 text-white" : "text-red-500"
                            } group flex w-full items-center rounded-md px-2 py-2 mt-1 text-sm`}
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
            </>
          ) : props.loading ? (
            <a className="rounded bg-cyan-900 px-4 py-1.5 font-medium text-gray-500">
              Login
            </a>
          ) : (
            <Link href="/login">
              <a className="rounded bg-cyan-600 px-4 py-1.5 font-medium text-gray-100">
                Login
              </a>
            </Link>
          )}
        </div>
      </div>
    );
  }
  function Footer() {
    return <div className="h-16 bg-blue-500">footer soon&#x2122;</div>;
  }
}
