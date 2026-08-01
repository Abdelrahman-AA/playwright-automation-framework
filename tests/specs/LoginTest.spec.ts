import { test, expect } from "../fixtures/fixtures";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";

test.describe("Happy Path Suite", { tag: "@happy" }, () => {

    test.beforeEach("Navigate to Home Page", async ({ loginPage }) => {
        await loginPage.goToLoginPage();
    });


    test('Verify Home Page Opened', async ({ page }) => {

        await test.step("Verify Home Page URL", async () => {
            await expect.soft(page, "Home Page URL does not match expected URL").toHaveURL(uiURL.LoginPage);
        });

        await test.step("Login Page Page Title", async () => {
            await expect.soft(page, "Login Page Title does not match expected Title").toHaveTitle(uiMSGs.LoginPage.Title);
        });

    });


    test('Verify Logging With Valid Data', async ({ page, loginPage, searchHotelPage }) => {

        await test.step("Enter User Name and Password and Submit", async () => {
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(
                validTestData.RegisteredAccount.UserName,
                validTestData.RegisteredAccount.Password);
        });

        await test.step("Verify User Logging", async () => {
            await expect.soft(searchHotelPage.staticBar.getHelloUserNameMSG(), "UserName Not Appear At Static Bar").toHaveValue(`Hello ${validTestData.RegisteredAccount.UserName}!`);
        });

        await test.step("Verify Search Hotel Page URL", async () => {
            await expect.soft(page, "Search Hotel Page URL does not match expected URL").toHaveURL(uiURL.SearchHotelPage);
        });
    });


    test('Verify Going To Register Page From Login Page', async ({ page, loginPage }) => {
        await test.step("Click New User Register Here", async () => {
            await loginPage.clickRegisterCTA();
        });

        await test.step("Verify Register Page URL", async () => {
            await expect.soft(page, "Register Page URL does not match expected URL").toHaveURL(uiURL.RegisterPage);
        });

        await test.step("Verify Register Page Title", async () => {
            await expect.soft(page, "Register Page Title does not match expected Title").toHaveTitle(uiMSGs.RegisterPage.Title);
        });
    });


    test('Verify Going To Forget Password Page From Login Page', async ({ page, loginPage }) => {
        await test.step("Click Forgot Password?", async () => {
            await loginPage.clickForgetPasswordCTA();
        });

        await test.step("Verify Forget Password Page URL", async () => {
            await expect.soft(page, "Forget Password Page URL does not match expected URL").toHaveURL(uiURL.ForgetPasswordPage);
        });

        await test.step("Verify Forget Password Page Title", async () => {
            await expect.soft(page, "Forget Password Page Title does not match expected Title").toHaveTitle(uiMSGs.ForgetPasswordPage.Title);
        });
    });
});






