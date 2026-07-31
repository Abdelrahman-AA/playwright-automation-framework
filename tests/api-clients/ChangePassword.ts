import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';

export class ChangePassword {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async changePassword(current_pass: string, new_password: string, re_password: string) {
        const response = await this.request.post((endPoints.ChangePassword), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
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