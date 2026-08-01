// import { APIRequestContext } from '@playwright/test';
// import { testData } from '../test-data/testDataYamlReader';

// export class NewAccountRegistrationService {
//     private request: APIRequestContext;

//     constructor(request: APIRequestContext) {
//         this.request = request;
//     }

//     async newAccountRegistration(username: string, password: string, rePassword: string, fullName: string, email: string) {
//         await this.request.get(testData.Pages.RegisterPage.URL);
//         const storage = await this.request.storageState();
//         const sessionCookie = storage.cookies.find(c => c.name === 'PHPSESSID');
//         const cookieValue = sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '';

//         const response = await this.request.post((testData.Pages.RegisterPage.URL), {
//             headers: {
//                 'Cookie': cookieValue,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             form: {
//                 username: username,
//                 password: password,
//                 re_password: rePassword,
//                 full_name: fullName,
//                 email_add: email,
//                 captcha: "",
//                 'ct-captcha': "",
//                 tnc_box: "1",
//                 Submit: "Register"
//             },
//         });

//         return response;
//     }
// }