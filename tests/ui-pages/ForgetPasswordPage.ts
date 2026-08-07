import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";

export class ForgetPasswordPage {

    // #region Locators
    private readonly backToLoginPageCta: Locator;
    private readonly emailField: Locator;
    private readonly emailPasswordButton: Locator;
    private readonly resetButton: Locator;
    private readonly afterEmailPasswordBackToLOginPage: Locator;

    private readonly successfullyEmailedPasswordMsg: Locator;
    private readonly emailFieldErrorMsg: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.backToLoginPageCta = page.locator("//a[normalize-space()='Go back to Login page']");
        this.emailField = page.locator("#emailadd_recovery");
        this.emailPasswordButton = page.locator("#Submit");
        this.resetButton = page.locator("#Reset");
        this.afterEmailPasswordBackToLOginPage = page.locator("a[href='index.php']");

        this.successfullyEmailedPasswordMsg = page.locator(".reg_success");
        this.emailFieldErrorMsg = page.locator("#emailadd_span");
    }
    // #endregion

    // #region Actions
    async goToForgetPasswordPage() {
        await this.page.goto(uiURL.ForgetPasswordPage);
    }

    async clickBackToLoginPageCta() {
        await this.backToLoginPageCta.click();
    }

    async enterEmail(email: string) {
        await this.emailField.clear();
        await this.emailField.fill(email);
    }

    async clickEmailPasswordButton() {
        await this.emailPasswordButton.click();
    }

    async clickResetButton() {
        await this.resetButton.click();
    }

    async clickBackToLOginPageAfterEmailPassword() {
        await this.afterEmailPasswordBackToLOginPage.click();
    }
    // #endregion

    // #region Getters
    getSuccessfullyEmailedPasswordMSG(): Locator {
        return this.successfullyEmailedPasswordMsg;
    }

    getEmailFieldErrorMSG(): Locator {
        return this.emailFieldErrorMsg;
    }

  async  getTextOfEmailField(): Promise<string> {
        return await this.emailField.inputValue();
    }
    // #endregion

    // #region Flows
    async enterEmailAndClickEmailPasswordButton(email: string) {
        await this.enterEmail(email);
        await this.clickEmailPasswordButton();
    }
    // #endregion
}