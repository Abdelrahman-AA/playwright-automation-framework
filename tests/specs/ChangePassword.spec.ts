import { test, expect } from "../fixtures/fixtures";
import { uiMSGs, validTestData } from "../test-data/testDataYamlReader";
import { getCurrentPageSessionID } from "../helpers/helpers";


const registeredAccountPassword: string = validTestData.RegisteredAccount.Password;
const validChangeNewPassword: string = validTestData.ValidChangePassword.NewPassword;
const validChangeConfirmPassword: string = validTestData.ValidChangePassword.ConfirmNewPassword;



test.beforeEach("", async ({ page, changePasswordPage }, testInfo) => {
    await changePasswordPage.goToChangePasswordPage();
    const currentSessionID = await getCurrentPageSessionID(page.request);

    testInfo.annotations.push({ type: 'currentSessionID', description: currentSessionID });
});



test.afterEach("", async ({ changePasswordService }, testInfo) => {
const currentSessionID = testInfo.annotations.find(a => a.type === 'currentSessionID')?.description || "";
    const testPass1 = testInfo.annotations.find(a => a.type === 'testPass1')?.description || "";
    const testPass2 = testInfo.annotations.find(a => a.type === 'testPass2')?.description || "";

    await changePasswordService.changePassword(
        currentSessionID,
        testPass1,
        registeredAccountPassword,
        registeredAccountPassword);

    await changePasswordService.changePassword(
        currentSessionID,
        testPass2,
        registeredAccountPassword,
        registeredAccountPassword);
});




test.describe("Happy Path Suite", { tag: "@happy @Change-Password" }, () => {


    test.only("Verify Password Change Successfully MSG When Valid Data", async ({ changePasswordPage }, testInfo) => {

        await test.step("", async () => {
            await changePasswordPage.enterCurrentAndNewAndConfirmPasswordsAndSubmit(registeredAccountPassword, validChangeNewPassword, validChangeConfirmPassword)
        });

        await test.step("", async () => {
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toBeVisible();
            await expect.soft(changePasswordPage.getSubmitChangePasswordMSG(), "").toHaveText(uiMSGs.ChangePasswordPage.Success.Updated);
        });

        await test.step("", async () => {
            let testPass1 = validChangeNewPassword;
            let testPass2 = validChangeConfirmPassword;
            testInfo.annotations.push({ type: 'testPass1', description: testPass1 });
            testInfo.annotations.push({ type: 'testPass2', description: testPass2 });
        });
    });

});