import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';

export class ChangePasswordService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async changePassword(sessionID: string, current_pass: string, new_password: string, re_password: string) {
        const response = await this.request.post((`https://${endPoints.Domain}${endPoints.ChangePassword}`), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `PHPSESSID=${sessionID}`,
            },
            form: {
                current_pass: current_pass,
                new_password: new_password,
                re_password: re_password,
                change_password_Submit: "Submit"
            }
        });

        return response;
    }
}