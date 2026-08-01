import { Locator, Page } from "@playwright/test";
import { StaticBarAtLogged } from "./Components/StaticBarAtLogged";

export class BookConfirmPage {

    // #region Components
    readonly staticBar: StaticBarAtLogged;
    // #endregion

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
        this.staticBar = new StaticBarAtLogged(page);

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
    getHotelNameFixedField(): Locator {
        return this.hotelNameFixedField;
    }

    getLocationFixedField(): Locator {
        return this.locationFixedField;
    }

    getRoomTypeFixedField(): Locator {
        return this.roomTypeFixedField;
    }

    getArrivalDateFixedField(): Locator {
        return this.arrivalDateFixedField;
    }

    getDepartureDateFixedField(): Locator {
        return this.departureDateFixedField;
    }

    getTotalRoomsFixedField(): Locator {
        return this.totalRoomsFixedField;
    }

    getAdultsPerRoomFixedField(): Locator {
        return this.adultsPerRoomFixedField;
    }

    getChildrenPerRoomFixedField(): Locator {
        return this.childrenPerRoomFixedField;
    }

    getPricePerNightFixedField(): Locator {
        return this.pricePerNightFixedField;
    }

    getTotalPriceFixedField(): Locator {
        return this.totalPriceFixedField;
    }

    getGstFixedField(): Locator {
        return this.gstFixedField;
    }

    getFinalBillingPriceFixedField(): Locator {
        return this.finalBillingPriceFixedField;
    }

    getFirstNameFixedField(): Locator {
        return this.firstNameFixedField;
    }

    getLastNameFixedField(): Locator {
        return this.lastNameFixedField;
    }

    getBillingAddressFixedField(): Locator {
        return this.billingAddressFixedField;
    }

    getOrderNoFixedField(): Locator {
        return this.orderNoFixedField;
    }
    // #endregion
}