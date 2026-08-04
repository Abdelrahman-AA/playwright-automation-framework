import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";

let longTimeOut: number = 60000;

test.beforeEach("Login and Get Session ID Then Select Hotel And Open Select Page", async ({ page, loginService, searchHotelPage }) => {
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

        await test.step("Check Table Is Visible", async () => {
            await expect(selectHotelPage.getResultTable(), "Select Hotel Table Is Not Visible").toBeVisible();
        });
    });


    test("Verify Select Hotel Table Of Options Against Searched Data", async ({ selectHotelPage }) => {

        await test.step("Check Locations", async () => {
            const locations = await selectHotelPage.getTableLocationsResult()
            locations.forEach(element => { expect.soft(element, "Location Does Not Match").toBe(validTestData.BookingData.Location); });
        });

        await test.step("Check Hotels", async () => {
            const hotels = await selectHotelPage.getTableHotelsNameResult()
            hotels.forEach(element => { expect.soft(element, "Hotel Does Not Match").toBe(validTestData.BookingData.Hotel); });
        });

        await test.step("Check Room Types", async () => {
            const roomsType = await selectHotelPage.getTableRoomTypesResult()
            roomsType.forEach(element => { expect.soft(element, "Room Type Does Not Match").toBe(validTestData.BookingData.RoomType); });
        });

        await test.step("Check Number of Rooms", async () => {
            const numberOfRooms = await selectHotelPage.getTableNumOfRoomsResult()
            numberOfRooms.forEach(element => { expect.soft(element, "Number of Rooms Does Not Match").toBe(validTestData.BookingData.NumberOfRooms.split(" ")[0].trim()); });
        });

        await test.step("Check Arrival Dates", async () => {
            const arrivalDates = await selectHotelPage.getTableArrivalDatesResult()
            arrivalDates.forEach(element => { expect.soft(element, "Arrival Date Does Not Match").toBe(validTestData.BookingData.CheckInDate); });
        });

        await test.step("Check Departure Dates", async () => {
            const departureDates = await selectHotelPage.getTableDepartureDatesResult()
            departureDates.forEach(element => { expect.soft(element, "Departure Date Does Not Match").toBe(validTestData.BookingData.CheckOutDate); });
        });

        await test.step("Check Number of Days", async () => {
            const numOfDays = await selectHotelPage.getTableNumOfDaysResult()
            numOfDays.forEach(element => { expect.soft(element, "Number of Days Does Not Match").toBe(getDaysDifference((validTestData.BookingData.CheckInDate), (validTestData.BookingData.CheckOutDate))); });
        });
    });


    test("Verify Total Price Before GST Is Number Of Days by Price Per Night And Add ten", async ({ selectHotelPage }) => {
        let pricePerNight: string;
        let totalPrice: string;

        await test.step("Get Price Per Night and Total Price", async () => {
            let pricePerNightList = await selectHotelPage.getTablePricesPerNightResult();
            pricePerNight = pricePerNightList[0];
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("Verify Total Price Before GST", async () => {
            await expect(+totalPrice, "Total Price Before GST Does Not Match").toEqual((+pricePerNight * +(getDaysDifference((validTestData.BookingData.CheckInDate), (validTestData.BookingData.CheckOutDate)))) + 10)
        });
    });


    test("Verify Return To Search Form When Click Cancel From Select Page", async ({ page, selectHotelPage }) => {

        await test.step("Click Cancel Button", async () => {
            await selectHotelPage.clickCancelButton();
        });

        await test.step("Check Opening Search Hotel Page", async () => {
            await expect.soft(page, "Search Hotel Page URL Not Match").toHaveURL(uiURL.SearchHotelPage);
            await expect.soft(page, "Search Hotel Page Title Not Match").toHaveTitle(uiMSGs.SearchHotelPage.Title)
        });
    });


    test("Verify Going To Book Hotel Page After Select Hotel And Click Continue", async ({ page, selectHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Check Opening Book Hotel Page", async () => {
            await expect.soft(page, "Book Hotel Page URL Not Match").toHaveURL(uiURL.BookHotelPage);
            await expect.soft(page, "Book Hotel Page Title Not Match").toHaveTitle(uiMSGs.BookHotelPage.Title)
        });
    });


    test("Verify Return To Select Page When Click Cancel From Book Hotel Page", async ({ page, selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Cancel Button", async () => {
            await bookHotelPage.clickCancelButton();
        });

        await test.step("Check Opening Select Hotel Page", async () => {
            await expect.soft(page, "Select Hotel Page URL Not Match").toHaveURL(uiURL.SelectHotelPage);
            await expect.soft(page, "Select Hotel Page Title Not Match").toHaveTitle(uiMSGs.SelectHotelPage.Title)
        });
    });

    test("Verify Book Page Fixed Fields Against Selected Hotel Details", async ({ selectHotelPage, bookHotelPage }) => {
        let pricePerNight: string;
        let totalPrice: string;

        await test.step("Get Price Per Night and Total Price", async () => {
            let pricePerNightList = await selectHotelPage.getTablePricesPerNightResult();
            pricePerNight = pricePerNightList[0];
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Verify Fixed Fields", async () => {
            await expect.soft(bookHotelPage.getHotelNameFixedField(), "Hotel Name Does Not Match").toHaveAttribute("value", validTestData.BookingData.Hotel);
            await expect.soft(bookHotelPage.getLocationFixedField(), "Location Does Not Match").toHaveAttribute("value", validTestData.BookingData.Location);
            await expect.soft(bookHotelPage.getRoomTypeFixedField(), "Room Type Does Not Match").toHaveAttribute("value", validTestData.BookingData.RoomType);
            await expect.soft(bookHotelPage.getNumOfRoomsFixedField(), "Number of Rooms Does Not Match").toHaveAttribute("value", `${(validTestData.BookingData.NumberOfRooms).split(" ")[0].trim()} Room(s)`);
            await expect.soft(bookHotelPage.getTotalDaysFixedField(), "Total Days Does Not Match").toHaveAttribute("value", `${getDaysDifference(validTestData.BookingData.CheckInDate, validTestData.BookingData.CheckOutDate)} Day(s)`);
            await expect.soft(bookHotelPage.getPricePerNightFixedField(), "Price Per Night Does Not Match").toHaveAttribute("value", pricePerNight);
            await expect.soft(bookHotelPage.getTotalPriceFixedField(), "Total Price Does Not Match").toHaveAttribute("value", totalPrice);
        });
    });


    test("Verify GST As Ten Percent", async ({ selectHotelPage, bookHotelPage }) => {
        let pricePerNight: string;
        let totalPrice: string;

        await test.step("Get Price Per Night and Total Price", async () => {
            let pricePerNightList = await selectHotelPage.getTablePricesPerNightResult();
            pricePerNight = pricePerNightList[0];
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Verify GST", async () => {
            await expect(bookHotelPage.getGstFixedField(), "GST Does Not Match").toHaveAttribute("value", `AUD $ ${((+totalPrice.split(" ")[2].trim()) / 10).toString()}`);
        });
    });


    test("Verify Final Billing Price Is Summation GST And Total Price", async ({ selectHotelPage, bookHotelPage }) => {
        let totalPrice: string;

        await test.step("Get Total Price", async () => {
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Verify Final Billing Price", async () => {
            await expect(bookHotelPage.getFinalBilledPriceFixedField(), "Final Billed Price Does Not Match").toHaveAttribute("value", `AUD $ ${((+totalPrice.split(" ")[2].trim()) * 1.1).toString().split(".")[0].trim()}`);

        });
    });


    test("Verify Booking With Valid Data", async ({ page, selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Check Opening Booking Confirm Page", async () => {
            await expect.soft(page, "Booking Hotel Confirm Page URL Not Match").toHaveURL(uiURL.BookConfirmPage, { timeout: longTimeOut });
            await expect.soft(page, "Booking Hotel Confirm Page Title Not Match").toHaveTitle(uiMSGs.BookingConfirmPage.Title)
        });
    });


    test("Verify Booked hotel Name At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Name", async () => {
            await expect(bookConfirmPage.getHotelNameFixedField(), "Hotel Name Does Not Match").toHaveAttribute("value", validTestData.BookingData.Hotel, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Location At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Location", async () => {
            await expect(bookConfirmPage.getLocationFixedField(), "Hotel Location Does Not Match").toHaveAttribute("value", validTestData.BookingData.Location, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Room Type At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Room Type", async () => {
            await expect(bookConfirmPage.getRoomTypeFixedField(), "Hotel Room Type Does Not Match").toHaveAttribute("value", validTestData.BookingData.RoomType, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Arrival Date At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Arrival Date", async () => {
            await expect(bookConfirmPage.getArrivalDateFixedField(), "Hotel Arrival Date Does Not Match").toHaveAttribute("value", validTestData.BookingData.CheckInDate, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Departure Date At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Departure Date", async () => {
            await expect(bookConfirmPage.getDepartureDateFixedField(), "Hotel Departure Date Does Not Match").toHaveAttribute("value", validTestData.BookingData.CheckOutDate, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Num Of Rooms At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Total Rooms", async () => {
            await expect(bookConfirmPage.getTotalRoomsFixedField(), "Hotel Total Rooms Does Not Match").toHaveAttribute("value", `${(validTestData.BookingData.NumberOfRooms).split(" ")[0].trim()} Room(s)`, { timeout: longTimeOut });
        });
    });



    test("Verify Booked hotel Adults Per Room At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Adults Per Room", async () => {
            await expect(bookConfirmPage.getAdultsPerRoomFixedField(), "Hotel Adults Per Room Does Not Match").toHaveAttribute("value", `${(validTestData.BookingData.AdultsPerRoom).split(" ")[0].trim()} Adult(s)`, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Children Per Room At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Children Per Room", async () => {
            await expect(bookConfirmPage.getChildrenPerRoomFixedField(), "Hotel Children Per Room Does Not Match").toHaveAttribute("value", `${(validTestData.BookingData.ChildrenPerRoom).split(" ")[0].trim()} Children`, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Price Per Night At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {
        let pricePerNight: string;

        await test.step("Select Hotel and Click Continue", async () => {
            let pricePerNightList = await selectHotelPage.getTablePricesPerNightResult();
            pricePerNight = pricePerNightList[0];
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Verify Booked Hotel Price Per Night", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Price Per Night", async () => {
            await expect(bookConfirmPage.getPricePerNightFixedField(), "Hotel Price Per Night Does Not Match").toHaveAttribute("value", pricePerNight, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Total Price At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {
        let totalPrice: string;

        await test.step("Select Hotel and Click Continue", async () => {
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Verify Booked Hotel Total Price", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Total Price", async () => {
            await expect(bookConfirmPage.getTotalPriceFixedField(), "Hotel Total Price Does Not Match").toHaveAttribute("value", totalPrice, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Price GST At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {
        let totalPrice: string;

        await test.step("Select Hotel and Click Continue", async () => {
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Verify Booked Hotel Price GST", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Price GST", async () => {
            await expect(bookConfirmPage.getGstFixedField(), "Hotel Price GST Does Not Match").toHaveAttribute("value", `AUD $ ${((+totalPrice.split(" ")[2].trim()) / 10).toString()}`, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Final Billing Price At Booked Confirm Page Against Selected", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {
        let totalPrice: string;

        await test.step("Select Hotel and Click Continue", async () => {
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Verify Booked Hotel Final Billing Price", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked Hotel Final Billing Price", async () => {
            await expect(bookConfirmPage.getFinalBillingPriceFixedField(), "Hotel Final Billing Price Does Not Match").toHaveAttribute("value", `AUD $ ${((+totalPrice.split(" ")[2].trim()) * 1.1).toString().split(".")[0].trim()}`, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel First Name At Booked Confirm Page Against Entered", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked hotel First Name At Booked Confirm Page Against Entered", async () => {
            await expect(bookConfirmPage.getFirstNameFixedField(), "Hotel First Name Does Not Match").toHaveAttribute("value", validTestData.RegisteredAccount.FirstName, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Last Name At Booked Confirm Page Against Entered", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked hotel Last Name At Booked Confirm Page Against Entered", async () => {
            await expect(bookConfirmPage.getLastNameFixedField(), "Hotel Last Name Does Not Match").toHaveAttribute("value", validTestData.RegisteredAccount.LastName, { timeout: longTimeOut });
        });
    });


    test("Verify Booked hotel Billing Address At Booked Confirm Page Against Entered", async ({ selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Booked hotel Billing Address At Booked Confirm Page Against Entered", async () => {
            await expect(bookConfirmPage.getBillingAddressFixedField(), "Hotel Billing Address Does Not Match").toHaveText(validTestData.BillingAddress, { timeout: longTimeOut });
        });
    });


    test("Verify Going To Search Hotel Page By Clicking On Search Hotel Button", async ({ page, selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Click Search Hotel Button", async () => {
            await bookConfirmPage.clickSearchHotelButton();
        });

        await test.step("Verify Search Hotel Page", async () => {
            await expect.soft(page, "Search Hotel Page URL Not Match").toHaveURL(uiURL.SearchHotelPage, { timeout: longTimeOut });
            await expect.soft(page, "Search Hotel Page Title Not Match").toHaveTitle(uiMSGs.SearchHotelPage.Title, { timeout: longTimeOut });
        });
    });


    test("Verify Going To My Itinerary Page By Clicking On My Itinerary Button", async ({ page, selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Click My Itinerary Button", async () => {
            await bookConfirmPage.clickMyItineraryButton();
        });

        await test.step("Verify My Itinerary Page", async () => {
            await expect.soft(page, "My Itinerary Page URL Not Match").toHaveURL(uiURL.BookedItineraryPage, { timeout: longTimeOut });
            await expect.soft(page, "My Itinerary Page Title Not Match").toHaveTitle(uiMSGs.BookedItineraryPage.Title, { timeout: longTimeOut });
        });
    });


    test("Verify Going To Logout Page By Clicking On Logout Button", async ({ page, selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Click Logout Button", async () => {
            await bookConfirmPage.clickLogoutButton();
        });

        await test.step("Verify Logout Page", async () => {
            await expect.soft(page, "Logout Page URL Not Match").toHaveURL(uiURL.LogoutPage, { timeout: longTimeOut });
            await expect.soft(page, "Logout Page Title Not Match").toHaveTitle(uiMSGs.LogoutPage.Title, { timeout: longTimeOut });
        });
    });


    test("Verify Order Num Not Empty", async ({ page, selectHotelPage, bookHotelPage, bookConfirmPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Fill Booking Data and Click Book Button", async () => {
            await bookHotelPage.selectAndFillDataAndOptionalClickBookButton(
                validTestData.RegisteredAccount.FirstName,
                validTestData.RegisteredAccount.LastName,
                validTestData.BillingAddress,
                validTestData.CCNum,
                validTestData.CCType,
                validTestData.CCExpireMonth,
                validTestData.CCExpireYear,
                validTestData.CCCsv,
                true);
        });

        await test.step("Verify Order Number Not Empty", async () => {
            await expect(bookConfirmPage.getOrderNoFixedField(), "Order Number Is Empty").not.toBeEmpty({ timeout: longTimeOut });
        });
    });
});







test.describe("Negative Path Suite", { tag: "@negative @Book-Hotel" }, () => {


    test("Verify Error MSG When Click Continue Without Select Hotel", async ({ selectHotelPage }) => {
        await test.step("Click Continue Button", async () => {
            await selectHotelPage.clickContinueButton();
        });

        await test.step("Verify Error Message", async () => {
            await expect.soft(selectHotelPage.getContinueErrorMSG()).toBeVisible();
            await expect.soft(selectHotelPage.getContinueErrorMSG()).toHaveText(uiMSGs.SelectHotelPage.Errors.NoSelectedHotel);
        });
    });


    test("Verify First Name Cant Contain Num At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid First Name", async () => {
            await bookHotelPage.enterFirstName(inValidTestData.InvalidFirstName.ContainNum);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify First Name Error Message", async () => {
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.NotValidFirstName);
        });
    });


    test("Verify First Name Error MSG For Short Name At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid First Name", async () => {
            await bookHotelPage.enterFirstName(inValidTestData.InvalidFirstName.Short);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify First Name Error Message", async () => {
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.NotValidFirstName);
        });
    });


    test("Verify First Name Error MSG For Only Num Name At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid First Name", async () => {
            await bookHotelPage.enterFirstName(inValidTestData.InvalidFirstName.OnlyNum);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify First Name Error Message", async () => {
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.NotValidFirstName);
        });
    });


    test("Verify First Name Error MSG For Empty Name At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify First Name Error Message", async () => {
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getFirstNameFieldErrorMSG(), "First Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.EmptyFirstName);
        });
    });


    test("Verify Last Name Cant Contain Num At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid Last Name", async () => {
            await bookHotelPage.enterLastName(inValidTestData.InvalidLastName.ContainNum);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Last Name Error Message", async () => {
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.NotValidLastName);
        });
    });


    test("Verify Last Name Error MSG For Short Name At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid Last Name", async () => {
            await bookHotelPage.enterLastName(inValidTestData.InvalidLastName.Short);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Last Name Error Message", async () => {
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.NotValidLastName);
        });
    });


    test("Verify Last Name Error MSG For Only Num Name At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid Last Name", async () => {
            await bookHotelPage.enterLastName(inValidTestData.InvalidLastName.OnlyNum);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Last Name Error Message", async () => {
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.NotValidLastName);
        });
    });


    test("Verify Last Name Error MSG For Empty Name At Book Hotel Page", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Last Name Error Message", async () => {
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getLastNameFieldErrorMSG(), "Last Name Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.EmptyLastName);
        });
    });


    test("Verify Billing Address Error MSG For Short Address", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid Billing Address", async () => {
            await bookHotelPage.enterBillingAddress(inValidTestData.InValidAddress.Short);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Billing Address Error Message", async () => {
            await expect.soft(bookHotelPage.getBillingAddressFieldErrorMSG(), "Billing Address Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getBillingAddressFieldErrorMSG(), "Billing Address Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.NotValidBillingAddress);
        });
    });


    test("Verify Billing Address Error MSG For Empty Address", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Billing Address Error Message", async () => {
            await expect.soft(bookHotelPage.getBillingAddressFieldErrorMSG(), "Billing Address Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getBillingAddressFieldErrorMSG(), "Billing Address Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.EmptyBillingAddress);
        });
    });


    test("Verify CCNum Cant Contain Characters", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid Credit Card Number", async () => {
            await bookHotelPage.enterCreditCardNum(inValidTestData.InValidCC.CCNumContainChar);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Number Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardNumFieldErrorMSG(), "Credit Card Number Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardNumFieldErrorMSG(), "Credit Card Number Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.ErrorCreditCard);
        });
    });


    test("Verify CCNum Error MSG For Less Than Sixteen Digits", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid Credit Card Number", async () => {
            await bookHotelPage.enterCreditCardNum(inValidTestData.InValidCC.CCNumShort);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Number Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardNumFieldErrorMSG(), "Credit Card Number Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardNumFieldErrorMSG(), "Credit Card Number Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.ErrorCreditCard);
        });
    });


    test("Verify CCNum Error MSG If Empty", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Number Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardNumFieldErrorMSG(), "Credit Card Number Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardNumFieldErrorMSG(), "Credit Card Number Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.ErrorCreditCard);
        });
    });


    test("Verify Error MSG For Not Selected CC Type", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Type Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardTypeSelectorErrorMSG(), "Credit Card Type Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardTypeSelectorErrorMSG(), "Credit Card Type Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.CreditCardTypeNotSelected);
        });
    });


    test("Verify Error MSG For Not Selected Expiry Month", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Select Expiry Year", async () => {
            await bookHotelPage.selectCreditCardExpiryDateYear(validTestData.CCExpireYear);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Expiry Date Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.CreditCardExpiryDateNotSelectedMonth);
        });
    });


    test("Verify Error MSG For Not Selected Expiry Year", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Select Expiry Month", async () => {
            await bookHotelPage.selectCreditCardExpiryDateMonth(validTestData.CCExpireMonth);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Expiry Date Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.CreditCardExpiryDateNotSelectedYear);
        });
    });


    test("Verify Error MSG For Not Selected Expiry Month And Year", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Expiry Date Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.CreditCardExpiryDateNotSelectedMonthAndYear);
        });
    });

    test("Verify Error MSG For Passed Expiry Date", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Select Expiry Month and Year", async () => {
            await bookHotelPage.selectCreditCardExpiryDateMonth(validTestData.CCExpireMonth);
            await bookHotelPage.selectCreditCardExpiryDateYear(inValidTestData.InValidCC.CCPassedExpireYear);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Expiry Date Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardExpiryDateSelectorsErrorMSG(), "Credit Card Expiry Date Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.CreditCardExpiryDatePassed);
        });
    });


    test("Verify Error MSG Visibility When CC Cvv Has InValid Short Data", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Enter Invalid Credit Card Cvv Number", async () => {
            await bookHotelPage.enterCreditCardCvvNum(inValidTestData.InValidCC.CCCsvShort);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Cvv Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardCvvFieldErrorMSG(), "Credit Card Cvv Error Message Not Visible").toBeVisible();
        });
    });


    test("Verify CC Cvv Cant Be Empty", async ({ selectHotelPage, bookHotelPage }) => {

        await test.step("Select Hotel and Click Continue", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Click Book Button", async () => {
            await bookHotelPage.clickBookButton();
        });

        await test.step("Verify Credit Card Cvv Error Message", async () => {
            await expect.soft(bookHotelPage.getCreditCardCvvFieldErrorMSG(), "Credit Card Cvv Error Message Not Visible").toBeVisible();
            await expect.soft(bookHotelPage.getCreditCardCvvFieldErrorMSG(), "Credit Card Cvv Error Message Does Not Match").toHaveText(uiMSGs.BookHotelPage.Errors.EmptyCvvNum);
        });
    });
});