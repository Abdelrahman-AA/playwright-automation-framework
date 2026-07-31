import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";

export class ChangePasswordPage {

    // #region Locators
    private readonly currentPasswordField: Locator;
    private readonly newPasswordField: Locator;
    private readonly confirmPasswordField: Locator;
    private readonly submitButton: Locator;
    private readonly submitChangePasswordMsg: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.currentPasswordField = page.locator("#current_pass");
        this.newPasswordField = page.locator("#new_password");
        this.confirmPasswordField = page.locator("#re_password");
        this.submitButton = page.locator("#Submit");

        this.submitChangePasswordMsg = page.locator("td.login_title span.reg_error");
    }
    // #endregion

    // #region Actions
    async enterCurrentPassword(currentPassword: string) {
        await this.currentPasswordField.clear();
        await this.currentPasswordField.fill(currentPassword);
    }

    async enterNewPassword(currentPassword: string) {
        await this.newPasswordField.clear();
        await this.newPasswordField.fill(currentPassword);
    }

    async enterConfirmPassword(currentPassword: string) {
        await this.confirmPasswordField.clear();
        await this.confirmPasswordField.fill(currentPassword);
    }

    async clickSubmitButton() {
        await this.submitButton.click();
    }
    // #endregion

    // #region Getters
    getSubmitChangePasswordMSG(): Locator {
        return this.submitChangePasswordMsg;
    }
    // #endregion

    // #region Flows
    async enterCurrentAndNewAndConfirmPasswordsAndSubmit(currentPassword: string, newPassword: string, confirmPassword: string) {
        await this.enterCurrentPassword(confirmPassword);
        await this.enterNewPassword(newPassword);
        await this.enterConfirmPassword(confirmPassword);
        await this.clickSubmitButton();
    }
    // #endregion
}