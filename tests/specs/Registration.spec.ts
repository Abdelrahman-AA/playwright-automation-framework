import { test, expect, Page } from "../fixtures/fixtures";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";
import { getRandomString } from "../helpers/helpers";

let empty: string = "";
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