test.describe("Negative Path Suite", { tag: "@negative" }, () => {

    test.beforeEach("Navigate to Home Page", async ({ loginPage }) => {
        await loginPage.goToLoginPage();
    });


    test('Verify Error Msg Appearance With Empty Login Data', async ({ page, loginPage }) => {

        await test.step("Click Login", async () => {
            await loginPage.clickLoginButton();
        });

        await test.step("User Name Error MSG", async () => {
            await expect.soft(loginPage.getUserNameFieldErrorMsg(), "Username error message should be visible for empty login").toBeVisible();
            await expect.soft(loginPage.getUserNameFieldErrorMsg(), "Username error message text mismatch").toHaveText(uiMSGs.LoginPage.Errors.EmptyUserName)
        });

        await test.step("Verify Still At Login Page", async () => {
            await expect.soft(page, "Login Page Title does not match expected Title").toHaveTitle(uiMSGs.LoginPage.Title);
            await expect.soft(page, "Login Page URL does not match expected URL").toHaveURL(uiURL.LoginPage);
        });
    });


    test('Verify Error Msg Appearance With Registered Username And Empty Password', async ({ page, loginPage }) => {

        await test.step("Enter Valid User Name", async () => {
            await loginPage.enterUserName(validTestData.RegisteredAccount.UserName);
        });

        await test.step("Click Login Button", async () => {
            await loginPage.clickLoginButton();
        });

        await test.step("Password Error MSG", async () => {
            await expect.soft(loginPage.getPasswordFieldErrorMsg(), "Password error message should be visible for empty password").toBeVisible();
            await expect.soft(loginPage.getPasswordFieldErrorMsg(), "Password error message text mismatch").toHaveText(uiMSGs.LoginPage.Errors.EmptyPassword);
        });

        await test.step("Verify Still At Login Page", async () => {
            await expect.soft(page, "Login Page Title does not match expected Title").toHaveTitle(uiMSGs.LoginPage.Title);
            await expect.soft(page, "Login Page URL does not match expected URL").toHaveURL(uiURL.LoginPage);
        });
    });


    test('Verify Error MSG Appearance With Not Registered Username And Empty Password', async ({ page, loginPage }) => {

        await test.step("Enter Not Registered User Name", async () => {
            await loginPage.enterUserName(inValidTestData.NotRegisteredAccount.UserName);
        });

        await test.step("Click Login Button", async () => {
            await loginPage.clickLoginButton();
        });

        await test.step("Password Error MSG", async () => {
            await expect.soft(loginPage.getPasswordFieldErrorMsg(), "Password error message should be visible for empty password").toBeVisible();
            await expect.soft(loginPage.getPasswordFieldErrorMsg(), "Password error message text mismatch").toHaveText(uiMSGs.LoginPage.Errors.EmptyPassword);
        });

        await test.step("Verify Still At Login Page", async () => {
            await expect.soft(page, "Login Page Title does not match expected Title").toHaveTitle(uiMSGs.LoginPage.Title);
            await expect.soft(page, "Login Page URL does not match expected URL").toHaveURL(uiURL.LoginPage);
        });
    });


    test('Verify Error MSG Appearance With Empty Username And Valid Password', async ({ page, loginPage }) => {

        await test.step("Enter Valid Password", async () => {
            await loginPage.enterPassword(validTestData.RegisteredAccount.Password);
        });

        await test.step("Click Login Button", async () => {
            await loginPage.clickLoginButton();
        });

        await test.step("User Name Error MSG", async () => {
            await expect.soft(loginPage.getUserNameFieldErrorMsg(), "UserName error message should be visible for empty password").toBeVisible();
            await expect.soft(loginPage.getUserNameFieldErrorMsg(), "UserName error message text mismatch").toHaveText(uiMSGs.LoginPage.Errors.EmptyUserName);
        });

        await test.step("Verify Still At Login Page", async () => {
            await expect.soft(page, "Login Page Title does not match expected Title").toHaveTitle(uiMSGs.LoginPage.Title);
            await expect.soft(page, "Login Page URL does not match expected URL").toHaveURL(uiURL.LoginPage);
        });
    });


    test('Verify Not Logging With Invalid Data', async ({ page, loginPage }) => {

        await test.step("Enter InValid User Name and Password and Submit", async () => {
            await loginPage.enterUserNameAndPasswordAndClickLoginButton(
                inValidTestData.NotRegisteredAccount.UserName,
                inValidTestData.NotRegisteredAccount.Password)
        });

        await test.step("Login Error MSG", async () => {
            await expect.soft(loginPage.getLoginErrorMsg(), "Login error message should be visible for invalid data").toBeVisible();
            await expect.soft(loginPage.getLoginErrorMsg(), "Login error message text mismatch").toHaveText(uiMSGs.LoginPage.Errors.WrongUserNameOrPAssword);
        });

        await test.step("Verify Still At Login Page", async () => {
            await expect.soft(page, "Login Page Title does not match expected Title").toHaveTitle(uiMSGs.LoginPage.Title);
            await expect.soft(page, "Login Page URL does not match expected URL").toHaveURL(uiURL.LoginPage);
        });
    });
});