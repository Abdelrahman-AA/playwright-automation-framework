import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";


test.beforeEach("Login and Get Session ID Then Select Hotel And Open Select Page", async ({ page, loginService, bookHotelService, bookedItineraryPage }, testInfo) => {
    const sessionID: string = await loginService.getLoginPhpSessionId(
        validTestData.RegisteredAccount.UserName,
        validTestData.RegisteredAccount.Password);

    let response = await bookHotelService.bookHotel(
        validTestData.RegisteredAccount.FirstName,
        validTestData.RegisteredAccount.LastName,
        validTestData.BillingAddress,
        validTestData.CCNum,
        validTestData.CCType,
        validTestData.CCExpireMonth,
        validTestData.CCExpireYear,
        validTestData.CCCsv,
        validTestData.BookingData.Hotel,
        validTestData.BookingData.Location,
        validTestData.BookingDataItinerary.NumberOfRooms,
        validTestData.BookingData.CheckInDate,
        validTestData.BookingData.CheckOutDate,
        validTestData.BookingData.RoomType,
        validTestData.BookingDataItinerary.PricePerNight,
        validTestData.BookingDataItinerary.TotalPrice,
        validTestData.BookingDataItinerary.GST,
        validTestData.BookingDataItinerary.FinalBillingPrice,
        validTestData.BookingDataItinerary.AdultsPerRoom,
        validTestData.BookingDataItinerary.ChildrenPerRoom,
        sessionID)

    const htmlText = await response.text();

    const match = htmlText.match(/name="order_no"[^>]*value="([^"]*)"/);
    const orderNo = match ? match[1] : "";

    testInfo.annotations.push({ type: 'orderNo', description: orderNo });

    await loginService.injectSessionId(page, sessionID);

    await bookedItineraryPage.goToBooKItineraryPage();


});


test.describe("Happy Path Suite", { tag: "@happy @Book-Itinerary" }, () => {


    test('Verify Itinerary Page Opened', async ({ page }) => {

        await test.step("Verify Itinerary Page URL", async () => {
            await expect.soft(page, "Itinerary Page URL does not match expected URL").toHaveURL(uiURL.BookedItineraryPage);
        });

        await test.step("Itinerary Page Page Title", async () => {
            await expect.soft(page, "Itinerary Page Title does not match expected Title").toHaveTitle(uiMSGs.BookedItineraryPage.Title);
        });
    });


    test("Verify Book Itinerary Page Table Visible", async ({ bookedItineraryPage }) => {

        await test.step("Verify Table Is Visible", async () => {
            await expect(bookedItineraryPage.getTableResult(), "Table is not visible").toBeVisible();
        });
    });


    test("Verify Find My Booking Via Search By Booking Order Id", async ({ bookedItineraryPage }, testInfo) => {
        const orderNoAnnotation = testInfo.annotations.find(a => a.type === 'orderNo');
        const orderNo = orderNoAnnotation ? orderNoAnnotation.description : "";

        await test.step("Enter Order ID at Search", async () => {
            await bookedItineraryPage.enterOrderIdAtSearch(orderNo ? orderNo : "");
            await bookedItineraryPage.clickSearchOrderButton();
        });

        await test.step("Verify Search Results", async () => {
            const finalCount = await bookedItineraryPage.getTableRowsCount();
            expect(finalCount, "Search results do not match expected count").toEqual(1);
        });
    });


    test("Verify Data At Table When Search By Order Id", async ({ bookedItineraryPage }, testInfo) => {
        const orderNoAnnotation = testInfo.annotations.find(a => a.type === 'orderNo');
        const orderNo = orderNoAnnotation ? orderNoAnnotation.description : "";

        await test.step("Search By Order ID", async () => {
            await bookedItineraryPage.searchBookedOrderByOrderID(orderNo ? orderNo : "");
        });

        await test.step("Verify table row data matches expected test data", async () => {
            let data: string[] = await bookedItineraryPage.getTableDataOfRowIndex(0);
            expect.soft(data[3], "Hotel name does not match").toEqual(validTestData.BookingData.Hotel);
            expect.soft(data[4], "Location does not match").toEqual(validTestData.BookingData.Location);
            expect.soft(data[5].split(" ")[0].trim(), "Number of rooms does not match").toEqual(validTestData.BookingData.NumberOfRooms.split(" ")[0].trim());
            expect.soft(data[6], "First name does not match").toEqual(validTestData.RegisteredAccount.FirstName);
            expect.soft(data[7], "Last name does not match").toEqual(validTestData.RegisteredAccount.LastName);
            expect.soft(data[8], "Check-in date does not match").toEqual(validTestData.BookingData.CheckInDate);
            expect.soft(data[9], "Check-out date does not match").toEqual(validTestData.BookingData.CheckOutDate);
            expect.soft(data[10].split(" ")[0].trim(), "Number of nights does not match").toEqual(getDaysDifference(validTestData.BookingData.CheckInDate, validTestData.BookingData.CheckOutDate).toString());
            expect.soft(data[11], "Room type does not match").toEqual(validTestData.BookingData.RoomType);
            expect.soft(data[12].split(" ")[2].trim(), "Price per night does not match").toEqual(validTestData.BookingDataItinerary.PricePerNight);
            expect.soft(data[13].split(" ")[2].trim(), "Final billing price does not match").toEqual(validTestData.BookingDataItinerary.FinalBillingPrice);
        });
    });


    test("Verify Going To Search Page By Clicking Search Hotel Button At Itinerary Page", async ({ page, bookedItineraryPage }) => {

        await test.step("Click Search Hotel Button", async () => {
            await bookedItineraryPage.clickSearchHotelButton()
        });

        await test.step("Check Going To Search Hotel Page", async () => {
            await expect.soft(page, "Search Hotel Page URL Not Match").toHaveURL(uiURL.SearchHotelPage);
            await expect.soft(page, "Search Hotel Page Title Not Match").toHaveTitle(uiMSGs.SearchHotelPage.Title)
        });
    });


    test("Verify Going To Logout Page And Logging Out By Clicking Logout Button At Itinerary Page", async ({ page, bookedItineraryPage }) => {

        await test.step("Click Logout Button", async () => {
            await bookedItineraryPage.clickLogoutButton()
        });

        await test.step("Check Logout And Going To Logout Page", async () => {
            await expect.soft(page, "Logout Page URL Not Match").toHaveURL(uiURL.LogoutPage);
            await expect.soft(page, "Logout Page Title Not Match").toHaveTitle(uiMSGs.LogoutPage.Title)
        });
    });
});