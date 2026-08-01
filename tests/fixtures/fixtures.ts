import { test as baseTest, expect } from "@playwright/test";
import * as UiPages from "./UiPagesIndex"
// import { LoginPage } from "../ui-pages/LoginPage";
// import { SearchHotelPage } from "../ui-pages/SearchHotelPage";
// import { SelectHotelPage } from "../ui-pages/SelectHotelPage";
// import { BookHotelPage } from "../ui-pages/BookHotelPage";
// import { BookConfirmPage } from "../ui-pages/BookConfirmPage";
// import { BookedItineraryPage } from "../ui-pages/BookedItineraryPage";
// import { LogoutPage } from "../ui-pages/LogoutPage";
// import { RegisterPage } from "../ui-pages/RegisterPage";
// import { ForgetPasswordPage } from "../ui-pages/ForgetPasswordPage";
// import { ChangePasswordPage } from "../ui-pages/ChangePasswordPage";

type MyFixtures = {
    loginPage: UiPages.LoginPage;
    searchHotelPage: UiPages.SearchHotelPage;
    selectHotelPage: UiPages.SelectHotelPage;
    bookHotelPage: UiPages.BookHotelPage;
    bookConfirmPage: UiPages.BookConfirmPage;
    bookedItineraryPage:UiPages. BookedItineraryPage;
    logoutPage: UiPages.LogoutPage;
    registerPage: UiPages.RegisterPage;
    forgetPasswordPage: UiPages.ForgetPasswordPage;
    changePasswordPage: UiPages.ChangePasswordPage;

}

export const test = baseTest.extend<MyFixtures>({
    loginPage: async ({ page }, use) => await use(new UiPages.LoginPage(page)),
    searchHotelPage: async ({ page }, use) => await use(new UiPages.SearchHotelPage(page)),
    selectHotelPage: async ({ page }, use) => await use(new UiPages.SelectHotelPage(page)),
    bookHotelPage: async ({ page }, use) => await use(new UiPages.BookHotelPage(page)),
    bookConfirmPage: async ({ page }, use) => await use(new UiPages.BookConfirmPage(page)),
    bookedItineraryPage: async ({ page }, use) => await use(new UiPages.BookedItineraryPage(page)),
    logoutPage: async ({ page }, use) => await use(new UiPages.LogoutPage(page)),
    registerPage: async ({ page }, use) => await use(new UiPages.RegisterPage(page)),
    forgetPasswordPage: async ({ page }, use) => await use(new UiPages.ForgetPasswordPage(page)),
    changePasswordPage: async ({ page }, use) => await use(new UiPages.ChangePasswordPage(page))
});

export { expect } from '@playwright/test';