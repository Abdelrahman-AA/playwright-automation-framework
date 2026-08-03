import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


test.beforeEach("Login and Get Session ID Then Select Hotel And Open Select Page", async ({ page, loginService, searchHotelPage}) => {
    const sessionID: string = await loginService.getLoginPhpSessionId(
        validTestData.RegisteredAccount.UserName,
        validTestData.RegisteredAccount.Password);

    await loginService.injectSessionId(page, sessionID);
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
        true
    );


});


test.describe("Happy Path Suite", { tag: "@happy @Book-Hotel" }, () => {


    test("Verify Select Hotel Table Of Hotels Is Visible", async ({ selectHotelPage }) => {

        await test.step("", async () => {
            await expect(selectHotelPage.getResultTable()).toBeVisible();
        });
    });


    test.only("Verify Select Hotel Table Of Options Against Searched Data", async ({ selectHotelPage }) => {

        await test.step("", async () => {
            const locations = await selectHotelPage.getTableLocationsResult()
            locations.forEach(element => { expect.soft(element).toBe(validTestData.BookingData.Location); });
        });

        await test.step("", async () => {
            const hotels = await selectHotelPage.getTableHotelsNameResult()
            hotels.forEach(element => { expect.soft(element).toBe(validTestData.BookingData.Hotel); });
        });

        await test.step("", async () => {
            const roomsType = await selectHotelPage.getTableRoomTypesResult()
            roomsType.forEach(element => { expect.soft(element).toBe(validTestData.BookingData.RoomType); });
        });

        await test.step("", async () => {
            const numberOfRooms = await selectHotelPage.getTableNumOfRoomsResult()
            numberOfRooms.forEach(element => { expect.soft(element).toBe(validTestData.BookingData.NumberOfRooms.split(" ")[0].trim()); });
        });

        await test.step("", async () => {
            const arrivalDates = await selectHotelPage.getTableArrivalDatesResult()
            arrivalDates.forEach(element => { expect.soft(element).toBe(validTestData.BookingData.CheckInDate); });
        });

        await test.step("", async () => {
            const departureDates = await selectHotelPage.getTableDepartureDatesResult()
            departureDates.forEach(element => { expect.soft(element).toBe(validTestData.BookingData.CheckOutDate); });
        });

        await test.step("", async () => {
            const numOfDays = await selectHotelPage.getTableNumOfDaysResult()
            numOfDays.forEach(element => { expect.soft(element).toBe(getDaysDifference((validTestData.BookingData.CheckInDate), (validTestData.BookingData.CheckOutDate))); });
        });
    });

});