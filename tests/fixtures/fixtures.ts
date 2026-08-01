import { test as baseTest, expect } from "@playwright/test";
import { LoginPage } from "../ui-pages/LoginPage";
import { SearchHotelPage } from "../ui-pages/SearchHotelPage";
import { SelectHotelPage } from "../ui-pages/SelectHotelPage";
import { BookHotelPage } from "../ui-pages/BookHotelPage";
import { BookConfirmPage } from "../ui-pages/BookConfirmPage";
import { BookedItineraryPage } from "../ui-pages/BookedItineraryPage";
import { LogoutPage } from "../ui-pages/LogoutPage";
import { RegisterPage } from "../ui-pages/RegisterPage";
import { ForgetPasswordPage } from "../ui-pages/ForgetPasswordPage";
import { ChangePasswordPage } from "../ui-pages/ChangePasswordPage";

type MyFixtures = {
    loginPage: LoginPage;
    searchHotelPage: SearchHotelPage;
    selectHotelPage: SelectHotelPage;
    bookHotelPage: BookHotelPage;
    bookConfirmPage:BookConfirmPage;
    bookedItineraryPage: BookedItineraryPage;
    logoutPage: LogoutPage;
    registerPage: RegisterPage;
    forgetPasswordPage:ForgetPasswordPage;
    changePasswordPage:ChangePasswordPage;

}

export const test = baseTest.extend<MyFixtures>({
    loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
    searchHotelPage: async ({ page }, use) => { await use(new SearchHotelPage(page)); },
    selectHotelPage: async ({ page }, use) => { await use(new SelectHotelPage(page)); },
    bookHotelPage: async ({ page }, use) => { await use(new BookHotelPage(page)); },
    bookConfirmPage: async ({ page }, use) => { await use(new BookConfirmPage(page)); },
    bookedItineraryPage: async ({ page }, use) => { await use(new BookedItineraryPage(page)); },
    logoutPage: async ({ page }, use) => { await use(new LogoutPage(page)); },
    registerPage: async ({ page }, use) => { await use(new RegisterPage(page)); },
    forgetPasswordPage: async ({ page }, use) => { await use(new ForgetPasswordPage(page)); },
    changePasswordPage: async ({ page }, use) => { await use(new ChangePasswordPage(page)); },
});

export { expect } from '@playwright/test';