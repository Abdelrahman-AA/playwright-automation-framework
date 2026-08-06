import { test, expect } from "../fixtures/fixtures";
import { uiMSGs, validTestData } from "../test-data/testDataYamlReader";



test.describe("Happy Path Suite", { tag: "@happy @Forgot-Password" }, () => {


    test("Verify Sending Email To Reset Password When Entering Registered Email", async ({forgetPasswordPage}) => {
        
        await test.step("", async () => {
            // forgetPasswordPage.enterEmail(validTestData.)
        });
    });
});