import { test, expect } from "../fixtures/fixtures";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";

test.describe("Happy Path Suite", { tag: "@happy" }, () => {

    test.beforeEach("Login and Get Session ID", async ({ loginPage }) => {
        await loginPage.goToLoginPage();
    });
});