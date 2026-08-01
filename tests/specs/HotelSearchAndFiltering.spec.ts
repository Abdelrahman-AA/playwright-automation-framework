import { test, expect } from "../fixtures/fixtures";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


test.describe("Happy Path Suite", { tag: "@happy" }, () => {

    test.beforeEach("Login and Get Session ID", async ({ page, loginService }) => {
        const sessionID: string = await loginService.getLoginPhpSessionId(
            validTestData.RegisteredAccount.UserName,
            validTestData.RegisteredAccount.Password);

        await loginService.injectSessionId(page, sessionID);

    });

    test('aa', async ({ searchHotelPage }) => {
        await searchHotelPage.goToSearchPage();
        await searchHotelPage.selectAndFillDataAndOptionalClickSearch(
            validTestData.BookingData.Location,
            validTestData.BookingData.Hotel,
            validTestData.BookingData.RoomType,
            validTestData.BookingData.NumberOfRooms,
            validTestData.BookingData.CheckInDate,
            validTestData.BookingData.CheckOutDate,
            validTestData.BookingData.AdultsPerRoom,
            validTestData.BookingData.ChildrenPerRoom,
            true)
    });
});