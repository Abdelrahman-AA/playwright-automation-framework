import { test, expect } from "../fixtures/fixtures";
import { getRandomString } from "../helpers/helpers";
import { uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


let longTimeout: number = 120000;


test.beforeEach("Navigate to Home Page", async ({ forgetPasswordPage }) => {
    await forgetPasswordPage.goToForgetPasswordPage()
});



test.describe("Happy Path Suite", { tag: "@happy @Forgot-Password" }, () => {


    test("Verify Sending Email To Reset Password When Entering Registered Email @manual-Captcha", async ({ forgetPasswordPage, registerPage }) => {
        let randomString: string = getRandomString(5);
        let userName: string = `${validTestData.ValidRegistration.UserName}${randomString}`;
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;
        let password: string = validTestData.ValidRegistration.Password;
        let fullName: string = validTestData.ValidRegistration.FullName;

        await test.step("Fill Registration Form", async () => {
            await registerPage.goToRegisterPage()
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(userName, password, password, fullName, email, true)
        });

        await test.step("", async () => {
            const successMsg = registerPage.getSuccessfullyRegistrationMsg();
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await forgetPasswordPage.goToForgetPasswordPage();
        });

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(email);
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("", async () => {
            await expect(forgetPasswordPage.getSuccessfullyEmailedPasswordMSG(), "").toBeVisible();
        });
    });



    test("Verify Still Able TO Login With Original Password While Not Reset Password From Email @manual-Captcha", async ({ loginPage, forgetPasswordPage, registerPage, page }) => {
        let randomString: string = getRandomString(5);
        let userName: string = `${validTestData.ValidRegistration.UserName}${randomString}`;
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;
        let password: string = validTestData.ValidRegistration.Password;
        let fullName: string = validTestData.ValidRegistration.FullName;

        await test.step("Fill Registration Form", async () => {
            await registerPage.goToRegisterPage()
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(userName, password, password, fullName, email, true)
        });

        await test.step("", async () => {
            const successMsg = registerPage.getSuccessfullyRegistrationMsg();
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await forgetPasswordPage.goToForgetPasswordPage();
        });

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(email);
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("", async () => {
            const successMsg = forgetPasswordPage.getSuccessfullyEmailedPasswordMSG();
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await loginPage.goToLoginPage();
        });

        await test.step("", async () => {
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(userName, password);
        });

        await test.step("", async () => {
            await expect(page, "").toHaveTitle(uiMSGs.SelectHotelPage.Title);
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset When Valid Email", async ({ forgetPasswordPage }) => {
        let randomString: string = getRandomString(5);
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(email)
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "").toEqual("");
        });
    });

    test("Verify Navigate Back To Login Page When Clicking Back To Login CTA", async ({ forgetPasswordPage, page }) => {

        test.step("", async () => {
            await forgetPasswordPage.clickBackToLoginPageCta()
        });

        await test.step("", async () => {
            await expect(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
        });
    });
});





test.describe("Happy Path Suite", { tag: "@happy @Forgot-Password" }, () => {


    test("Verify Reset Email Field When Click Reset While Email Field Is Empty", async ({ forgetPasswordPage }) => {

        await test.step("", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "").toEqual("");
        });
    });


    test("Verify Error MSG Appear When Enter Not Registered Email With MSG Statement Content", async ({ forgetPasswordPage }) => {
        let randomString: string = getRandomString(5);
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(email)
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("", async () => {
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "").toBeVisible();
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "").toHaveText(uiMSGs.ForgetPasswordPage.Errors.NotRegisteredEmail);
        });
    });


    test("Verify Error MSG Appear When Enter Empty Email With MSG Statement Content", async ({ forgetPasswordPage }) => {

        await test.step("", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("", async () => {
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "").toBeVisible();
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "").toHaveText(uiMSGs.ForgetPasswordPage.Errors.EmptyEmail);
        });
    });


    test("Verify Error MSG Appear When Enter Wrong Email Format With MSG Statement Content", async ({ forgetPasswordPage }) => {

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(inValidTestData.InvalidRegistration.WrongEmailFormat)
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("", async () => {
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "").toBeVisible();
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "").toHaveText(uiMSGs.ForgetPasswordPage.Errors.InvalidEmail);
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset When InValid Email", async ({ forgetPasswordPage }) => {

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(inValidTestData.InvalidShortRegistration.Email)
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "").toEqual("");
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset After Email Field Error MSG Appear When InValid Email Format", async ({ forgetPasswordPage }) => {

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(inValidTestData.InvalidRegistration.WrongEmailFormat)
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "").toEqual("");
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset After Email Field Error MSG Appear When Not Registered Email", async ({ forgetPasswordPage }) => {
        let randomString: string = getRandomString(5);
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;

        await test.step("", async () => {
            await forgetPasswordPage.enterEmail(email)
        });

        await test.step("", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("", async () => {
            const errorMsg = forgetPasswordPage.getEmailFieldErrorMSG();
            await errorMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await forgetPasswordPage.clickResetButton();
        });

        await test.step("", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "").toEqual("");
        });
    });
});