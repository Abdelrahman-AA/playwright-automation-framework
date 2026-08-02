import { test, expect } from "../fixtures/fixtures";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


test.describe("Happy Path Suite", { tag: "@happy" }, () => {

    test.beforeEach("Login and Get Session ID", async ({ page, loginService,searchHotelPage }) => {
        const sessionID: string = await loginService.getLoginPhpSessionId(
            validTestData.RegisteredAccount.UserName,
            validTestData.RegisteredAccount.Password);

        await loginService.injectSessionId(page, sessionID);
        await searchHotelPage.goToSearchPage();

    });


    test('Verify Going To Search Hotel Page', async ({ page, searchHotelPage }) => {
        test.step("", async () => {
            await expect.soft(searchHotelPage.staticBar.getHelloUserNameMSG(), "UserName Not Appear At Static Bar").toHaveValue(`Hello ${validTestData.RegisteredAccount.UserName}!`);
            await expect.soft(page, "Search Hotel Page URL Not Match").toHaveURL(uiURL.SearchHotelPage);
            await expect.soft(page, "Search Hotel Page Title Not Match").toHaveTitle(uiMSGs.SearchHotelPage.Title)
        });

    });


    test('Verify Going To Hotel Reservation Options When Valid Data', async ({ searchHotelPage,selectHotelPage }) => {

        test.step("",async()=>{
        await searchHotelPage.selectAndFillDataAndOptionalClickSearch(
            validTestData.BookingData.Location,
            validTestData.BookingData.Hotel,
            validTestData.BookingData.RoomType,
            validTestData.BookingData.NumberOfRooms,
            validTestData.BookingData.CheckInDate,
            validTestData.BookingData.CheckOutDate,
            validTestData.BookingData.AdultsPerRoom,
            validTestData.BookingData.ChildrenPerRoom,
            true);
        });

        test.step("",async()=>{
            await expect.soft(selectHotelPage.getResultTable()).toBeVisible();
            await expect.soft(selectHotelPage.getResultTable().)
        });

    });
});