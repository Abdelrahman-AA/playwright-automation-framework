import { test, expect } from "../fixtures/fixtures";
import { getDaysDifference } from "../helpers/helpers";
import { uiURL, uiMSGs, validTestData, inValidTestData } from "../test-data/testDataYamlReader";

let longTimeOut: number = 60000;

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

        await test.step("", async () => {
            await expect(bookedItineraryPage.getTableResult()).toBeVisible();
        });
    });


    test.only("Verify Find My Booking Via Search By Booking Order Id", async ({ page, bookedItineraryPage }, testInfo) => {
        const orderNoAnnotation = testInfo.annotations.find(a => a.type === 'orderNo');
        const orderNo = orderNoAnnotation ? orderNoAnnotation.description : "";

        await test.step("", async () => {
            await bookedItineraryPage.enterOrderIdAtSearch(orderNo ? orderNo : "");
            await bookedItineraryPage.clickSearchOrderButton();

            await expect(async () => {
                const rowsCount = await bookedItineraryPage.getTableRowsCount();
                expect(rowsCount).toEqual(1);
            }).toPass({ timeout: longTimeOut });
        });

        await test.step("", async () => {
            const finalCount = await bookedItineraryPage.getTableRowsCount();
            console.log(finalCount);
            expect(finalCount).toEqual(1);
        });
    });
});