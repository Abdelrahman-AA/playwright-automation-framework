import { Locator, Page } from "@playwright/test";

export class BookHotelPage {

    // #region Locators
    private readonly hotelNameFixedField: Locator;
    private readonly locationFixedField: Locator;
    private readonly roomTypeFixedField: Locator;
    private readonly arrivalDateFixedField: Locator;
    private readonly departureDateFixedField: Locator;
    private readonly totalRoomsFixedField: Locator;
    private readonly adultsPerRoomFixedField: Locator;
    private readonly childrenPerRoomFixedField: Locator;
    private readonly pricePerNightFixedField: Locator;
    private readonly totalPriceFixedField: Locator;
    private readonly gstFixedField: Locator;
    private readonly finalBillingPriceFixedField: Locator;
    private readonly firstNameFixedField: Locator;
    private readonly lastNameFixedField: Locator;
    private readonly billingAddressFixedField: Locator;
    private readonly orderNoFixedField: Locator;

    private readonly searchHotelButton: Locator;
    private readonly myItineraryButton: Locator;
    private readonly logoutButton: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.hotelNameFixedField = page.locator("#hotel_name");
        this.locationFixedField = page.locator("#location");
        this.roomTypeFixedField = page.locator("#room_type");
        this.arrivalDateFixedField = page.locator("#arrival_date");
        this.departureDateFixedField = page.locator("#departure_text");
        this.totalRoomsFixedField = page.locator("#total_rooms");
        this.adultsPerRoomFixedField = page.locator("#adults_room");
        this.childrenPerRoomFixedField = page.locator("#children_room");
        this.pricePerNightFixedField = page.locator("#price_night");
        this.totalPriceFixedField = page.locator("#total_price");
        this.gstFixedField = page.locator("#gst");
        this.finalBillingPriceFixedField = page.locator("#final_price");
        this.firstNameFixedField = page.locator("#first_name");
        this.lastNameFixedField = page.locator("#last_name");
        this.billingAddressFixedField = page.locator("#address");
        this.orderNoFixedField = page.locator("#order_no");

        this.searchHotelButton = page.locator("#search_hotel");
        this.myItineraryButton = page.locator("#my_itinerary");
        this.logoutButton = page.locator("#logout");
    }
    // #endregion

    // #region Actions
    async clickSearchHotelButton() {
        await this.searchHotelButton.click();
    }

    async clickMyItineraryButton() {
        await this.myItineraryButton.click();
    }

    async clickLogoutButton() {
        await this.logoutButton.click();
    }
    // #endregion

    // #region Getters
    getHotelNameFixedField() {
        return this.hotelNameFixedField;
    }

    getLocationFixedField() {
        this.locationFixedField;
    }

    getRoomTypeFixedField() {
        this.roomTypeFixedField;
    }

    getArrivalDateFixedField() {
        this.arrivalDateFixedField;
    }

    getDepartureDateFixedField() {
        this.departureDateFixedField;
    }

    getTotalRoomsFixedField() {
        this.totalRoomsFixedField;
    }

    getAdultsPerRoomFixedField() {
        this.adultsPerRoomFixedField;
    }

    getChildrenPerRoomFixedField() {
        this.childrenPerRoomFixedField;
    }

    getPricePerNightFixedField() {
        this.pricePerNightFixedField;
    }

    getTotalPriceFixedField() {
        this.totalPriceFixedField;
    }

    getGstFixedField() {
        this.gstFixedField;
    }

    getFinalBillingPriceFixedField() {
        this.finalBillingPriceFixedField;
    }

    getFirstNameFixedField() {
        this.firstNameFixedField;
    }

    getLastNameFixedField() {
        this.lastNameFixedField;
    }

    getBillingAddressFixedField() {
        this.billingAddressFixedField;
    }

    getOrderNoFixedField() {
        this.orderNoFixedField;
    }
    // #endregion
}