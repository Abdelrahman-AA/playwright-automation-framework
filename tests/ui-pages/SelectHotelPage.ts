import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";

export class SelectHotelPage {

    // #region Locators
    private readonly resultTable: Locator;
    private readonly tableRadio: Locator;
    private readonly continueButton: Locator;
    private readonly cancelButton: Locator;
    private readonly errorMSGContinue: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.resultTable = page.locator("//td[@align='right']//table");
        this.tableRadio = page.locator(".//input[@type='radio']");
        this.continueButton = page.locator("#continue");
        this.cancelButton = page.locator("#cancel");

        this.errorMSGContinue = page.locator("#radiobutton_span");
    }
    // #endregion

    // #region Actions
    async selectRadioOptionByIndex(index: number) {
        let radios: number = await this.tableRadio.count();
        if (index <= radios && index >= 0)
            await this.tableRadio.nth(index).click();
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async clickCancelButton() {
        await this.cancelButton.click();
    }
    // #endregion

    // #region Getters
    getContinueErrorMSG() {
        this.errorMSGContinue;
    }
    // #endregion

    // #region Flows
    async selectRadioIndexAndClickContinue(index: number) {
        await this.selectRadioIndexAndClickContinue(index);
        await this.clickContinueButton();
    }
    // #endregion

}