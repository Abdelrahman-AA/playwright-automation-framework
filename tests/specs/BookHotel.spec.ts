import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


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

        await test.step("", async () => {
            await expect(selectHotelPage.getResultTable()).toBeVisible();
        });
    });


    test("Verify Select Hotel Table Of Options Against Searched Data", async ({ selectHotelPage }) => {

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


    test("Verify Total Price Before GST Is Number Of Days by Price Per Night And Add ten", async ({ selectHotelPage, bookHotelPage }) => {
        let pricePerNight: string;
        let totalPrice: string;

        await test.step("", async () => {
            let pricePerNightList = await selectHotelPage.getTablePricesPerNightResult();
            pricePerNight = pricePerNightList[0];
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("", async () => {
            await expect(+totalPrice).toEqual((+pricePerNight * +(getDaysDifference((validTestData.BookingData.CheckInDate), (validTestData.BookingData.CheckOutDate)))) + 10)
        });
    });


    test("Verify Return To Search Form When Click Cancel From Select Page", async ({ page, searchHotelPage, selectHotelPage }) => {

        await test.step("", async () => {
            await selectHotelPage.clickCancelButton();
        });

        await test.step("Check Opening Search Hotel Page", async () => {
            await expect.soft(page, "Search Hotel Page URL Not Match").toHaveURL(uiURL.SearchHotelPage);
            await expect.soft(page, "Search Hotel Page Title Not Match").toHaveTitle(uiMSGs.SearchHotelPage.Title)
        });
    });


    test("Verify Going To Book Hotel Page After Select Hotel And Click Continue", async ({ page, selectHotelPage }) => {

        await test.step("", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("Check Opening Book Hotel Page", async () => {
            await expect.soft(page, "Book Hotel Page URL Not Match").toHaveURL(uiURL.BookHotelPage);
            await expect.soft(page, "Book Hotel Page Title Not Match").toHaveTitle(uiMSGs.BookHotelPage.Title)
        });
    });


    test("Verify Return To Select Page When Click Cancel From Book Hotel Page", async ({ page, selectHotelPage, bookHotelPage }) => {

        await test.step("", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("", async () => {
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

        await test.step("", async () => {
            let pricePerNightList = await selectHotelPage.getTablePricesPerNightResult();
            pricePerNight = pricePerNightList[0];
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("", async () => {
            await expect.soft(bookHotelPage.getHotelNameFixedField()).toHaveAttribute("value", validTestData.BookingData.Hotel);
            await expect.soft(bookHotelPage.getLocationFixedField()).toHaveAttribute("value", validTestData.BookingData.Location);
            await expect.soft(bookHotelPage.getRoomTypeFixedField()).toHaveAttribute("value", validTestData.BookingData.RoomType);
            await expect.soft(bookHotelPage.getNumOfRoomsFixedField()).toHaveAttribute("value", `${(validTestData.BookingData.NumberOfRooms).split(" ")[0].trim()} Room(s)`);
            await expect.soft(bookHotelPage.getTotalDaysFixedField()).toHaveAttribute("value", `${getDaysDifference(validTestData.BookingData.CheckInDate, validTestData.BookingData.CheckOutDate)} Day(s)`);
            await expect.soft(bookHotelPage.getPricePerNightFixedField()).toHaveAttribute("value", pricePerNight);
            await expect.soft(bookHotelPage.getTotalPriceFixedField()).toHaveAttribute("value", totalPrice);
        });
    });


    test("Verify GST As Ten Percent", async ({ selectHotelPage, bookHotelPage }) => {
        let pricePerNight: string;
        let totalPrice: string;

        await test.step("", async () => {
            let pricePerNightList = await selectHotelPage.getTablePricesPerNightResult();
            pricePerNight = pricePerNightList[0];
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("", async () => {
            await expect(bookHotelPage.getGstFixedField()).toHaveAttribute("value", `AUD $ ${((+totalPrice.split(" ")[2].trim()) / 10).toString()}`);

        });
    });


    test("Verify Final Billing Price Is Summation GST And Total Price", async ({ selectHotelPage, bookHotelPage }) => {
        let totalPrice: string;

        await test.step("", async () => {
            let totalPriceList = await selectHotelPage.getTableTotalPricesResult();
            totalPrice = totalPriceList[0];
        });

        await test.step("", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

        await test.step("", async () => {
            await expect(bookHotelPage.getFinalBilledPriceFixedField()).toHaveAttribute("value", `AUD $ ${((+totalPrice.split(" ")[2].trim()) * 1.1).toString().split(".")[0].trim()}`);

        });
    });


    test("Verify Booking With Valid Data",async({selectHotelPage,bookHotelPage})=>{

                await test.step("", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });

                        await test.step("", async () => {
            await selectHotelPage.selectRadioIndexAndClickContinue(0);
        });
    });
});







test.describe("Negative Path Suite", { tag: "@negative @Book-Hotel" }, () => {

    test("Verify Error MSG When Click Continue Without Select Hotel", async ({ selectHotelPage }) => {
        await test.step("", async () => {
            await selectHotelPage.clickContinueButton();
        });

        await test.step("", async () => {
            await expect.soft(selectHotelPage.getContinueErrorMSG()).toBeVisible();
            await expect.soft(selectHotelPage.getContinueErrorMSG()).toHaveText(uiMSGs.SelectHotelPage.Errors.NoSelectedHotel);
        });
    });
});