import { test, expect, Page } from "../fixtures/fixtures";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";
import { getRandomString } from "../helpers/helpers";

let longTimeout: number = 120000;


test.beforeEach("Navigate to Home Page", async ({ registerPage }) => {
    await registerPage.goToRegisterPage();
});


test.describe("Happy Path Suite", { tag: "@happy @Registration" }, () => {


    test("Verify Registration Page Opened", async ({ page }) => {

        await test.step("Verify Registration Page URL", async () => {
            await expect.soft(page, "Registration Page URL does not match expected URL").toHaveURL(uiURL.RegisterPage);
        });

        await test.step("Registration Page Title", async () => {
            await expect.soft(page, "Registration Page Title does not match expected Title").toHaveTitle(uiMSGs.RegisterPage.Title);
        });
    });


    test("Verify Going Back To Home Page From CTA", async ({ page, registerPage }) => {

        await test.step("Click Back to Login Page CTA", async () => {
            registerPage.clickBackToLoginPageCTA()
        });

        await test.step("Verify Home Page URL", async () => {
            await expect.soft(page, "Home Page URL does not match expected URL").toHaveURL(`${uiURL.LoginPage}index.php`);
        });

        await test.step("Login Page Page Title", async () => {
            await expect.soft(page, "Login Page Title does not match expected Title").toHaveTitle(uiMSGs.LoginPage.Title);
        });
    });


    test("Verify Opening Terms Page From Registration Page CTA", async ({ context, registerPage }) => {
        let newPage: Page;

        await test.step("Click Terms and Conditions CTA", async () => {
            [newPage] = await Promise.all([
                context.waitForEvent('page'),
                registerPage.clickTermsAndConditionsCTA()
            ]);
            await newPage.waitForLoadState();
        });

        await test.step("Verify Terms and Conditions Page URL", async () => {
            await expect.soft(newPage, "Terms and Conditions Page URL does not match expected URL").toHaveURL(uiURL.TermsConditionsPage)
        });

        await test.step("Verify Terms and Conditions Page Title", async () => {
            await expect.soft(newPage, "Terms and Conditions Page Title does not match expected Title").toHaveTitle(uiMSGs.TermsConditionsPage.Title)
        });
    });


    test("Verify Input Fields Cleared After Click Reset", async ({ registerPage }) => {

        await test.step("Fill Registration Form", async () => {
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(
                validTestData.ValidRegistration.UserName,
                validTestData.ValidRegistration.Password,
                validTestData.ValidRegistration.ConfirmPassword,
                validTestData.ValidRegistration.FullName,
                validTestData.ValidRegistration.Email,
                true,
                validTestData.ValidRegistration.Captcha,
            );
        });

        await test.step("Click Reset Button", async () => {
            await registerPage.clickResetButton()

        });

        await test.step("Verify Input Fields Are Cleared", async () => {
            expect.soft(await registerPage.getAllFieldsTextAndTermsCondition(), "Input fields are not cleared").toContainEqual("");
            expect.soft(await registerPage.getAllFieldsTextAndTermsCondition(), "Terms and conditions checkbox is not unchecked").toContainEqual(false);
        });
    });


    test("Verify Successfully Registration @manual-Captcha", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("Fill Registration Form", async () => {
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(
                `${validTestData.ValidRegistration.UserName}${randomString}`,
                validTestData.ValidRegistration.Password,
                validTestData.ValidRegistration.ConfirmPassword,
                validTestData.ValidRegistration.FullName,
                `${randomString}${validTestData.ValidRegistration.Email}`,
                true,
            )
        });

        await test.step("Verify Success Message", async () => {
            await expect.soft(registerPage.getSuccessfullyRegistrationMsg(), "Success message is not visible").toBeVisible({ timeout: longTimeout });
            await expect.soft(registerPage.getSuccessfullyRegistrationMsg(), "Success message does not match expected text").toHaveText(uiMSGs.RegisterPage.Success.Registration);
        });
    });
});




