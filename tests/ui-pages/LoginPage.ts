import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";

export class LoginPage {

    // #region Locators
    private readonly userNameField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;
    private readonly registerCTA: Locator;
    private readonly forgetPasswordCTA: Locator;
    private readonly errorMSGUserNameField: Locator;
    private readonly errorMSGPasswordField: Locator;
    private readonly errorMSGLogin: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.userNameField = page.locator("#username");
        this.passwordField = page.locator("#password");
        this.loginButton = page.locator("#login");

        this.registerCTA = page.getByRole('link', { name: 'New User Register Here' });
        this.forgetPasswordCTA = page.getByRole('link', { name: 'Forgot Password?' });

        this.errorMSGUserNameField = page.locator("#username_span");
        this.errorMSGPasswordField = page.locator("#password_span");
        this.errorMSGLogin = page.locator("div[class='auth_error'] b");
    }
    // #endregion

    // #region Actions
    async goToLoginPage() {
        await this.page.goto(uiURL.LoginPage);
    }

    async enterUserName(userName: string) {
        await this.userNameField.clear();
        await this.userNameField.fill(userName);
    }

    async enterPassword(password: string) {
        await this.passwordField.clear();
        await this.passwordField.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async clickRegisterCTA() {
        await this.registerCTA.click();
    }

    async clickForgetPasswordCTA() {
        await this.forgetPasswordCTA.click();
    }
    // #endregion

    // #region Getters
    async getUserNameFieldErrorMsgText() {
        return this.errorMSGUserNameField;
    }

    async getPasswordFieldErrorMsgText() {
        return this.errorMSGPasswordField;
    }

    async getLoginErrorMsgText() {
        return this.errorMSGLogin;
    }
    // #endregion

    // #region Flows
    async enterUserNameAndPasswordAndClickLoginButton(username: string, password: string) {
      await  this.enterUserName(username);
       await this.enterPassword(password);
       await this.clickLoginButton();
    }
    // #endregion
}