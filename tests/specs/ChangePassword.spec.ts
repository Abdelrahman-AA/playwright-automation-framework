import { test, expect } from "../fixtures/fixtures";
import { getCurrentPageSessionID } from "../helpers/helpers";
import { uiMSGs, validTestData } from "../test-data/testDataYamlReader";


const longTimeout: number = 120000;
const empty: string = "";

const registeredAccountUserName: string = validTestData.RegisteredAccount.UserName;
const registeredAccountPassword: string = validTestData.RegisteredAccount.Password;
const validChangeNewPassword: string = validTestData.ValidChangePassword.NewPassword;
const validChangeConfirmPassword: string = validTestData.ValidChangePassword.ConfirmNewPassword;



test.beforeEach("", async ({ page, loginService, changePasswordPage }, testInfo) => {
    let sessionID: string = await loginService.getLoginPhpSessionId(registeredAccountUserName, registeredAccountPassword);
    await loginService.injectSessionId(page, sessionID);
    await changePasswordPage.goToChangePasswordPage();

    testInfo.annotations.push({ type: 'sessionID', description: sessionID });
});



test.afterEach("", async ({ changePasswordService }, testInfo) => {
    let sessionID = testInfo.annotations.find(a => a.type === 'sessionID')?.description || "";
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

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toHaveText(uiMSGs.ChangePasswordPage.Success.Updated);
        });

        await test.step("", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


    test("Verify Password Changed Successfully When Valid Data", async ({ page, changePasswordPage, loginPage, logoutPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await changePasswordPage.staticBar.clickLogoutCTA();
        });

        await test.step("", async () => {
            await logoutPage.clickOnClickHereToLoginAgainCTA()
        });

        await test.step("", async () => {
            await expect.soft(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeNewPassword)
        });

        await test.step("", async () => {
            await expect.soft(page, "").toHaveTitle(uiMSGs.SearchHotelPage.Title);
        });

        await test.step("", async () => {
            const currentSessionId = await getCurrentPageSessionID(page);
            testInfo.annotations.push({ type: 'sessionID', description: currentSessionId });
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });

    });
});




test.describe("Negative Path Suite", { tag: "@negative @Change-Password" }, () => {


    test("Verify Password Change Error MSG Appeared When Confirm Password Is Empty", async ({ changePasswordPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, empty)
        });

        await test.step("", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toHaveText(uiMSGs.ChangePasswordPage.Errors.NewOrConfirmIsEmpty);
        });

        await test.step("", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


        test("Verify Password Not Changed When Confirm Password Is Empty", async ({ page, changePasswordPage, loginPage, logoutPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, empty)
        });

        await test.step("", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await changePasswordPage.staticBar.clickLogoutCTA();
        });

        await test.step("", async () => {
            await logoutPage.clickOnClickHereToLoginAgainCTA()
        });

        await test.step("", async () => {
            await expect.soft(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeNewPassword)
        });

        await test.step("", async () => {
            await expect.soft(page, "").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
        });

        await test.step("", async () => {
            const currentSessionId = await getCurrentPageSessionID(page);
            testInfo.annotations.push({ type: 'sessionID', description: currentSessionId });
            testInfo.annotations.push({ type: 'testPass1', description: validChangeNewPassword });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


    test("Verify Password Change Error MSG Appeared When New Password Is Empty", async ({ changePasswordPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, validChangeConfirmPassword)
        });

        await test.step("", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toHaveText(uiMSGs.ChangePasswordPage.Errors.NewOrConfirmIsEmpty);
        });

        await test.step("", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });


        test("Verify Password Not Changed When New Password Is Empty", async ({ page, changePasswordPage, loginPage, logoutPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, validChangeConfirmPassword)
        });

        await test.step("", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await changePasswordPage.staticBar.clickLogoutCTA();
        });

        await test.step("", async () => {
            await logoutPage.clickOnClickHereToLoginAgainCTA()
        });

        await test.step("", async () => {
            await expect.soft(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, validChangeConfirmPassword)
        });

        await test.step("", async () => {
            await expect.soft(page, "").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
        });

        await test.step("", async () => {
            const currentSessionId = await getCurrentPageSessionID(page);
            testInfo.annotations.push({ type: 'sessionID', description: currentSessionId });
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: validChangeConfirmPassword });
        });
    });    


        test("Verify Password Change Error MSG Appeared When New And Confirm Passwords Are Empty", async ({ changePasswordPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, empty)
        });

        await test.step("", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toHaveText(uiMSGs.ChangePasswordPage.Errors.NewOrConfirmIsEmpty);
        });

        await test.step("", async () => {
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });


        test("Verify Password Not Changed When New And Confirm Passwords Are Empty", async ({ page, changePasswordPage, loginPage, logoutPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, empty, empty)
        });

        await test.step("", async () => {
            const successMsg = changePasswordPage.getSubmitChangePasswordMSG()
            await successMsg.waitFor({ state: 'visible', timeout: longTimeout });
            await changePasswordPage.staticBar.clickLogoutCTA();
        });

        await test.step("", async () => {
            await logoutPage.clickOnClickHereToLoginAgainCTA()
        });

        await test.step("", async () => {
            await expect.soft(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(registeredAccountUserName, empty)
        });

        await test.step("", async () => {
            await expect.soft(page, "").not.toHaveTitle(uiMSGs.SearchHotelPage.Title);
            await expect.soft(page, "").toHaveTitle(uiMSGs.LoginPage.Title);
        });

        await test.step("", async () => {
            const currentSessionId = await getCurrentPageSessionID(page);
            testInfo.annotations.push({ type: 'sessionID', description: currentSessionId });
            testInfo.annotations.push({ type: 'testPass1', description: empty });
            testInfo.annotations.push({ type: 'testPass2', description: empty });
        });
    });   
});