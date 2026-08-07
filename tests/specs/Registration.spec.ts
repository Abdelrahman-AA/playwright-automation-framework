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

        await test.step("", async () => {
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

        await test.step("", async () => {
            [newPage] = await Promise.all([
                context.waitForEvent('page'),
                registerPage.clickTermsAndConditionsCTA()
            ]);
            await newPage.waitForLoadState();
        });

        await test.step("", async () => {
            await expect.soft(newPage).toHaveURL(uiURL.TermsConditionsPage)
        });

        await test.step("", async () => {
            await expect.soft(newPage).toHaveTitle(uiMSGs.TermsConditionsPage.Title)
        });
    });


    test("Verify Input Fields Cleared After Click Reset", async ({ registerPage }) => {

        await test.step("", async () => {
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

        await test.step("", async () => {
            await registerPage.clickResetButton()

        });

        await test.step("", async () => {
            expect.soft(await registerPage.getAllFieldsTextAndTermsCondition()).toContainEqual("");
            expect.soft(await registerPage.getAllFieldsTextAndTermsCondition()).toContainEqual(false);
        });
    });


    test("Verify Successfully Registration @manual-Captcha", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("", async () => {
            await registerPage.fillRegistrationFormAndOptionalClickSubmit(
                `${validTestData.ValidRegistration.UserName}${randomString}`,
                validTestData.ValidRegistration.Password,
                validTestData.ValidRegistration.ConfirmPassword,
                validTestData.ValidRegistration.FullName,
                `${randomString}${validTestData.ValidRegistration.Email}`,
                true,
            )
        });

        await test.step("", async () => {
            await expect.soft(registerPage.getSuccessfullyRegistrationMsg()).toBeVisible({ timeout: longTimeout });
            await expect.soft(registerPage.getSuccessfullyRegistrationMsg()).toHaveText(uiMSGs.RegisterPage.Success.Registration);
        });
    });
});




test.describe("Happy Path Suite", { tag: "@happy @Registration" }, () => {


    test("Verify Error MSG For Register With Empty Data", async ({ registerPage }) => {

        await test.step("", async () => {
            await registerPage.clickRegisterButton();
        });

        await test.step("", async () => {
            await expect.soft(registerPage.getUserNameErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getUserNameErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.EmptyUserName);

            await expect.soft(registerPage.getPasswordErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getPasswordErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.EmptyPassword);

            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.EmptyConfirmPassword);

            await expect.soft(registerPage.getFullNameErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getFullNameErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.EmptyFullName);

            await expect.soft(registerPage.getEmailErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getEmailErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.EmptyEmail);

            await expect.soft(registerPage.getCaptchaErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getCaptchaErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.EmptyCaptcha);

            await expect.soft(registerPage.getMustAgreeTermsErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getMustAgreeTermsErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.NotAgreeTerms);
        });
    });


    test("Verify Error Msg For Wrong Email Format", async ({ registerPage }) => {

        await test.step("", async () => {
            await registerPage.enterEmail(inValidTestData.InvalidRegistration.WrongEmailFormat);
        });

        await test.step("", async () => {
            await registerPage.clickRegisterButton()
        });

        await test.step("", async () => {
            await expect.soft(registerPage.getEmailErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getEmailErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.InvalidEmail);
        });
    });


    test("Verify Error Msg For Wrong Captcha", async ({ registerPage }) => {

        await test.step("", async () => {
            await registerPage.enterCaptchaText(inValidTestData.InvalidRegistration.Captcha);
        });

        await test.step("", async () => {
            await registerPage.clickRegisterButton()
        });

        await test.step("", async () => {
            await expect.soft(registerPage.getCaptchaErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getCaptchaErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.InvalidCaptcha);
        });
    });


    test("Verify Error MSG For Entering Short Data But With Valid Email For Registration", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("", async () => {
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

        await test.step("", async () => {
            await expect.soft(registerPage.getUserNameErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getUserNameErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.ShortUserName);

            await expect.soft(registerPage.getPasswordErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getPasswordErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.ShortPassword);

            await expect.soft(registerPage.getFullNameErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getFullNameErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.ShortFullName);

            await expect.soft(registerPage.getCaptchaErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getCaptchaErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.InvalidCaptcha);
        });
    });


    test("Verify Error MSG For Miss Match Password Confirmation At Registration", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("", async () => {
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

        await test.step("", async () => {
            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getConfirmPasswordErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.ConfirmPasswordNotMatch);
        });
    });


    test("Verify Error MSG For Registered User Name At Registration", async ({ registerPage }) => {
        let randomString: string = getRandomString(5);

        await test.step("", async () => {
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

        await test.step("", async () => {
            await expect.soft(registerPage.getUserNameErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getUserNameErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.UsedUserName);
        });
    });


    test.only("Verify Error MSG For Registered Email At Registration", async ({ registerPage }) => {

        await test.step("", async () => {
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

        await test.step("", async () => {
            await expect.soft(registerPage.getEmailErrorMSG(), "").toBeVisible();
            await expect.soft(registerPage.getEmailErrorMSG(), "").toHaveText(uiMSGs.RegisterPage.Errors.UsedEmail);
        });
    });
});