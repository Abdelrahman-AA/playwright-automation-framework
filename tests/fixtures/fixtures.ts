import { test as baseTest, expect } from "@playwright/test"
import * as ApiServices from "./ApiServicesIndex"
import * as UiPages from "./UiPagesIndex"

type MyFixtures = {
    loginService: ApiServices.LoginService;
    searchHotelService: ApiServices.SearchHotelService
    selectHotelService: ApiServices.SelectHotelService
    bookHotelService: ApiServices.BookHotelService
    getBookedItineraryService: ApiServices.GetBookedItineraryService
    cancelOrderService: ApiServices.CancelOrderService
    changePasswordService: ApiServices.ChangePasswordService
    forgetPasswordService: ApiServices.ForgetPasswordService
    getBookingOrderService: ApiServices.GetBookingOrderService

    loginPage: UiPages.LoginPage;
    searchHotelPage: UiPages.SearchHotelPage;
    selectHotelPage: UiPages.SelectHotelPage;
    bookHotelPage: UiPages.BookHotelPage;
    bookConfirmPage: UiPages.BookConfirmPage;
    bookedItineraryPage: UiPages.BookedItineraryPage;
    logoutPage: UiPages.LogoutPage;
    registerPage: UiPages.RegisterPage;
    forgetPasswordPage: UiPages.ForgetPasswordPage;
    changePasswordPage: UiPages.ChangePasswordPage;
}

export const test = baseTest.extend<MyFixtures>({
    loginService: async ({ request }, use) => await use(new ApiServices.LoginService(request)),
    searchHotelService: async ({ request }, use) => await use(new ApiServices.SearchHotelService(request)),
    selectHotelService: async ({ request }, use) => await use(new ApiServices.SelectHotelService(request)),
    bookHotelService: async ({ request }, use) => await use(new ApiServices.BookHotelService(request)),
    getBookedItineraryService: async ({ request }, use) => await use(new ApiServices.GetBookedItineraryService(request)),
    cancelOrderService: async ({ request }, use) => await use(new ApiServices.CancelOrderService(request)),
    changePasswordService: async ({ request }, use) => await use(new ApiServices.ChangePasswordService(request)),
    forgetPasswordService: async ({ request }, use) => await use(new ApiServices.ForgetPasswordService(request)),
    getBookingOrderService: async ({ request }, use) => await use(new ApiServices.GetBookingOrderService(request)),

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