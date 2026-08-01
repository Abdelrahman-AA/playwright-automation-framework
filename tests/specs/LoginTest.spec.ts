import { test, expect } from "../fixtures/fixtures"; 
import { uiURL } from "../test-data/testDataYamlReader";

test.describe("Happy Path Suite", { tag: "@happy" }, () => {

    test('Verify Home Page Opened', async ({ page, loginPage }) => {
        
        await test.step("Navigate to Home Page", async () => {
            await loginPage.goToLoginPage();
        });

        await test.step("Verify Home Page URL", async () => {
            await expect(page, "Home Page URL does not match expected URL.").toHaveURL(uiURL.LoginPage);
        });

    });

    

});