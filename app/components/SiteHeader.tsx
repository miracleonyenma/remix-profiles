// ./app/components/SiteHeader.tsx

// import Remix's link component
import { Form, Link, useTransition } from "@remix-run/react";

// import type definitions
import { Profile } from "~/utils/types";

// component accepts `user` prop to determine if user is logged in
const SiteHeader = ({user} : {user?: Profile | undefined}) => {
  const transition = useTransition()
  return (
    <header className="site-header">
      <div className="wrapper">
        <figure className="site-logo"><Link to="/"><h1>Profiles</h1></Link></figure>
        <nav className="site-nav">
          <ul className="links">
            {/* show sign out link if user is logged in */}
            {user?.id ?
              <>
                {/* link to user profile */}
                <li>
                  <Link to={`/${user?.slug}`}> Hey, {user?.username}! </Link>
                </li>
                {/* Form component to send POST request to the sign out route */}
                <Form action="/sign-out" method="post" className="link">
                  <button type="submit" disabled={transition.state != "idle"} >
                    {transition.state == "idle" ? "Sign Out" : "Loading..."}
                  </button>
                </Form>
              </> :
              <>
                {/* show sign in and register link if user is not logged in */}
                <li className="link"><Link to="/sign-in">Sign In</Link></li>
                <li className="link"><Link to="/register">Register</Link></li>
              </>
            }
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
