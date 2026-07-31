import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";

export class BookHotelPage {

    // #region Locators
    private readonly hotelNameFixedField: Locator;
    private readonly locationFixedField: Locator;
    private readonly roomTypeFixedField: Locator;
    private readonly numOfRoomsFixedField: Locator;
    private readonly totalDaysFixedField: Locator;
    private readonly pricePerNightFixedField: Locator;
    private readonly totalPriceFixedField: Locator;
    private readonly gstFixedField: Locator;
    private readonly finalBilledPriceFixedField: Locator;
    private readonly firstNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly billingAddressField: Locator;
    private readonly creditCardNumField: Locator;
    private readonly creditCardTypeSelector: Locator;
    private readonly creditCardExpiryDateMonthSelector: Locator;
    private readonly creditCardExpiryDateYearSelector: Locator;
    private readonly creditCardCvvNumField: Locator;
    private readonly bookNowButton: Locator;
    private readonly cancelButton: Locator;
    private readonly errorMSGFirstNameField: Locator;
    private readonly errorMSGLastNameField: Locator;
    private readonly errorMSGBillingAddressField: Locator;
    private readonly errorMSGCreditCardNumField: Locator;
    private readonly errorMSGCreditCardTypeSelector: Locator;
    private readonly errorMSGCreditCardExpiryDateSelectors: Locator;
    private readonly errorMSGCreditCardCvvField: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.hotelNameFixedField = page.locator("#hotel_name_dis");
        this.locationFixedField = page.locator("#location_dis");
        this.roomTypeFixedField = page.locator("#room_type_dis");
        this.numOfRoomsFixedField = page.locator("#room_num_dis");
        this.totalDaysFixedField = page.locator("#total_days_dis");
        this.pricePerNightFixedField = page.locator("#price_night_dis");
        this.totalPriceFixedField = page.locator("#total_price_dis");
        this.gstFixedField = page.locator("#gst_dis");
        this.finalBilledPriceFixedField = page.locator("#final_price_dis");

        this.firstNameField = page.locator("#first_name");
        this.lastNameField = page.locator("#last_name");
        this.billingAddressField = page.locator("#address");
        this.creditCardNumField = page.locator("#cc_num");
        this.creditCardTypeSelector = page.locator("#cc_type");
        this.creditCardExpiryDateMonthSelector = page.locator("#cc_exp_month");
        this.creditCardExpiryDateYearSelector = page.locator("#cc_exp_year");
        this.creditCardCvvNumField = page.locator("#cc_cvv");

        this.bookNowButton = page.locator("#book_now");
        this.cancelButton = page.locator("#cancel");

        this.errorMSGFirstNameField = page.locator("#first_name_span");
        this.errorMSGLastNameField = page.locator("#last_name_span");
        this.errorMSGBillingAddressField = page.locator("#address_span");
        this.errorMSGCreditCardNumField = page.locator("#cc_num_span");
        this.errorMSGCreditCardTypeSelector = page.locator("#cc_type_span");
        this.errorMSGCreditCardExpiryDateSelectors = page.locator("#cc_expiry_span");
        this.errorMSGCreditCardCvvField = page.locator("#cc_cvv_span");
    }
    // #endregion

    // #region Actions
    async enterFirstName(firstName: string) {
        await this.firstNameField.clear();
        await this.firstNameField.fill(firstName);
    }

    async enterLastName(lastName: string) {
        await this.lastNameField.clear();
        await this.lastNameField.fill(lastName);
    }

    async enterBillingAddress(address: string) {
        await this.billingAddressField.clear();
        await this.billingAddressField.fill(address);
    }

    async enterCreditCardNum(ccNum: string) {
        await this.creditCardNumField.clear();
        await this.creditCardNumField.fill(ccNum);
    }

    async selectCreditCardType(type: string) {
        await this.creditCardTypeSelector.selectOption({ label: type });
    }

    async selectCreditCardExpiryDateMonth(month: string) {
        await this.creditCardExpiryDateMonthSelector.selectOption({ label: month });
    }

    async selectCreditCardExpiryDateYear(year: string) {
        await this.creditCardExpiryDateYearSelector.selectOption({ label: year });
    }

    async enterCreditCardCvvNum(cvvNum: string) {
        await this.creditCardCvvNumField.clear();
        await this.creditCardCvvNumField.fill(cvvNum);
    }
}