import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
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
    recipeList: [
      ThirdPartyEmailPasswordReact.init({
        signInAndUpFeature: {
          providers: [
            ThirdPartyEmailPasswordReact.Google.init(),
            ThirdPartyEmailPasswordReact.Facebook.init(),
            ThirdPartyEmailPasswordReact.Github.init(),
            ThirdPartyEmailPasswordReact.Apple.init(),
          ],
        },
      }),
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