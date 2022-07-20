// ./app/components/ProfileCard.tsx

import { Link } from "@remix-run/react";

// type definitions for Profile response
import { Profile } from "~/utils/types";

// strapi url from environment variables
const strapiUrl = `http://localhost:1337`;

// helper function to get image url for user
// we're also using https://ui-avatars.com api to generate images
// the function appends the image url returned
const getImgUrl = ({ url, username }: { url: string | undefined; username: string | undefined | "A+N" }) =>
  url ? `${strapiUrl}${url}` : `https://ui-avatars.com/api/?name=${username?.replace(" ", "+")}&background=2563eb&color=fff`;

// component accepts `profile` prop which contains the user profile data and
// `preview` prop which indicates whether the card is used in a list or
// on its own in a dynamic page
const ProfileCard = ({ profile, preview }: { profile: Profile; preview: boolean }) => {
  console.log({ profile });

  return (
    <>
      {/* add the .preview class if `preview` == true */}
      <article className={`profile ${preview ? "preview" : ""}`}>
        <div className="wrapper">
          <div className="profile-pic-cont">
            <figure className="profile-pic img-cont">
              <img
                src={getImgUrl({ url: profile.profilePic?.formats.small.url, username: profile.username })}
                alt={`A photo of ${profile.username}`}
                className="w-full"
              />
            </figure>
          </div>
          <div className="profile-content">
            <header className="profile-header ">
              <h3 className="username">{profile.username}</h3>

              {/* show twitter name if it exists */}
              {profile.twitterUsername && (
                <a href="https://twitter.com/miracleio" className="twitter link">
                  @{profile.twitterUsername}
                </a>
              )}

              {/* show bio if it exists */}
              {profile.bio && <p className="bio">{profile.bio}</p>}
            </header>
            <ul className="links">
              {/* show title if it exists */}
              {profile.title && (
                <li className="w-icon">
                  <svg className="icon stroke" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span> {profile.title} </span>
                </li>
              )}

              {/* show website url if it exists */}
              {profile.websiteUrl && (
                <li className="w-icon">
                  <svg className="icon stroke" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <a href="http://miracleio.me" target="_blank" rel="noopener noreferrer" className="link">
                    {profile.websiteUrl}
                  </a>
                </li>
              )}
            </ul>

            {/* hide footer in preview mode */}
            {!preview && (
              <footer className="grow flex items-end justify-end pt-4">
                {profile?.slug && (
                  <Link to={profile?.slug}>
                    <button className="cta w-icon">
                      <span>View profile</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stroke" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                )}
              </footer>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default ProfileCard;
