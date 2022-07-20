// ./app/routes/register.tsx

import { ActionFunction, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import ProfileForm from "~/components/ProfileForm";
import { register } from "~/models/profiles.server";
import { createUserSession } from "~/utils/session.server";
import { ErrorResponse, RegisterActionData } from "~/utils/types";

export const action: ActionFunction = async ({ request }) => {
  try {
    // get request form data
    const formData = await request.formData();

    // get form input values
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");
    const title = formData.get("job-title");
    const twitterUsername = formData.get("twitterUsername");
    const bio = formData.get("bio");
    const websiteUrl = formData.get("website");

    const errors: RegisterActionData = {
      email: email ? null : "Email is required",
      password: password ? null : "Password is required",
      username: username ? null : "Username is required",
      title: title ? null : "Job title is required",
    };

    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

    if (hasErrors) throw errors;

    console.log({ email, password, username, title, twitterUsername, bio, websiteUrl });

    // function to register user with user details
    const { jwt, user, error } = await register({ email, password, username, title, twitterUsername, bio, websiteUrl });
    console.log({ jwt, user, error });

    // throw strapi error message if strapi returns an error
    if (error) throw { [error.name]: error.message };

    // create user session
    return createUserSession({ jwt, user }, "/");
  } catch (error) {
    // return error response
    return json(error);
  }
};

const Register = () => {
  const errors = useActionData();
  console.log({ errors });

  return (
    <section className="site-section profiles-section">
      <div className="wrapper">
        <header className="section-header">
          <h2 className="text-4xl">Register</h2>
          <p>Create a new profile</p>
        </header>

        {/* set form action to `login` and pass errors if any */}
        <ProfileForm action="create" errors={errors} />
      </div>
    </section>
  );
};

export default Register;
