import { ActionFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import ProfileForm from "~/components/ProfileForm";
import { signIn } from "~/models/profiles.server";
import { createUserSession } from "~/utils/session.server";
import { ErrorResponse, LoginActionData, LoginErrorResponse } from "~/utils/types";

export const action: ActionFunction = async ({ request }) => {
  try {
    // get request form data
    const formData = await request.formData();

    // get form values
    const identifier = formData.get("email");
    const password = formData.get("password");

    console.log({ identifier, password });

    // error object
    // each error property is assigned null if it has a value
    const errors: LoginActionData = {
      identifier: identifier ? null : "Email is required",
      password: password ? null : "Password is required",
    };

    // return true if any property in the error object has a value
    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

    //
    console.log({ hasErrors });

    // throw the errors object if any error
    if (hasErrors) throw errors;

    console.log({ identifier, password });

    // sign in user with identifier and password
    let { jwt, user, error } = await signIn({ identifier, password });

    console.log({ jwt, user, error });

    // throw strapi error message if strapi returns an error
    if (error) throw { [error.name]: error.message };

    // create user session
    return createUserSession({ jwt, user }, "/");
  } catch (error) {
    // return error response
    return json<LoginErrorResponse>(error);
  }
};

const Login = () => {
  const errors = useActionData();
  console.log({ errors });

  return (
    <section className="site-section profiles-section">
      <div className="wrapper">
        <header className="section-header">
          <h2 className="text-4xl">Sign in </h2>
          <p>You have to log in to edit your profile</p>
        </header>

        {/* set form action to `login` and pass errors if any */}
        <ProfileForm action="login" errors={errors} />
      </div>
    </section>
  );
};

export default Login;
