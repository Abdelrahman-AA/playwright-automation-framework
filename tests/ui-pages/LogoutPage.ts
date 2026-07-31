import { Locator, Page } from "@playwright/test";

export class LogoutPage {

    // #region Locators
    private readonly successfullyLoggedOutMsg: Locator;
    private readonly clickHereToLoginAgainCTA: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.successfullyLoggedOutMsg = page.locator("td.reg_success");
        this.clickHereToLoginAgainCTA = page.locator("//a[normalize-space()='Click here to login again']");
    }
    // #endregion

    // #region Actions
    async clickOnClickHereToLoginAgainCTA() {
        await this.clickHereToLoginAgainCTA.click();
    }
    // #endregion

    // #region Getters
    getSuccessfullyLoggedOutMSG(): Locator {
        return this.successfullyLoggedOutMsg;
    }
    // #endregion
}