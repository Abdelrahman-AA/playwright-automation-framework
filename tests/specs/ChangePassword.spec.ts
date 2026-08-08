import { test, expect } from "../fixtures/fixtures";
import { uiMSGs, validTestData, uiURL, inValidTestData } from "../test-data/testDataYamlReader";
import { LoginPage } from "../ui-pages/LoginPage";


const longTimeout: number = 60000;
const empty: string = "";

const registeredAccountUserName: string = validTestData.RegisteredAccount.UserName;
const registeredAccountPassword: string = validTestData.RegisteredAccount.Password;

const validChangeNewPassword: string = validTestData.ValidChangePassword.NewPassword;
const validChangeConfirmPassword: string = validTestData.ValidChangePassword.ConfirmNewPassword;

const inValidShortNewAndConfirmPassword: string = inValidTestData.InvalidShortChangePassword;
const invalidNotMatchChangePassword: string = inValidTestData.InvalidNotMatchChangePassword;

const invalidCurrentPassword: string=inValidTestData.InvalidCurrentPassword;



test.beforeEach("Setup change password page", async ({ page, loginService, changePasswordPage }, testInfo) => {
    const sessionID: string = await loginService.getLoginPhpSessionId(registeredAccountUserName, registeredAccountPassword);
    await loginService.injectSessionId(page, sessionID);
    await changePasswordPage.goToChangePasswordPage();

    testInfo.annotations.push({ type: 'sessionID', description: sessionID });
});



test.afterEach("Clean up after change password test", async ({ changePasswordService }, testInfo) => {
    const sessionID = testInfo.annotations.find(a => a.type === 'sessionID')?.description || "";
    const testPass1 = testInfo.annotations.find(a => a.type === 'testPass1')?.description || "";
    const testPass2 = testInfo.annotations.find(a => a.type === 'testPass2')?.description || "";

    await changePasswordService.changePassword(
        sessionID,
        testPass1,
        registeredAccountPassword,
        registeredAccountPassword);

    await changePasswordService.changePassword(
        sessionID,
        testPass2,
        registeredAccountPassword,
        registeredAccountPassword);
});




test.describe("Happy Path Suite", { tag: "@happy @Change-Password" }, () => {


    test("Verify Password Change Successfully MSG Appeared When Valid Data", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter valid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("Verify success message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Success message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Success message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Success.Updated);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


    test("Verify Password Changed Successfully When Valid Data", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter valid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("Wait for success message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password change was successful", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage)
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeNewPassword)

            await expect.soft(newPage, "Password change was not successful").toHaveTitle(uiMSGs.SearchHotelPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });
});




test.describe("Negative Path Suite", { tag: "@negative @Change-Password" }, () => {


    test("Verify Password Change Error MSG Appeared When Confirm Password Is Empty", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, empty)
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.NewOrConfirmIsEmpty);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


    test("Verify Password Not Changed When Confirm Password Is Empty", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, empty)
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage)
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeNewPassword)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


    test("Verify Password Change Error MSG Appeared When New Password Is Empty", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, validChangeConfirmPassword)
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.NewOrConfirmIsEmpty);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


    test("Verify Password Not Changed When New Password Is Empty", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, validChangeConfirmPassword)
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeConfirmPassword)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


    test("Verify Password Change Error MSG Appeared When New And Confirm Passwords Are Empty", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, empty)
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.NewOrConfirmIsEmpty);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


    test("Verify Password Not Changed When New And Confirm Passwords Are Empty", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, empty)
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, empty)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


    test("Verify Password Change Error MSG Appeared When New Password Is InValid Short", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, inValidShortNewAndConfirmPassword, inValidShortNewAndConfirmPassword)
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.ShortPassWord);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: inValidShortNewAndConfirmPassword });
            testInfo.annotations.push({ type: 'testPass2', description: inValidShortNewAndConfirmPassword });
        });
    });


    test("Verify Password Not Changed When New Password Is InValid Short", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, inValidShortNewAndConfirmPassword, inValidShortNewAndConfirmPassword)
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, inValidShortNewAndConfirmPassword)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: inValidShortNewAndConfirmPassword });
            testInfo.annotations.push({ type: 'testPass2', description: inValidShortNewAndConfirmPassword });
        });
    });


    test("Verify Password Change Error MSG Appeared When New Password Miss Match Confirm Password", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, invalidNotMatchChangePassword)
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.MismatchConfirmation);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: invalidNotMatchChangePassword });
        });
    });


    test("Verify Password Not Changed When New Password Miss Match Confirm Password By Both Miss Matched Passwords", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, invalidNotMatchChangePassword)
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeNewPassword)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, invalidNotMatchChangePassword)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: invalidNotMatchChangePassword });
        });
    });


        test("Verify Password Change Error MSG Appeared When Current Password Is Wrong", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(invalidCurrentPassword, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.WrongCurrentPassword);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


    test("Verify Password Not Changed When Current Password Is Wrong", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(invalidCurrentPassword, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeNewPassword)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


            test("Verify Password Change Error MSG Appeared When Current Password Is Empty", async ({ changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(empty, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.WrongCurrentPassword);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


    test("Verify Password Not Changed When Current Password Is Empty", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Enter invalid password details and submit", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(empty, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeNewPassword)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


                test("Verify Password Change Error MSG Appeared When Submit With Empty Fields", async ({ changePasswordPage }, testInfo) => {

        await test.step("Click submit button", async () => {
            await changePasswordPage.clickSubmitButton()
        });

        await test.step("Verify error message is displayed", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message is not visible").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "Error message text is incorrect").toHaveText(uiMSGs.ChangePasswordPage.Errors.WrongCurrentPassword);
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


    test("Verify Password Not Changed When When Submit With Empty Fields", async ({ page, changePasswordPage }, testInfo) => {

        await test.step("Click submit button", async () => {
            await changePasswordPage.clickSubmitButton();
        });

        await test.step("Wait for error message", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
        });

        await test.step("Verify password was not changed", async () => {
            const newPage = await page.context().newPage();
            await newPage.goto(uiURL.LoginPage);
            const newLoginPage = new LoginPage(newPage);
            await newLoginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, empty)

            await expect.soft(newPage, "Password was incorrectly changed").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(newPage, "Login page title is incorrect").toHaveTitle(uiMSGs.LoginPage.Title);

            await newPage.close();
            await page.bringToFront();
        });

        await test.step("Store test data for cleanup", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });
});