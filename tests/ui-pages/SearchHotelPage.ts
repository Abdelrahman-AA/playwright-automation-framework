import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";

export class SearchHotelPage {

        // #region Locators
        private readonly locationSelector :Locator;
        private readonly hotelsSelector :Locator;
        private readonly roomTypeSelector :Locator;
        private readonly numbersOfRoomsSelector :Locator;
        private readonly checkInDateField :Locator;
        private readonly checkOutDateField :Locator;
        private readonly adultPerRoomSelector :Locator;
        private readonly childrenPerRoomSelector :Locator;
        private readonly searchButton :Locator;
        private readonly resetButton :Locator;
        private readonly errorMSGLocationSelector :Locator;
        private readonly errorMSGCheckInDateField :Locator;
        private readonly errorMSGCheckOutDateField :Locator;
    // #endregion

        // #region Constructor
    constructor(public page: Page) {
        this.locationSelector = page.locator("#location");
        this.hotelsSelector = page.locator("#hotels");
        this.roomTypeSelector = page.locator("#room_type");
        this.numbersOfRoomsSelector = page.locator("#room_nos");
        this.checkInDateField = page.locator("#datepick_in");
        this.checkOutDateField = page.locator("#datepick_out");
        this.adultPerRoomSelector = page.locator("#adult_room");
        this.childrenPerRoomSelector = page.locator("#child_room");
        this.searchButton = page.locator("#Submit");
        this.resetButton = page.locator("#Reset");

        this.errorMSGLocationSelector = page.locator("#location_span");
        this.errorMSGCheckInDateField = page.locator("#checkin_span");
        this.errorMSGCheckOutDateField = page.locator("#checkout_span");
    }
    // #endregion

        // #region Actions
        
}