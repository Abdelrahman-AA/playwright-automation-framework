import { APIRequestContext, Page } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';

export class LoginService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(username: string, password: string) {
    const response = await this.request.post((`https://${endPoints.Domain}`), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        username: username,
        password: password,
        login: 'Login',
      },
      timeout: 30000
    });

    return response;
  }

  async getLoginPhpSessionId(username: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.login(username, password);

    const storage = await this.request.storageState();
    const sessionCookie = storage.cookies.find(c => c.name === 'PHPSESSID');

    return sessionCookie ? sessionCookie.value : 'Not found';
  }


  async injectSessionId(page: Page, sessionID: string) {
    await page.context().addCookies([
      {
        name: 'PHPSESSID',
        value: sessionID,
        domain: endPoints.Domain,
        path: '/',
      }
    ]);
  }
}