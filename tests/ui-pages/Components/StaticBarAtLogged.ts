import { Locator, Page } from "@playwright/test";

export class StaticBarAtLogged {

    // #region Locators
    private readonly helloUserName: Locator;
    private readonly welcomeMsg: Locator;
    private readonly searchHotelCta: Locator;
    private readonly bookedItineraryCta: Locator;
    private readonly changePasswordCta: Locator;
    private readonly logoutCta: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.helloUserName = page.locator("#username_show");
        this.welcomeMsg = page.locator("//td[normalize-space()='Welcome to Adactin Group of Hotels']");
        this.searchHotelCta = page.locator("//a[normalize-space()='Search Hotel']");
        this.bookedItineraryCta = page.locator("//a[normalize-space()='Booked Itinerary']");
        this.changePasswordCta = page.locator("//a[normalize-space()='Change Password']");
        this.logoutCta = page.locator("//a[normalize-space()='Logout']");
    }
    // #endregion

    // #region Actions
    async clickSearchHotelCTA() {
        await this.searchHotelCta.click();
    }

    async clickBookedItineraryCTA() {
        await this.bookedItineraryCta.click();
    }

    async clickChangePasswordCTA() {
        await this.changePasswordCta.click();
    }

    async clickLogoutCTA() {
        await this.logoutCta.click();
    }
    // #endregion

    // #region Getters
    getHelloUserNameMSG(): Locator {
        return this.helloUserName;
    }

    getWelcomeMSG(): Locator {
        return this.welcomeMsg;
    }
    // #endregion
}