test.describe("Happy Path Suite", { tag: "@happy @Registration" }, () => {


    test("Verify Error MSG For Register With Empty Data", async ({ registerPage }) => {

        await test.step("Click Register Button", async () => {
            await registerPage.clickRegisterButton();
        });

        await test.step("Verify Error Messages", async () => {
            await expect.soft(registerPage.getUserNameErrorMSG(), "User name error message is not visible").toBeVisible();
            await expect.soft(registerPage.getUserNameErrorMSG(), "User name error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.EmptyUserName);

            await expect.soft(registerPage.getPasswordErrorMSG(), "Password error message is not visible").toBeVisible();
            await expect.soft(registerPage.getPasswordErrorMSG(), "Password error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.EmptyPassword);

            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "Confirm password error message is not visible").toBeVisible();
            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "Confirm password error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.EmptyConfirmPassword);

            await expect.soft(registerPage.getFullNameErrorMSG(), "Full name error message is not visible").toBeVisible();
            await expect.soft(registerPage.getFullNameErrorMSG(), "Full name error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.EmptyFullName);

            await expect.soft(registerPage.getEmailErrorMSG(), "Email error message is not visible").toBeVisible();
            await expect.soft(registerPage.getEmailErrorMSG(), "Email error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.EmptyEmail);

            await expect.soft(registerPage.getCaptchaErrorMSG(), "Captcha error message is not visible").toBeVisible();
            await expect.soft(registerPage.getCaptchaErrorMSG(), "Captcha error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.EmptyCaptcha);

            await expect.soft(registerPage.getMustAgreeTermsErrorMSG(), "Terms and conditions error message is not visible").toBeVisible();
            await expect.soft(registerPage.getMustAgreeTermsErrorMSG(), "Terms and conditions error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.NotAgreeTerms);
        });
    });


    test("Verify Error Msg For Wrong Email Format", async ({ registerPage }) => {

        await test.step("Enter Invalid Email Format", async () => {
            await registerPage.enterEmail(inValidTestData.InvalidRegistration.WrongEmailFormat);
        });

        await test.step("Click Register Button", async () => {
            await registerPage.clickRegisterButton()
        });

        await test.step("Verify Email Error Message", async () => {
            await expect.soft(registerPage.getEmailErrorMSG(), "Email error message is not visible").toBeVisible();
            await expect.soft(registerPage.getEmailErrorMSG(), "Email error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.InvalidEmail);
        });
    });


    test("Verify Error Msg For Wrong Captcha", async ({ registerPage }) => {

        await test.step("Enter Invalid Captcha", async () => {
            await registerPage.enterCaptchaText(inValidTestData.InvalidRegistration.Captcha);
        });

        await test.step("Click Register Button", async () => {
            await registerPage.clickRegisterButton()
        });

        await test.step("Verify Captcha Error Message", async () => {
            await expect.soft(registerPage.getCaptchaErrorMSG(), "Captcha error message is not visible").toBeVisible();
            await expect.soft(registerPage.getCaptchaErrorMSG(), "Captcha error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.InvalidCaptcha);
        });
    });


    test("Verify Error MSG For Entering Short Data But With Valid Email For Registration", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("Fill Registration Form With Invalid Data", async () => {
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(
                inValidTestData.InvalidShortRegistration.UserName,
                inValidTestData.InvalidShortRegistration.Password,
                inValidTestData.InvalidShortRegistration.ConfirmPassword,
                inValidTestData.InvalidShortRegistration.FullName,
                `${randomString}${validTestData.ValidRegistration.Email}`,
                true,
                inValidTestData.InvalidShortRegistration.RandomCaptcha,
                true)
        });

        await test.step("Verify Error Messages", async () => {
            await expect.soft(registerPage.getUserNameErrorMSG(), "User name error message is not visible").toBeVisible();
            await expect.soft(registerPage.getUserNameErrorMSG(), "User name error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.ShortUserName);

            await expect.soft(registerPage.getPasswordErrorMSG(), "Password error message is not visible").toBeVisible();
            await expect.soft(registerPage.getPasswordErrorMSG(), "Password error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.ShortPassword);

            await expect.soft(registerPage.getFullNameErrorMSG(), "Full name error message is not visible").toBeVisible();
            await expect.soft(registerPage.getFullNameErrorMSG(), "Full name error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.ShortFullName);

            await expect.soft(registerPage.getCaptchaErrorMSG(), "Captcha error message is not visible").toBeVisible();
            await expect.soft(registerPage.getCaptchaErrorMSG(), "Captcha error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.InvalidCaptcha);
        });
    });


    test("Verify Error MSG For Miss Match Password Confirmation At Registration", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("Fill Registration Form With Invalid Data", async () => {
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(
                `${validTestData.ValidRegistration.UserName}${randomString}`,
                validTestData.ValidRegistration.Password,
                inValidTestData.InvalidRegistration.MismatchConfirmPassword,
                validTestData.ValidRegistration.FullName,
                `${randomString}${validTestData.ValidRegistration.Email}`,
                true,
                inValidTestData.InvalidRegistration.Captcha,
                true)
        });

        await test.step("Verify Error Messages", async () => {
            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "Confirm password error message is not visible").toBeVisible();
            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "Confirm password error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.ConfirmPasswordNotMatch);
        });
    });


    test("Verify Error MSG For Registered User Name At Registration", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("Fill Registration Form With Invalid Data", async () => {
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(
                validTestData.RegisteredAccount.UserName,
                validTestData.ValidRegistration.Password,
                validTestData.ValidRegistration.ConfirmPassword,
                validTestData.ValidRegistration.FullName,
                `${randomString}${validTestData.ValidRegistration.Email}`,
                true,
                inValidTestData.InvalidRegistration.Captcha,
                true)
        });

        await test.step("Verify Error Messages", async () => {
            await expect.soft(registerPage.getUserNameErrorMSG(), "User name error message is not visible").toBeVisible();
            await expect.soft(registerPage.getUserNameErrorMSG(), "User name error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.UsedUserName);
        });
    });


    test.only("Verify Error MSG For Registered Email At Registration", async ({ registerPage }) => {

        await test.step("Fill Registration Form With Invalid Data", async () => {
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(
                validTestData.ValidRegistration.UserName,
                validTestData.ValidRegistration.Password,
                validTestData.ValidRegistration.ConfirmPassword,
                validTestData.ValidRegistration.FullName,
                validTestData.RegisteredAccount.email,
                true,
                inValidTestData.InvalidRegistration.Captcha,
                true)
        });

        await test.step("Verify Error Messages", async () => {
            await expect.soft(registerPage.getEmailErrorMSG(), "Email error message is not visible").toBeVisible();
            await expect.soft(registerPage.getEmailErrorMSG(), "Email error message does not match expected text").toHaveText(uiMSGs.RegisterPage.Errors.UsedEmail);
        });
    });
});