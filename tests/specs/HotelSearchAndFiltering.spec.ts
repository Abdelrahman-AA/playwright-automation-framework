import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


test.describe("Happy Path Suite", { tag: "@happy @HotelSearchAndFiltering" }, () => {

    test.beforeEach("Login and Get Session ID", async ({ page, loginService, searchHotelPage }) => {
        const sessionID: string = await loginService.getLoginPhpSessionId(
            validTestData.RegisteredAccount.UserName,
            validTestData.RegisteredAccount.Password);

        await loginService.injectSessionId(page, sessionID);
        await searchHotelPage.goToSearchPage();

    });


    test('Verify Going To Search Hotel Page', async ({ page, searchHotelPage }) => {
        await test.step("Check Opening Search Hotel Page", async () => {
            await expect.soft(searchHotelPage.staticBar.getHelloUserNameMSG(), "UserName Not Appear At Static Bar").toHaveValue(`Hello ${validTestData.RegisteredAccount.UserName}!`);
            await expect.soft(page, "Search Hotel Page URL Not Match").toHaveURL(uiURL.SearchHotelPage);
            await expect.soft(page, "Search Hotel Page Title Not Match").toHaveTitle(uiMSGs.SearchHotelPage.Title)
        });

    });


    test('Verify Going To Hotel Reservation Options When Valid Data', async ({ searchHotelPage, selectHotelPage }) => {

        await test.step("Select and Fill Search Data", async () => {
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

        await test.step("Verify Search Results Table Is Visible", async () => {
            await expect.soft(selectHotelPage.getResultTable(), "Search Results Table Not Visible").toBeVisible();
        });

        await test.step("Verify Location Values In Results", async () => {
            for (const location of await selectHotelPage.getTableLocationsResult()) {
                await expect.soft(location, "Location Values In Results Do Not Match").toEqual(validTestData.BookingData.Location);
            }
        });

        await test.step("Verify Hotel Values In Results", async () => {
            for (const hotel of await selectHotelPage.getTableHotelsNameResult()) {
                await expect.soft(hotel, "Hotel Values In Results Do Not Match").toEqual(validTestData.BookingData.Hotel);
            }
        });

      await  test.step("Verify Room Type Values In Results", async () => {
            for (const type of await selectHotelPage.getTableRoomTypesResult()) {
                await expect.soft(type, "Room Type Values In Results Do Not Match").toEqual(validTestData.BookingData.RoomType);
            }
        });

       await test.step("Verify Number Of Rooms Values In Results", async () => {
            for (const num of await selectHotelPage.getTableNumOfRoomsResult()) {
                await expect.soft(num, "Number Of Rooms Values In Results Do Not Match").toEqual((validTestData.BookingData.NumberOfRooms).split(" ")[0].trim());
            }
        });

       await test.step("Verify Arrival Dates Values In Results", async () => {
            for (const num of await selectHotelPage.getTableArrivalDatesResult()) {
                await expect.soft(num, "Arrival Dates Values In Results Do Not Match").toEqual(validTestData.BookingData.CheckInDate);
            }
        });

       await test.step("Verify Departure Dates Values In Results", async () => {
            for (const num of await selectHotelPage.getTableDepartureDatesResult()) {
                await expect.soft(num, "Departure Dates Values In Results Do Not Match").toEqual(validTestData.BookingData.CheckOutDate);
            }
        });

       await test.step("Verify Number Of Days Values In Results", async () => {
            for (const num of await selectHotelPage.getTableNumOfDaysResult()) {
                await expect.soft(num, "Number Of Days Values In Results Do Not Match").toEqual(getDaysDifference(validTestData.BookingData.CheckInDate, validTestData.BookingData.CheckOutDate));
            }
        });
    });

    test("Verify Reset All Fields When Click Reset", async ({ searchHotelPage }) => {
        let currentVal1: string[];
        let currentVal2: string[];

        await test.step("Get Initial Form Values", async () => {
            currentVal1 = await searchHotelPage.getFormCurrentValues()
        });

        await test.step("Fill Search Data and Click Search", async () => {
            await searchHotelPage.selectAndFillDataAndOptionalClickSearch(
                validTestData.BookingData.Location,
                validTestData.BookingData.Hotel,
                validTestData.BookingData.RoomType,
                validTestData.BookingData.NumberOfRooms,
                validTestData.BookingData.CheckInDate,
                validTestData.BookingData.CheckOutDate,
                validTestData.BookingData.AdultsPerRoom,
                validTestData.BookingData.ChildrenPerRoom);

            await searchHotelPage.clickResetButton();
        });

        await test.step("Get Form Values After Reset", async () => {
            currentVal2 = await searchHotelPage.getFormCurrentValues()
        });

        await test.step("Verify Form Values Are Reset", async () => {
            expect(currentVal1, "Form Values Not Reset").toEqual(currentVal2);
        });
    });
});