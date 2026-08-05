import { test, expect } from "../fixtures/fixtures";
import { uiMSGs, validTestData } from "../test-data/testDataYamlReader";


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


test.describe("Happy Path Suite", { tag: "@happy @Book-Cancel" }, () => {


        test("Verify Cancel The Hotel Booking By Order Id", async ({ page, bookedItineraryPage }, testInfo) => {
        const orderNoAnnotation = testInfo.annotations.find(a => a.type === 'orderNo');
        const orderNo = orderNoAnnotation ? orderNoAnnotation.description : "";

        await test.step("Search By Order ID", async () => {
            await bookedItineraryPage.searchBookedOrderByOrderID(orderNo ? orderNo : "");
        });

        await test.step("Select Booked Order By Table Index", async () => {
            await bookedItineraryPage.checkSelectBookedOrderByTableIndex("0");
            page.once('dialog', async dialog => {
                await dialog.accept();
            });
            await bookedItineraryPage.clickCancelSelectedBookedOrders();
        });

        await test.step("Search By Order ID", async () => {
            await bookedItineraryPage.searchBookedOrderByOrderID(orderNo ? orderNo : "");
        });

        await test.step("Verify No Order Found", async () => {
            await expect(bookedItineraryPage.getSearchResultMsg(), "Search result message does not match").toHaveText(uiMSGs.BookedItineraryPage.NoOrder)
        });
    });


        test("Verify Cancel The Hotel Booking By Table Cancel Button", async ({ page, bookedItineraryPage }, testInfo) => {
        const orderNoAnnotation = testInfo.annotations.find(a => a.type === 'orderNo');
        const orderNo = orderNoAnnotation ? orderNoAnnotation.description : "";

        await test.step("Search By Order ID", async () => {
            await bookedItineraryPage.searchBookedOrderByOrderID(orderNo ? orderNo : "");
        });

        await test.step("Click Cancel Button To Booked Order At Table By Table Index", async () => {
            page.once('dialog', async dialog => {
                await dialog.accept();
            });
            await bookedItineraryPage.clickCancelButtonToBookedOrderAtTableByTableIndex("0");
        });

        await test.step("Search By Order ID", async () => {
            await bookedItineraryPage.searchBookedOrderByOrderID(orderNo ? orderNo : "");
        });

        await test.step("Verify No Order Found", async () => {
            await expect(bookedItineraryPage.getSearchResultMsg(), "Search result message does not match").toHaveText(uiMSGs.BookedItineraryPage.NoOrder)
        });
    });


        test("Verify Cancel All Booking Itinerary", async ({ page, bookedItineraryPage }) => {

        await test.step("Select All Booked Orders", async () => {
            await bookedItineraryPage.checkToSelectAllBookedOrders();
        });

        await test.step("Click Cancel Button", async () => {
            page.once('dialog', async dialog => {
                await dialog.accept();
            });

            await bookedItineraryPage.clickCancelSelectedBookedOrders()
        });

        await test.step("Verify All Orders Cancelled", async () => {
            await expect(await bookedItineraryPage.getTableRowsCount(), "Table rows count does not match").toEqual(0);
        });
    });
});



test.describe("Negative Path Suite", { tag: "@negative @Book-Cancel" }, () => {


            test("Verify All Booking Still Exist When Click Cancel Booking Button Without Any Booking Selection", async ({ page, bookedItineraryPage }) => {
        let rowsCount1: number;
        let rowsCount2: number;

        await test.step("Get Initial Table Rows Count", async () => {
            rowsCount1 = await bookedItineraryPage.getTableRowsCount();
        });

        await test.step("Click Cancel Button Without Selection", async () => {
            page.once('dialog', async dialog => {
                await dialog.accept();
            });

            await bookedItineraryPage.clickCancelSelectedBookedOrders()
        });

        await test.step("Get Table Rows Count After Cancel", async () => {
           await page.reload();
            rowsCount2 = await bookedItineraryPage.getTableRowsCount();

        });

        await test.step("Verify No Orders Cancelled", async () => {
            await expect(rowsCount1, "Initial table rows count does not match").toEqual(rowsCount2);
        });
    });
});