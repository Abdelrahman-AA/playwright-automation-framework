import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference, getDateShiftingOfToday } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";

let empty: string = "";


test.beforeEach("Login and Get Session ID Then Open Search Page", async ({ page, loginService, searchHotelPage }) => {
    const sessionID: string = await loginService.getLoginPhpSessionId(
        validTestData.RegisteredAccount.UserName,
        validTestData.RegisteredAccount.Password);

    await loginService.injectSessionId(page, sessionID);
    await searchHotelPage.goToSearchPage();

});


test.describe("Happy Path Suite", { tag: "@happy @Hotel-Search&Filtering" }, () => {


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

        await test.step("Verify Room Type Values In Results", async () => {
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





test.describe("Negative Path Suite", { tag: "@negative @Hotel-Search&Filtering" }, () => {


    test("Verify Error MSG For No Selected Location", async ({ searchHotelPage }) => {

        await test.step("Click Search Button Without Selecting Location", async () => {
            searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Location Selector Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getLocationSelectorErrorMSG(), "Location Selector Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getLocationSelectorErrorMSG(), "Location Selector Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.LocationNotSelected);
        });
    });


    test("Verify Error MSG For Empty Check In Date", async ({ searchHotelPage }) => {

        await test.step("Select Location and Enter Empty Check In Date", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
            await searchHotelPage.enterArrivalDate(empty);
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.EmptyCheckInDate);
        });
    });


    test("Verify Error MSG For Empty Check Out Date", async ({ searchHotelPage }) => {

        await test.step("Select Location and Enter Empty Check Out Date", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
            await searchHotelPage.enterDepartureDate(empty);
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.EmptyCheckOutDate);
        });
    });


    test("Verify Error MSG For Passed Check In And Out Dates", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Passed Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(getDateShiftingOfToday(-600));
            await searchHotelPage.enterDepartureDate(getDateShiftingOfToday(-589));
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.PassedDate);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.PassedDate);
        });
    });


    test("Verify Error MSG For Check Out Date Is Before Check In Date Case If Today And Yesterday", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(getDateShiftingOfToday(0));
            await searchHotelPage.enterDepartureDate(getDateShiftingOfToday(-1));
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckInDateAfterCheckOutDate);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckOutDateBeforeCheckInDate);
        });
    });


    test("Verify Error MSG For Check Out Date Is Before Check In Date Case If Today And Tomorrow", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(getDateShiftingOfToday(1));
            await searchHotelPage.enterDepartureDate(getDateShiftingOfToday(0));
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckInDateAfterCheckOutDate);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckOutDateBeforeCheckInDate);
        });
    });


    test("Verify Error MSG For Check Out Date Is Before Check In Date Case If Tomorrow And After Tomorrow", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(getDateShiftingOfToday(2));
            await searchHotelPage.enterDepartureDate(getDateShiftingOfToday(1));
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckInDateAfterCheckOutDate);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckOutDateBeforeCheckInDate);
        });
    });


    test("Verify Error MSG For Check In And Out Dates Are The Same", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(getDateShiftingOfToday(5,'en-CA'));
            await searchHotelPage.enterDepartureDate(getDateShiftingOfToday(5,'en-CA'));
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckInDateAfterCheckOutDate);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.CheckOutDateBeforeCheckInDate);
        });
    });


    test("Verify Error MSG For Check In And Out Date For Wrong Format Date", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(getDateShiftingOfToday(2,'en-CA'));
            await searchHotelPage.enterDepartureDate(getDateShiftingOfToday(5,'en-CA'));
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });
    });


    test("Verify Error MSG For Check In And Out Date For Wrong Entry Numbers", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(inValidTestData.InValidBookingDate.WrongEntryNumCheckInDate);
            await searchHotelPage.enterDepartureDate(inValidTestData.InValidBookingDate.WrongEntryNumCheckOutDate);
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });
    });


    test("Verify Error MSG For Check In And Out Date For Wrong Entry Text", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(inValidTestData.InValidBookingDate.WrongEntryTextCheckInDate);
            await searchHotelPage.enterDepartureDate(inValidTestData.InValidBookingDate.WrongEntryTextCheckOutDate);
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });
    });

    test("Verify Error MSG For Check In And Out Date For Wrong Entry Text Not Date", async ({ searchHotelPage }) => {

        await test.step("Select Location", async () => {
            await searchHotelPage.selectLocation(validTestData.BookingData.Location);
        });

        await test.step("Enter Check In and Check Out Dates", async () => {
            await searchHotelPage.enterArrivalDate(inValidTestData.InValidBookingDate.WrongEntryTextNotDateCheckInDate);
            await searchHotelPage.enterDepartureDate(inValidTestData.InValidBookingDate.WrongEntryTextNotDateCheckOutDate);
        });

        await test.step("Click Search Button", async () => {
            await searchHotelPage.clickSearchButton();
        });

        await test.step("Verify Check In Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckInDateFieldErrorMSG(), "Check In Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });

        await test.step("Verify Check Out Date Field Error Message Is Visible", async () => {
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Not Visible").toBeVisible();
            await expect.soft(searchHotelPage.getCheckOutDateFieldErrorMSG(), "Check Out Date Field Error Message Does Not Match").toHaveText(uiMSGs.SearchHotelPage.Errors.WrongDateFormat);
        });
    });
});