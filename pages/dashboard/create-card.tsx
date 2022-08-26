import { useUser } from "@supabase/supabase-auth-helpers/react";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { getCards, newCard } from "../../lib/cards";
import { Card, CreateCardData } from "../../typings/cards";
import * as Yup from "yup";
import { CardsResponse, Message } from "../../typings/cards";
import Button from "../../components/button";
import * as CardDesigns from "../../lib/themes-and-designs";
import Image from "next/image";
import Tooltip from "../../components/tooltip";

export default function Cards() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CreateCardData>({
    page1: { theme: null, design: null },
    page2: null,
  });
  const [windowWidth, setWindowWidth] = useState(0);
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
    setWindowWidth(window.innerWidth);
  }, []);
  if (!router.query) {
    return null;
  }

  return (
    <Layout>
      <div className="relative mx-auto flex w-full max-w-screen-xl flex-col">
        <div className="flex flex-col">
          <div className="mx-auto mb-10 flex space-x-6">
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
          {windowWidth > 500 ? (
            <>
              <div className="flex flex-col space-y-10">
                <Desktop />
              </div>
              <div className="mt-24 mb-10 ml-auto tflex !hidden">
                {page != 1 ? (
                  <Button
                    color="light-cyan"
                    use="secondary"
                    className="ring-inset"
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  color="cyan"
                  use="secondary"
                  className="ml-6"
                  onClick={() => (page != 3 ? setPage(page + 1) : null)}
                >
                  {page == 3 ? "Create Card" : "Next"}
                </Button>
              </div>
            </>
          ) : (
            <OneLegacy />
          )}
        </div>
        <div className="top-30 base-style base-style-hover group fixed right-10 flex h-20 w-36 cursor-pointer items-center justify-center rounded-lg opacity-50 shadow-lg hover:opacity-100">
          <span className="text-sm font-medium opacity-0 transition duration-300 group-hover:opacity-100 ">
            Live Preview
          </span>
        </div>
      </div>
    </Layout>
  );
  function Desktop() {
    switch (page) {
      case 1:
        return <One />;
      case 2:
        return <Two />;
      case 3:
        return <Three />;
    }

    function One() {
      return (
        <>
          <section>
            <h2 className="text-xl font-bold">What are you celebrating?</h2>
            <div className="scroll flex space-x-10  overflow-x-auto  py-6 pl-1">
              {CardDesigns.types.map((v) => (
                <div
                  className={
                    "base-style base-style-hover !hover:shadow-lg relative h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl " +
                    (data.page1.theme == v.id
                      ? "!shadow-xl !ring-gray-800/40"
                      : "")
                  }
                  onClick={() =>
                    setData({ ...data, page1: { ...data.page1, theme: v.id } })
                  }
                  key={v.id}
                >
                  {v.name}
                  {v.iconPath ? <Image src={v.iconPath} layout="fill" /> : ""}
                </div>
              ))}
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
              <div className="base-style base-style-hover !hover:shadow-lg h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold ">Pick a Design</h2>
            <div className="scroll flex space-x-10  overflow-x-auto  py-6 pl-2">
              {data.page1.theme != null
                ? CardDesigns.types[data.page1.theme].designs.map((v) => (
                    <div
                      className={
                        "base-style base-style-hover !hover:shadow-lg relative h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl " +
                        (data.page1.design == v.id
                          ? "!shadow-xl !ring-gray-800/40"
                          : "")
                      }
                      onClick={() =>
                        setData({
                          ...data,
                          page1: { ...data.page1, design: v.id },
                        })
                      }
                    >
                      <Image
                        src={v.path}
                        width={100}
                        height={100}
                        className="rounded-xl object-cover"
                      />
                      <div></div>
                    </div>
                  ))
                : ""}
              <div className="base-style base-style-hover !hover:shadow-lg invisible h-48 min-w-[9rem] cursor-pointer snap-center rounded-xl"></div>
            </div>
          </section>
          <div className="mt-24 mb-10 ml-auto flex">
            <Button
              color="cyan"
              use="secondary"
              disabled={data.page1.design == null}
              className="ml-6"
              onClick={() => setPage(2)}
            >
              {page == 3 ? "Create Card" : "Next"}
            </Button>
          </div>
        </>
      );
    }
    function Two() {
      const messages: Message[] = [
        {
          id: 2, //always start at 2, 0 is reserved for no message and 1 is custom
          short: "get well soon:tm:",
          message: "I hope you get well soon!"
        }
      ]
      function fixData(data: {
        for: string;
        message: string;
        messageID: string;
        signature: string;
      }) {
        let message = ""
        let messageID = 0
        if (data.message && data.messageID == "1") {
          messageID = 1
          message = data.message
        } else {
          messageID = parseInt(data.messageID) 
          message = (messages.find((v) => v.id == messageID)).message
        }

        return {
          ...data,
          messageID,
          message
        }
      }

      

      return (
        <>
          <Formik
            initialValues={{
              for: data.page2 ? data.page2.for : "",
              message: "", //will be either a number or a custom message
              messageID: "0",
              signature: data.page2 ? data.page2.signature : "",
              //giftCard: data.page2 ? data.page2.giftCard : false,
            }}
            validationSchema={Yup.object({
              for: Yup.string().min(3).max(20).required(),
              
            })}
            validate={(values) => {
              const errors: any = {}
              if (parseInt(values.messageID) == 0) {
                errors.messageID = "You must select an option"
              }
              if (parseInt(values.messageID) == 1 && values.message == "") {
                errors.messageID = "You must input some text"
              }
              return errors
            }}
            onSubmit={(v) =>
              setData({
                ...data,
                
                page2: {
                  ...fixData(v),
                  giftCard: false,
                },
              })
            }
          >
            {({ values, errors }) => (
              <Form className="flex flex-col space-y-10">
                <label className="flex flex-col text-xl font-bold">
                  <span>
                    Who&apos;s this card for? <span className="text-red-500">*</span>
                  </span>
                  <Field
                    name="for"
                    type="text"
                    className="base-style form-input mt-3 max-w-sm"
                  />
                </label>
                <div>
                  <div id="create-msg" className="mb-3 text-xl font-bold">
                    <span>
                      Create your message{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <div
                    role="group"
                    aria-labelledby="create-msg"
                    className=" mb-4 flex flex-wrap gap-5 font-medium"
                  >
                    {messages.map((v) => (
                    <Tooltip text={v.message} key={v.id}>
                      <label
                        className="base-style relative flex items-center rounded-md px-2 py-1"
                        onClick={() =>
                          values.message == "Fill in longer message here"
                        }
                      >
                        {v.short}
                        <Field
                          name="messageID"
                          type="radio"
                          value={v.id.toString()}
                          className="base-style form-input ml-3 h-3 w-3 p-0 !text-gray-600 "
                        />
                      </label>
                    </Tooltip>
                    ))}
                    
                    <Tooltip text="Create your own message!">
                      <label className="base-style relative flex items-center rounded-md px-2 py-1">
                        Custom Message
                        <Field
                          name="messageID"
                          type="radio"
                          value="1"
                          className="base-style form-input ml-3 h-3 w-3 p-0 !text-gray-600 "
                        />
                      </label>
                    </Tooltip>
                  </div>
                  {values.messageID == "1" ? (
                    <label className="flex max-w-lg flex-col">
                      <Field
                        name="message"
                        type="text"
                        className="base-style form-input "
                        placeholder="Type a custom message here!"
                      />
                    </label>
                  ) : values.messageID != "0" ? (
                    <div className="flex max-w-lg flex-col">
                      <div className="base-style form-input">
                        Fill in longer message here
                      </div>
                    </div>
                  ) : (
                    <div className="flex max-w-lg flex-col">
                      <div className="base-style form-input !text-gray-500">
                        Select an option above to populate this box!
                      </div>
                    </div>
                  )}
                </div>
                <label className="flex flex-col text-xl font-bold">
                  Add Signature
                  <Field
                    name="signature"
                    type="text"
                    className="base-style form-input mt-3 max-w-sm"
                  />
                  {values.signature == "" ? (
                    <span className="mt-1 text-sm font-normal italic text-gray-500">
                      Leave this blank if you don&apos;t want to include a signature{" "}
                    </span>
                  ) : (
                    ""
                  )}
                </label>
                {/* <label className="flex flex-col text-xl font-bold">
                  Make this card a gift
                  <Field
                    name=""
                    type="text"
                    className="base-style form-input mt-3 max-w-sm"
                  />
                </label> */}
                <div className="mt-24 mb-10 ml-auto flex">
                  <Buttons />
                </div>
              </Form>
            )}
          </Formik>
        </>
      );
      function Buttons() {
        const { submitForm } = useFormikContext();
        return (
          <>
            <Button
              color="light-cyan"
              use="secondary"
              className="ring-inset"
              onClick={() => (submitForm(), setPage(1))}
            >
              Previous
            </Button>
            <Button
              color="cyan"
              use="secondary"
              className="ml-6"
              onClick={() => (submitForm(), setPage(3))}
            >
              Next
            </Button>
          </>
        );
      }
    }

    function Three() {
      return (
        <>
          <section className="">
            <h2 className="text-xl font-bold">Preview Card</h2>
          </section>
        </>
      );
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
