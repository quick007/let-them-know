import { useUser } from "@supabase/supabase-auth-helpers/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { getCards, newCard } from "../../lib/cards";
import { Card, CreateCardData } from "../../typings/cards";
import * as Yup from "yup";
import { CardsResponse } from "../../typings/cards";
import Button from "../../components/button";

export default function Cards() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<null | CreateCardData>(null);
  const [windowWidth, setWindowWidth] = useState(0)
  const [submitting, setSubmitting] = useState({
    failed: false,
    submitting: false,
  });
  const { starter, editID } = router.query;

  const [profile, setProfile] = useState<null | CardsResponse>(null);

  useEffect(() => {
    (async function prof() {
      const profile = await getCards(user);
      setProfile(profile);
    })();
  }, [user]);

  useEffect(() => {

setWindowWidth(window.innerWidth)
  }, [])
  if (!router.query) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-screen-xl flex-col relative">

        <div className="flex flex-col">
          <div className="mx-auto flex space-x-6 mb-10">
            {[1, 2, 3].map((value) => (
              <div
                className={`h-3 w-12 rounded-full ${
                  value <= page
                    ? value < page
                      ? "bg-gray-300"
                      : "bg-gray-900"
                    : "bg-gray-200"
                }`}
                key={value}
              ></div>
            ))}
          </div>
          {windowWidth > 500 ?
          <>
          <div className="space-y-10">
          <Desktop />
          </div>
          <div className="flex mt-24 mb-10 ml-auto">
            {page != 1 ?
            <Button color="light-cyan" use="secondary" className="ring-inset" onClick={() => setPage(page - 1)}>
            Previous
              </Button>
              : ""}
            <Button color="cyan" use="secondary" className="ml-6" onClick={() => (page != 3 ? setPage(page + 1) : null)}>
              {page == 3 ? "Create Card" : "Next"}
              </Button>
          </div>
          </>
            :
          <OneLegacy />
}
        </div>
        <div className="fixed right-10 top-30 base-style group base-style-hover shadow-lg h-20 w-36 rounded-lg cursor-pointer opacity-50 hover:opacity-100 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition duration-300 font-medium text-sm ">Live Preview</span>
        </div>
      </div>
    </Layout>
  );
  function Desktop() {
    switch (page) {
      case 1:
        return <One />
      case 2: 
      return <Two />
      case 3:
        return <Three />
    }

    function One() {
      return (
        <>
        <section>
          <h2 className="font-bold text-xl">What are you celebrating?</h2>
          <div className="overflow-x-auto py-6 pl-1  flex  space-x-10 scroll">
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
          </div>
          </section>
          <section>
          <h2 className="font-bold text-xl ">Pick a Theme</h2>
          <div className="overflow-x-auto py-6 pl-1  flex  space-x-10 scroll">
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
            <div className="base-style base-style-hover h-48 min-w-[9rem] cursor-pointer rounded-xl !hover:shadow-lg snap-center"></div>
          </div>
          
          </section>
        </>
      )
    }
    function Two() {
      return (
        <>
        <section>

        <h2 className="font-bold text-xl">Who's this card for?</h2>
          
        </section>
        <section className="">
        <h2 className="font-bold text-xl">Pick or type out a message</h2>

        </section>
        <section className="">
        <h2 className="font-bold text-xl">Add Signature</h2>
        </section>
        <section className="">
        <h2 className="font-bold text-xl">Make this card a gift</h2>
        </section>
        </>
      )
    }
    function Three() {
      return (
        <>
        <section className="">
        <h2 className="font-bold text-xl">Preview Card</h2>
        </section>
        </>
      )
    }
  }

  function OneLegacy() {
    return (
      <Formik
        //@ts-ignore-error
        initialValues={{ name: "", design: starter }}
        onSubmit={(data: Card) => {
          setSubmitting({ failed: false, submitting: true }),
            submitData({
              name: data.name,
              design: data.design,
              id: profile.data.cardsID + 1,
              public: false,
              updated: new Date(),
            });
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("This field is required"),
          design: Yup.string().required(),
        })}
        
      >
        <Form className="flex flex-col">
          Name
          <Field name="name" type="text" className="max-w-sm rounded-lg" />
          <ErrorMessage name="name" />
          <label>
            <Field type="radio" name="design" value="wedding" />
            Wedding
          </label>
          <label>
            <Field type="radio" name="design" value="birthday" />
            Birthday
          </label>
          <button type="submit" className="" disabled={submitting.submitting}>
            {submitting.failed
              ? "Failed"
              : submitting.submitting
              ? "Creating Card..."
              : "Create Your Card"}
          </button>
        </Form>
      </Formik>
    );
  }

  function submitData(data: Card) {
    const card = newCard(
      user,
      {
        name: data.name,
        design: data.design,
        id: data.id,
        public: data.public,
        updated: data.updated,
      },
      profile.data,
      profile.cards
    );
    if (!card) {
      setSubmitting({ failed: true, submitting: false });
    } else {
      setSubmitting({ failed: false, submitting: false });
      alert("created card");
    }
  }
}
