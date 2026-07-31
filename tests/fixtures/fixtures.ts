import { test as baseTest, expect } from "@playwright/test";
import { LoginPage } from "../ui-pages/LoginPage";

type MyFixtures = {
    loginPage: LoginPage
}

export const test = baseTest.extend<MyFixtures>({
    loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
});

export { expect } from '@playwright/test';