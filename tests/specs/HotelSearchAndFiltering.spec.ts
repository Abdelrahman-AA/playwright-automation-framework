import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


test.describe("Happy Path Suite", { tag: "@happy" }, () => {

    test.beforeEach("Login and Get Session ID", async ({ page, loginService, searchHotelPage }) => {
        const sessionID: string = await loginService.getLoginPhpSessionId(
            validTestData.RegisteredAccount.UserName,
            validTestData.RegisteredAccount.Password);

        await loginService.injectSessionId(page, sessionID);
        await searchHotelPage.goToSearchPage();

    });


    test('Verify Going To Search Hotel Page', async ({ page, searchHotelPage }) => {
        await test.step("", async () => {
            await expect.soft(searchHotelPage.staticBar.getHelloUserNameMSG(), "UserName Not Appear At Static Bar").toHaveValue(`Hello ${validTestData.RegisteredAccount.UserName}!`);
            await expect.soft(page, "Search Hotel Page URL Not Match").toHaveURL(uiURL.SearchHotelPage);
            await expect.soft(page, "Search Hotel Page Title Not Match").toHaveTitle(uiMSGs.SearchHotelPage.Title)
        });

    });


    test('Verify Going To Hotel Reservation Options When Valid Data', async ({ page, searchHotelPage, selectHotelPage }) => {

        await test.step("", async () => {
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

        await test.step("", async () => {
            await expect.soft(selectHotelPage.getResultTable()).toBeVisible();
        });

        await test.step("", async () => {
            for (const location of await selectHotelPage.getTableLocationsResult()) {
                await expect.soft(location).toEqual(validTestData.BookingData.Location);
            }
        });

        test.step("", async () => {
            for (const hotel of await selectHotelPage.getTableHotelsNameResult()) {
                await expect.soft(hotel).toEqual(validTestData.BookingData.Hotel);
            }
        });

        test.step("", async () => {
            for (const type of await selectHotelPage.getTableRoomTypesResult()) {
                await expect.soft(type).toEqual(validTestData.BookingData.RoomType);
            }
        });

        test.step("", async () => {
            for (const num of await selectHotelPage.getTableNumOfRoomsResult()) {
                await expect.soft(num).toEqual((validTestData.BookingData.NumberOfRooms).split(" ")[0].trim());
            }
        });

        test.step("", async () => {
            for (const num of await selectHotelPage.getTableArrivalDatesResult()) {
                await expect.soft(num).toEqual(validTestData.BookingData.CheckInDate);
            }
        });

        test.step("", async () => {
            for (const num of await selectHotelPage.getTableDepartureDatesResult()) {
                await expect.soft(num).toEqual(validTestData.BookingData.CheckOutDate);
            }
        });

        test.step("", async () => {
            for (const num of await selectHotelPage.getTableNumOfDaysResult()) {
                await expect.soft(num).toEqual(getDaysDifference(validTestData.BookingData.CheckInDate, validTestData.BookingData.CheckOutDate));
            }
        });
    });

    test("Verify Reset All Fields When Click Reset", async ({ searchHotelPage }) => {
        let currentVal1: string[];
        let currentVal2: string[];

        test.step('', async () => {
            currentVal1 = await searchHotelPage.getFormCurrentValues()
        });

        test.step("", async () => {
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

        test.step('', async () => {
            currentVal2 = await searchHotelPage.getFormCurrentValues()
        });

        test.step('', async () => {
            expect(currentVal1).toEqual(currentVal2);
        });
    });
});