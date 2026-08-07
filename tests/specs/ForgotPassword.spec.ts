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

        await test.step("Navigate to Forget Password Page", async () => {
            const successMsg = registerPage.getSuccessfullyRegistrationMsg();
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await forgetPasswordPage.goToForgetPasswordPage();
        });

        await test.step("Enter Email and Click Email Password Button", async () => {
            await forgetPasswordPage.enterEmail(email);
        });

        await test.step("Click Email Password Button", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("Verify Successfully Emailed Password Message", async () => {
            await expect(forgetPasswordPage.getSuccessfullyEmailedPasswordMSG(),"Successfully emailed password message is not visible").toBeVisible();
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

        await test.step("Navigate to Forget Password Page", async () => {
            const successMsg = registerPage.getSuccessfullyRegistrationMsg();
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await forgetPasswordPage.goToForgetPasswordPage();
        });

        await test.step("Enter Email", async () => {
            await forgetPasswordPage.enterEmail(email);
        });

        await test.step("Click Email Password Button", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("Navigate to Login Page", async () => {
            const successMsg = forgetPasswordPage.getSuccessfullyEmailedPasswordMSG();
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await loginPage.goToLoginPage();
        });

        await test.step("Enter User Name and Password and Click Login Button", async () => {
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(userName, password);
        });

        await test.step("Verify Navigation to Select Hotel Page", async () => {
            await expect(page, "Navigation to Select Hotel Page failed").toHaveTitle(uiMSGs.SelectHotelPage.Title);
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset When Valid Email", async ({ forgetPasswordPage }) => {
        let randomString: string = getRandomString(5);
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;

        await test.step("Enter Email and Click Reset", async () => {
            await forgetPasswordPage.enterEmail(email)
        });

        await test.step("Click Reset Button", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("Verify Email Field Is Reset", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "Email field is not reset").toEqual("");
        });
    });

    test("Verify Navigate Back To Login Page When Clicking Back To Login CTA", async ({ forgetPasswordPage, page }) => {

        test.step("Click Back To Login CTA", async () => {
            await forgetPasswordPage.clickBackToLoginPageCta()
        });

        await test.step("Verify Navigation to Login Page", async () => {
            await expect(page, "Navigation to Login Page failed").toHaveTitle(uiMSGs.LoginPage.Title);
        });
    });
});





test.describe("Happy Path Suite", { tag: "@happy @Forgot-Password" }, () => {


    test("Verify Reset Email Field When Click Reset While Email Field Is Empty", async ({ forgetPasswordPage }) => {

        await test.step("Click Reset Button", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("Verify Email Field Is Reset", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "Email field is not reset").toEqual("");
        });
    });


    test("Verify Error MSG Appear When Enter Not Registered Email With MSG Statement Content", async ({ forgetPasswordPage }) => {
        let randomString: string = getRandomString(5);
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;

        await test.step("Enter Email", async () => {
            await forgetPasswordPage.enterEmail(email)
        });

        await test.step("Click Email Password Button", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("Verify Error Message", async () => {
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "Error message content is incorrect").toHaveText(uiMSGs.ForgetPasswordPage.Errors.NotRegisteredEmail);
        });
    });


    test("Verify Error MSG Appear When Enter Empty Email With MSG Statement Content", async ({ forgetPasswordPage }) => {

        await test.step("Click Email Password Button", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("Verify Error Message", async () => {
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "Error message content is incorrect").toHaveText(uiMSGs.ForgetPasswordPage.Errors.EmptyEmail);
        });
    });


    test("Verify Error MSG Appear When Enter Wrong Email Format With MSG Statement Content", async ({ forgetPasswordPage }) => {

        await test.step("Enter Email", async () => {
            await forgetPasswordPage.enterEmail(inValidTestData.InvalidRegistration.WrongEmailFormat)
        });

        await test.step("Click Email Password Button", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("Verify Error Message", async () => {
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(forgetPasswordPage.getEmailFieldErrorMSG(), "Error message content is incorrect").toHaveText(uiMSGs.ForgetPasswordPage.Errors.InvalidEmail);
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset When InValid Email", async ({ forgetPasswordPage }) => {

        await test.step("Enter Email", async () => {
            await forgetPasswordPage.enterEmail(inValidTestData.InvalidShortRegistration.Email)
        });

        await test.step("Click Reset Button", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("Verify Email Field Is Reset", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "Email field is not reset").toEqual("");
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset After Email Field Error MSG Appear When InValid Email Format", async ({ forgetPasswordPage }) => {

        await test.step("Enter Email", async () => {
            await forgetPasswordPage.enterEmail(inValidTestData.InvalidRegistration.WrongEmailFormat)
        });

        await test.step("Click Reset Button", async () => {
            await forgetPasswordPage.clickResetButton()
        });

        await test.step("Verify Email Field Is Reset", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "Email field is not reset").toEqual("");
        });
    });


    test("Verify Reset Email Field After Enter Email And Click Reset After Email Field Error MSG Appear When Not Registered Email", async ({ forgetPasswordPage }) => {
        let randomString: string = getRandomString(5);
        let email: string = `${randomString}${validTestData.ValidRegistration.Email}`;

        await test.step("Enter Email", async () => {
            await forgetPasswordPage.enterEmail(email)
        });

        await test.step("Click Email Password Button", async () => {
            await forgetPasswordPage.clickEmailPasswordButton()
        });

        await test.step("Verify Error Message", async () => {
            const errorMsg = forgetPasswordPage.getEmailFieldErrorMSG();
            await errorMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await forgetPasswordPage.clickResetButton();
        });

        await test.step("Verify Email Field Is Reset", async () => {
            expect(await forgetPasswordPage.getTextOfEmailField(), "Email field is not reset").toEqual("");
        });
    });
});