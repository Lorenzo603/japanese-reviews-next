import SuperTokens from "supertokens-node";
import ThirdPartyNode from "supertokens-node/recipe/thirdparty"
import EmailPasswordNode from "supertokens-node/recipe/emailpassword"
import SessionNode from 'supertokens-node/recipe/session'
import { appInfo } from './appInfo'
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles"
import { createUser, createUserSettings } from "@/app/components/visually-similar/registration/RegistrationHandler";
// TODO: REENABLE Email verification
// import EmailVerification from "supertokens-node/recipe/emailverification";
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: process.env.MAILGUN_EMAIL_USERNAME, key: process.env.MAILGUN_EMAIL_PASSWORD || 'key-yourkeyhere' });

export const backendConfig = () => {
  return {
    framework: "custom",
    supertokens: {
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      // connectionURI: "https://try.supertokens.com",
      connectionURI: "http://localhost:3567",
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo,
    recipeList: [
      EmailPasswordNode.init({
        signUpFeature: {
          formFields: [
            {
              id: "username",
              validate: async (value, tenantId) => {
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
        },
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // override the email password sign up function
              signUp: async function (input) {
                // some pre sign up logic

                let response = await originalImplementation.signUp(input);
                if (response.status === "OK" && response.user.loginMethods.length === 1 && input.session === undefined) {
                  createUserSettings(response.user.id);

                  // TODO: registration email
                }

                return response;
              },

            }
          },
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {

                if (originalImplementation.signUpPOST === undefined) {
                  throw Error("Should never come here");
                }

                // First we call the original implementation of signUpPOST.
                let response = await originalImplementation.signUpPOST(input);

                // Post sign up response, we check if it was successful
                if (response.status === "OK") {
                  const userId = response.user.id
                  // These are the input form fields values that the user used while signing up
                  const formFields = input.formFields;
                  const usernameField = formFields.find(field => field.id === "username");
                  const username = usernameField.value;
                  createUser(userId, username);

                }
                return response;
              }
            }
          },
        },
        emailDelivery: {
          override: (originalImplementation) => {
            return {
              ...originalImplementation,
              sendEmail: async function (input) {
                // TODO: create and send password reset email

                mg.messages.create(process.env.MAILGUN_EMAIL_DOMAIN, {
                  from: "Test email <no-reply@crownapp.com>",
                  to: ["to-email@example.com"],
                  subject: "Password Reset",
                  text: "Testing some Mailgun awesomness!",
                  html: "<h1>Testing some Mailgun awesomness!</h1> Ciao"
                })
                  .then(msg => console.log(msg)) // logs response data
                  .catch(err => console.error(err)); // logs any errors

                // Or use the original implementation which calls the default service,
                // or a service that you may have specified in the emailDelivery object.
                return originalImplementation.sendEmail(input);
              }
            }
          }
        }
      }),
      ThirdPartyNode.init({
        // We have provided you with development keys which you can use for testing.
        // IMPORTANT: Please replace them with your own OAuth keys for production use.
        signInAndUpFeature: {
          providers: [
            {
              config: {
                thirdPartyId: "google",
                clients: [{
                  clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                  clientSecret: "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"
                }]
              }
            },
            // {
            //   config: {
            //     thirdPartyId: "github",
            //     clients: [{
            //       clientId: "467101b197249757c71f",
            //       clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
            //     }]
            //   }
            // },
            // {
            //   config: {
            //     thirdPartyId: "apple",
            //     clients: [{
            //       clientId: "4398792-io.supertokens.example.service",
            //       additionalConfig: {
            //         keyId: "7M48Y4RYDL",
            //         privateKey:
            //           "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
            //         teamId: "YWQCXGJRJL",
            //       }
            //     }]
            //   }
            // },
          ],
        }
      }),
      // EmailVerification.init({
      //   mode: "REQUIRED", // or "OPTIONAL"
      //   emailDelivery: {
      //     override: (originalImplementation) => {
      //       return {
      //         ...originalImplementation,
      //         sendEmail: async function (input) {
      //           // TODO: create and send email verification email

      //           // Or use the original implementation which calls the default service,
      //           // or a service that you may have specified in the emailDelivery object.
      //           return originalImplementation.sendEmail(input);
      //         }
      //       }
      //     }
      //   },
      //   override: {
      //     apis: (oI) => {
      //       return {
      //         ...oI,
      //         verifyEmailPOST: async function (input) {
      //           if (oI.verifyEmailPOST) {
      //             let response = await oI.verifyEmailPOST(input);
      //             if (response.status === "OK") {
      //               // This will update the email of the user to the one
      //               // that was just marked as verified by the token.
      //               await EmailPassword.updateEmailOrPassword({
      //                 recipeUserId: response.user.recipeUserId,
      //                 email: response.user.email,
      //               });
      //             }
      //             return response;
      //           }
      //         },
      //       };
      //     },
      //   },
      // }),
      SessionNode.init(),
      Dashboard.init(),
      UserRoles.init(),
    ],
    isInServerlessEnv: true,
  }
}

let initialized = false;
// This function is used in your APIs to make sure SuperTokens is initialised
export function ensureSuperTokensInit() {
  if (!initialized) {
    SuperTokens.init(backendConfig());
    initialized = true;
  }
}