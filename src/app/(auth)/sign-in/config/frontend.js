import EmailPasswordReact from 'supertokens-auth-react/recipe/emailpassword'
import ThirdPartyReact from 'supertokens-auth-react/recipe/thirdparty'
// TODO: REENABLE Email verification
// import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './appInfo'

const routerInfo = {};

export function setRouter(router, pathName) {
  routerInfo.router = router;
  routerInfo.pathName = pathName;
}

export const frontendConfig = () => {
  return {
    appInfo,
    style: `
      [data-supertokens~=row]::before {
        display: inline-block;
        width: 128px;
        height: 48px;
        content: "";
        background-image: url("vercel.svg");
        background-repeat: no-repeat;
      }
      [data-supertokens~=button] {
        background-color: #ec4899;
        border-color: #ec4899;
      }
      [data-supertokens~=button]:hover {
        background-color: #be185d;
        border-color: #be185d;
      }
      [data-supertokens~=superTokensBranding] {
        display: none;
      }
        
    `,
    recipeList: [
      ThirdPartyReact.init({
        signInAndUpFeature: {
          providers: [
            ThirdPartyReact.Google.init(),
            // ThirdPartyReact.Facebook.init(),
            // ThirdPartyReact.Github.init(),
            // ThirdPartyReact.Apple.init(),
          ],
        },
      }),
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "email",
                label: "Email",
                placeholder: "Email address",
                nonOptionalErrorMsg: "Please add your email",
              }, {
                id: "password",
                label: "Password",
                placeholder: "Password",
                nonOptionalErrorMsg: "Please add your password",
              },
              {
                id: "username",
                label: "Username",
                placeholder: "Username",
                nonOptionalErrorMsg: "Please add your username",
                validate: async (value) => {
                  if (value.length < 3) {
                    return "Username must be at least 3 characters long";
                  }
                  if (value.length > 20) {
                    return "Username must be less than 20 characters long";
                  }
                  return undefined; //means no error
                }
              },
            ]
          }
        },
      }),
      // EmailVerification.init({
      //   mode: "REQUIRED", // or "OPTIONAL"
      // }),
      SessionReact.init(),
    ],
    windowHandler: (original) => ({
      ...original,
      location: {
        ...original.location,
        getPathName: function () { return routerInfo && routerInfo.pathName ? routerInfo.pathName : undefined; },
        assign: function (url) { if (routerInfo && routerInfo.router) routerInfo.router.push(url.toString()); },
        setHref: function (url) { if (routerInfo && routerInfo.router) routerInfo.router.push(url.toString()); },
      },
    }),
  }
}