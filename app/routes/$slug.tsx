// ./app/routes/$slug.tsx

import { json, LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";

import { useEffect, useState } from "react";

import { updateProfile } from "~/models/profiles.server";
import { getProfileBySlug } from "~/models/profiles.server";
import { getUserData } from "~/utils/session.server";

import { Profile } from "~/utils/types";
import ProfileCard from "~/components/ProfileCard";
import ProfileForm from "~/components/ProfileForm";

// type definition of Loader data
type Loaderdata = {
  userData: Awaited<ReturnType<typeof getUserData>>;
  profile: Awaited<ReturnType<typeof getProfileBySlug>>;
};

// action data type
type EditActionData =
  | {
      id: string | null;
      username: string | null;
      title: string | null;
    }
  | undefined;

// loader function to get posts by slug
export const loader: LoaderFunction = async ({ params, request }) => {
  return json<Loaderdata>({
    userData: await getUserData(request),
    profile: await getProfileBySlug(params.slug),
  });
};

// action to handle form submission
export const action: ActionFunction = async ({ request }) => {
  // get user data
  const data = await getUserData(request)

  // get request form data
  const formData = await request.formData();

  // get form values
  const id = formData.get("id");
  const username = formData.get("username");
  const twitterUsername = formData.get("twitterUsername");
  const bio = formData.get("bio");
  const title = formData.get("job-title");
  const websiteUrl = formData.get("website");
  console.log({ id, username, twitterUsername, bio, title, websiteUrl });
  // const user = await requireUser(request);
  // console.log({ from: "sess", user });

  // error object
  // each error property is assigned null if it has a value
  const errors: EditActionData = {
    id: id ? null : "Id is required",
    username: username ? null : "username is required",
    title: title ? null : "title is required",
  };

  // return true if any property in the error object has a value
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  // return the error object
  if (hasErrors) return json<EditActionData>(errors);

  // run the update profile function
  // pass the user jwt to the function
  await updateProfile({ id, username, twitterUsername, bio, title, websiteUrl }, data?.jwt);

  // redirect users to home page
  return null;
};

const Profile = () => {
  const { profile, userData } = useLoaderData() as Loaderdata;
  const errors = useActionData();

  const [profileData, setprofileData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  console.log({ userData, profile });

  // useEffect(() => {
  //   console.log({ profileData });
  // }, [profileData]);

  return (
    <section className="site-section">
      <div className="wrapper flex items-center py-16 min-h-[calc(100vh-4rem)]">
        <div className="profile-cont w-full max-w-5xl m-auto">
          {profileData ? (
            <>
              {/* Profile card with `preview` = true */}
              <ProfileCard profile={profileData} preview={true} />

              {/* list of actions */}
              <ul className="actions">
                <li className="action">
                  <button className="cta w-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stroke" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span>Share</span>
                  </button>
                </li>
                {userData?.user?.id == profile.id && (
                  <li className="action">
                    <button onClick={() => setIsEditing(!isEditing)} className="cta w-icon">
                      {!isEditing ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon stroke" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon stroke" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}

                      <span>{!isEditing ? "Edit" : "Cancel"}</span>
                    </button>
                  </li>
                )}
              </ul>
            </>
          ) : (
            <p className="text-center">Oops, that profile doesn't exist... yet</p>
          )}

          {/* display dynamic form component when user clicks on edit */}
          {userData?.user?.id == profile?.id && isEditing && (
            <ProfileForm errors={errors} profile={profile} action={"edit"} onModifyData={(value: Profile) => setprofileData(value)} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
