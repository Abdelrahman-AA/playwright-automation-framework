import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";

export class RegisterPage {

    // #region Locators
    private readonly backToLoginPageCTA: Locator;
    private readonly userNameField: Locator;
    private readonly passwordField: Locator;
    private readonly confirmPasswordField: Locator;
    private readonly fullNameField: Locator;
    private readonly emailField: Locator;
    private readonly captchaImage: Locator;
    private readonly refreshCaptchaImage: Locator;
    private readonly captchaTextField: Locator;
    private readonly termsAndConditionsCTA: Locator;
    private readonly checkAgreementTermsAndConditions: Locator;
    private readonly registerButton: Locator;
    private readonly resetButton: Locator;
    private readonly afterRegisterBackToLoginPage: Locator;

    private readonly errorMsgUserName: Locator;
    private readonly errorMsgPassword: Locator;
    private readonly errorMsgConfirmPassword: Locator;
    private readonly errorMsgFullName: Locator;
    private readonly errorMsgEmail: Locator;
    private readonly errorMsgCaptcha: Locator;
    private readonly errorMsgMustAgreeTerms: Locator;
    private readonly successfullyRegistrationMsg: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.backToLoginPageCTA = page.locator("//a[normalize-space()='Go back to Login page']");
        this.userNameField = page.locator("#username");
        this.passwordField = page.locator("#password");
        this.confirmPasswordField = page.locator("#re_password");
        this.fullNameField = page.locator("#full_name");
        this.emailField = page.locator("#email_add");
        this.captchaImage = page.locator("#captcha");
        this.refreshCaptchaImage = page.locator("//img[@alt='Refresh Captcha']");
        this.captchaTextField = page.locator("#captcha-form");
        this.termsAndConditionsCTA = page.locator("//a[normalize-space()='Terms & Conditions']");
        this.checkAgreementTermsAndConditions = page.locator("#tnc_box");
        this.registerButton = page.locator("#Submit");
        this.resetButton = page.locator("#Reset");
        this.afterRegisterBackToLoginPage = page.locator("a[href='index.php']");

        this.errorMsgUserName = page.locator("#username_span");
        this.errorMsgPassword = page.locator("#password_span");
        this.errorMsgConfirmPassword = page.locator("#re_password_span");
        this.errorMsgFullName = page.locator("#full_name_span");
        this.errorMsgEmail = page.locator("#email_add_span");
        this.errorMsgCaptcha = page.locator("#captcha_span");
        this.errorMsgMustAgreeTerms = page.locator("#tnc_span");
        this.successfullyRegistrationMsg = page.locator("xpath=/html/body/table[2]/tbody/tr/td[1]/table/tbody/tr/td");
    }
    // #endregion

    // #region Actions
    async goToRegisterPage() {
        await this.page.goto(uiURL.RegisterPage);
    }

    async clickBackToLoginPageCTA() {
        await this.backToLoginPageCTA.click();
    }

    async enterUserName(userName: string) {
        await this.userNameField.clear();
        await this.userNameField.fill(userName);
    }

    async enterPassword(password: string) {
        await this.passwordField.clear();
        await this.passwordField.fill(password);
    }

    async enterConfirmPassword(confirmPassword: string) {
        await this.confirmPasswordField.clear();
        await this.confirmPasswordField.fill(confirmPassword);
    }

    async enterFullName(fullName: string) {
        await this.fullNameField.clear();
        await this.fullNameField.fill(fullName);
    }

    async enterEmail(email: string) {
        await this.emailField.clear();
        await this.emailField.fill(email);
    }

    async clickRefreshCaptchaImage() {
        await this.refreshCaptchaImage.click();
    }
    async enterCaptchaText(email: string) {
        await this.captchaTextField.clear();
        await this.captchaTextField.fill(email);
    }

    async clickTermsAndConditionsCTA() {
        await this.termsAndConditionsCTA.click();
    }

    async checkAgreeTermsAndConditions() {
        await this.checkAgreementTermsAndConditions.click();
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async clickResetButton() {
        await this.resetButton.click();
    }

    async clickAfterRegisterBackToLoginPageCTA() {
        await this.afterRegisterBackToLoginPage.click();
    }
    // #endregion

    // #region Getters
    getCaptchaImage(): Locator {
        return this.captchaImage;
    }

    getUserNameErrorMSG(): Locator {
        return this.errorMsgUserName;
    }

    getPasswordErrorMSG(): Locator {
        return this.errorMsgPassword;
    }

    getConfirmPasswordErrorMSG(): Locator {
        return this.errorMsgConfirmPassword;
    }

    getFullNameErrorMSG(): Locator {
        return this.errorMsgFullName;
    }

    getEmailErrorMSG(): Locator {
        return this.errorMsgEmail;
    }

    getCaptchaErrorMSG(): Locator {
        return this.errorMsgCaptcha;
    }

    getMustAgreeTermsErrorMSG(): Locator {
        return this.errorMsgMustAgreeTerms;
    }

    getSuccessfullyRegistrationMsg(): Locator {
        return this.successfullyRegistrationMsg;
    }

    getRegisterButton():Locator{
        return this.registerButton;
    }

    async getAllFieldsTextAndTermsCondition(): Promise<(string | boolean)[]> {
        const [userName, password, confirmPassword, fullName, email, captchaText, isAgreed]
            = await Promise.all([
                this.userNameField.innerText(),
                this.passwordField.innerText(),
                this.confirmPasswordField.innerText(),
                this.fullNameField.innerText(),
                this.emailField.innerText(),
                this.captchaTextField.innerText(),
                this.checkAgreementTermsAndConditions.isChecked()
            ]);
        return [userName, password, confirmPassword, fullName, email, captchaText, isAgreed];
    }
    // #endregion

    // #region Flows
    async fillRegistrationFormAndOptionalClickSubmit(
        userName: string,
        password: string,
        confirmPassword: string,
        fullName: string,
        email: string,
        terms: boolean,
        captcha?: string,
        submit: boolean = false
    ) {
        await this.enterUserName(userName);
        await this.enterPassword(password);
        await this.enterConfirmPassword(confirmPassword);
        await this.enterFullName(fullName);
        await this.enterEmail(email);
        if (terms) await this.checkAgreeTermsAndConditions();
        if (captcha) await this.enterCaptchaText(captcha);
        if (submit) await this.clickRegisterButton();
    }
    // #endregion
}