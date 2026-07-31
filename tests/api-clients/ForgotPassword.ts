import { APIRequestContext } from '@playwright/test';
import {endPoints} from '../test-data/testDataYamlReader';

export class ForgetPassword {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
  
  async forgetPassword(email:string) {
    const response = await this.request.post((endPoints.ForgetPassword), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        emailadd_recovery: email,
Submit: "Email Password"
      },
    });

    return response;
  }
}