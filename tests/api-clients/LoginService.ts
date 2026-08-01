import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';

export class LoginService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(username: string, password: string) {
    const response = await this.request.post((endPoints.Login), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        username: username,
        password: password,
        login: 'Login',
      },
    });

    return response;
  }

  async getLoginPhpSessId(username: string, password: string) {
    await this.login(username, password);

    const storage = await this.request.storageState();
    const sessionCookie = storage.cookies.find(c => c.name === 'PHPSESSID');

    return sessionCookie ? sessionCookie.value : 'Not found';
  }
}