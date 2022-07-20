// ./app/components/ProfileForm.tsx

import { Form, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";

// custom type declarations
import { Profile, ProfileFormProps } from "~/utils/types";

const ProfileForm = ({ profile, onModifyData, action, errors }: ProfileFormProps) => {
  // get state of form
  const transition = useTransition();

  // state for user profile data
  const [profileData, setProfileData] = useState(profile);

  // state for user login information
  const [authData, setAuthData] = useState({ email: "", password: "" });

  // helper function to set profile data value
  const updateField = (field: object) => setProfileData((value) => ({ ...value, ...field }));

  // listen to changes to the profileData state
  // run the onModifyData() function passing the profileData to it
  //  this will snd the data to the parent component
  useEffect(() => {
    // run function if `onModifyData` is passed to the component
    if (onModifyData) {
      // depending on the action passed to the form
      // select which data to send to parent when modified

      // when action == create, send both the profile data and auth data
      if (action == "create") onModifyData({ ...profileData, ...authData });
      // when action == login, send only auth data
      else if (action == "login") onModifyData(authData);
      // send profile data by default (when action == edit)
      else onModifyData(profileData);
    }
  }, [profileData, authData]);

  return (
    <Form method={action == "edit" ? "put" : "post"} className="form">
      <fieldset disabled={transition.state == "submitting"}>
        <input value={profile?.id} type="hidden" name="id" required />
        <div className="wrapper">
          {action != "login" && (
            // profile edit input forms
            <>
              <div className="form-group">
                <div className="form-control">
                  <label htmlFor="username">Name</label>
                  <input
                    onChange={(e) => updateField({ username: e.target.value })}
                    value={profileData?.username}
                    id="username"
                    name="username"
                    type="text"
                    className="form-input"
                    required
                  />
                  {errors?.username ? <em className="text-red-600">{errors.username}</em> : null}
                </div>
                <div className="form-control">
                  <label htmlFor="twitterUsername">Twitter username</label>
                  <input
                    onChange={(e) => updateField({ twitterUsername: e.target.value })}
                    value={profileData?.twitterUsername}
                    id="twitterUsername"
                    name="twitterUsername"
                    type="text"
                    className="form-input"
                    placeholder="Without the @"
                  />
                </div>
              </div>
              <div className="form-control">
                <label htmlFor="bio">Bio</label>
                <textarea
                  onChange={(e) => updateField({ bio: e.target.value })}
                  value={profileData?.bio}
                  name="bio"
                  id="bio"
                  cols={30}
                  rows={3}
                  className="form-textarea"
                ></textarea>
              </div>
              <div className="form-group">
                <div className="form-control">
                  <label htmlFor="job-title">Job title</label>
                  <input
                    onChange={(e) => updateField({ title: e.target.value })}
                    value={profileData?.title}
                    id="job-title"
                    name="job-title"
                    type="text"
                    className="form-input"
                  />
                  {errors?.title ? <em className="text-red-600">{errors.title}</em> : null}
                </div>
                <div className="form-control">
                  <label htmlFor="website">Website link</label>
                  <input
                    onChange={(e) => updateField({ websiteUrl: e.target.value })}
                    value={profileData?.websiteUrl}
                    id="website"
                    name="website"
                    type="url"
                    className="form-input"
                  />
                </div>
              </div>
            </>
          )}
          {action != "edit" && (
            // user auth input forms
            <>
              <div className="form-control">
                <label htmlFor="job-title">Email</label>
                <input
                  onChange={(e) => setAuthData((data) => ({ ...data, email: e.target.value }))}
                  value={authData.email}
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  required
                />
                {errors?.email ? <em className="text-red-600">{errors.email}</em> : null}
              </div>
              <div className="form-control">
                <label htmlFor="job-title">Password</label>
                <input
                  onChange={(e) => setAuthData((data) => ({ ...data, password: e.target.value }))}
                  value={authData.password}
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                />
                {errors?.password ? <em className="text-red-600">{errors.password}</em> : null}
              </div>
              {errors?.ValidationError ? <em className="text-red-600">{errors.ValidationError}</em> : null}
              {errors?.ApplicationError ? <em className="text-red-600">{errors.ApplicationError}</em> : null}
            </>
          )}

          <div className="action-cont mt-4">
            <button className="cta"> {transition.state == "submitting" ? "Submitting" : "Submit"} </button>
          </div>
        </div>
      </fieldset>
    </Form>
  );
};

export default ProfileForm;
