# Playwright Automation Framework

[![Playwright Tests](https://github.com/Abdelrahman-AA/playwright-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/Abdelrahman-AA/playwright-automation-framework/actions/workflows/playwright.yml)
[![Live Report](https://img.shields.io/badge/Report-GitHub%20Pages-brightgreen)](https://abdelrahman-aa.github.io/playwright-automation-framework/)

A robust test automation framework built with **TypeScript** and **Playwright**, focusing on **Independent E2E Tests**. It follows the **Page Object Model (POM)** combined with a **Component-Based** structure for UI pages, and **User Actions-Based** design for test scenarios. 

To optimize test execution time and bypass repetitive UI navigation, backend endpoints captured from the browser network were leveraged to inject sessions and prepare test states programmatically.

---

## Key Features

* **Independent Test Suites:** Designed with isolation in mind, avoiding flaky dependencies between test cases.
* **Page Object & Component-Based POM:** Clean separation of page structures and reusable UI components.
* **User Actions-Based Test Flows:** Test scenarios are written from an end-user interaction perspective.
* **Programmatic State Seeding (API-Assisted):** Uses captured browser requests and PHP session injection (PHPSESSID) to bypass long UI setup steps and speed up test execution.
* **Data-Driven Architecture:** Test data, URLs, messages, and endpoints are externally managed via **YAML** files.
* **CI/CD Integration (GitHub Actions):** 
  * Automatically runs tests on push/pull requests.
  * Publishes interactive HTML test reports to **GitHub Pages**.
  * Automatically creates a **GitHub Issue** with failure summaries if any test fails.
---

## Tech Stack

* **Language:** TypeScript
* **Test Engine:** Playwright Test Framework
* **Data Parser:** js-yaml
* **CI/CD:** GitHub Actions, GitHub Pages

---

**Quick Links:** 
[View Live HTML Report](https://abdelrahman-aa.github.io/playwright-automation-framework/) | 
[View Issues](https://github.com/Abdelrahman-AA/playwright-automation-framework/issues?q=is%3Aissue+is%3Aclosed)

---

## Project Structure

```text
playwright-automation-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml              # CI/CD pipeline configuration
├── tests/
│   ├── api-clients/
│   │   ├── BookHotelService.ts
│   │   ├── CancelOrderService.ts
│   │   ├── ChangePasswordService.ts
│   │   ├── ForgetPasswordService.ts
│   │   ├── GetBookedItineraryService.ts
│   │   ├── GetBookingOrderService.ts
│   │   ├── LoginService.ts
│   │   ├── NewAccountRegistrationService.ts
│   │   ├── SearchHotelService.ts
│   │   └── SelectHotelService.ts
│   ├── ui-pages/
│   │   ├── Components/
│   │   │   └── StaticBarAtLogged.ts
│   │   ├── BookConfirmPage.ts
│   │   ├── BookHotelPage.ts
│   │   ├── BookedItineraryPage.ts
│   │   ├── ChangePasswordPage.ts
│   │   ├── ForgetPasswordPage.ts
│   │   ├── LoginPage.ts
│   │   ├── LogoutPage.ts
│   │   ├── RegisterPage.ts
│   │   ├── SearchHotelPage.ts
│   │   └── SelectHotelPage.ts
│   ├── test-data/
│   │   ├── ApiEndPoints.yaml
│   │   ├── InValidTestData.yaml
│   │   ├── UiMSGs.yaml
│   │   ├── UiURLs.yaml
│   │   ├── ValidTestData.yaml
│   │   └── testDataYamlReader.ts
│   ├── helpers/
│   │   └── helpers.ts
│   ├── fixtures/
│   │   ├── ApiServicesIndex.ts
│   │   ├── UiPagesIndex.ts
│   │   └── fixtures.ts
│   └── specs/
│       ├── BookHotel.spec.ts
│       ├── CancelBookedHotel.spec.ts
│       ├── ChangePassword.spec.ts
│       ├── ForgotPassword.spec.ts
│       ├── HotelSearchAndFiltering.spec.ts
│       ├── LoginTest.spec.ts
│       ├── Registration.spec.ts
│       └── ViewAndCheckingTheBookingItineraries.spec.ts
├── playwright.config.ts                # Playwright global configuration
├── package.json                        # Project dependencies and scripts
└── tsconfig.json                       # TypeScript configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js** (v18+ or LTS version)
* **npm** (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdelrahman-AA/playwright-automation-framework.git
   cd playwright-automation-framework
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install --with-deps
   ```

---

## Running Tests

You can run tests locally using the scripts defined in `package.json`:

* **Run all general tests (excluding manual captcha):**
  ```bash
  npm run test:ci
  ```

* **Run fast test suite (parallel execution, excluding Change Password & Manual Captcha):**
  ```bash
  npm run test:fast
  ```

* **Run password change test suite (sequential execution):**
  ```bash
  npm run test:changePass
  ```

* **Run manual captcha tests (requires interaction):**
  ```bash
  npm run test:manualCaptcha
  ```

* **View the generated HTML report locally:**
  ```bash
  npx playwright show-report playwright-report
  ```

---

## CI/CD & Reporting

This project uses **GitHub Actions** for continuous integration. Every workflow execution:
1. Installs dependencies and browser binaries.
2. Executes the test suite safely respecting dependencies and data states.
3. Automatically generates an HTML report and a JSON summary (`results.json`).
4. Deploys the interactive dashboard live to **[GitHub Pages](https://abdelrahman-aa.github.io/playwright-automation-framework/)**.
5. Automatically creates a detailed bug report as a **GitHub Issue** if any test fails.

---
