import axios from "axios";
import { CookieJar } from "tough-cookie";

import axiosCookieJarSupport from "axios-cookiejar-support";
axiosCookieJarSupport(axios);

export class TestClient {
    url: string;
    jar: CookieJar;
    options: {
        jar: CookieJar;
        url: string;
        withCredentials: boolean;
    };

    constructor(url: string) {
        this.url = url;
        this.jar = new CookieJar();
        this.options = { jar: this.jar, url, withCredentials: true };
    }

    async me() {
        return axios.post(
            this.url,
            {
                query: `{
                    me {
                        id
                        email
                    }
                }`
            },
            this.options
        );
    }

    async forgotPasswordChange(newPassword: string, key: string) {
        return axios.post(
            this.url,
            {
                query: `
                    mutation {
                        forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
                            path
                            message
                        }
                }`
            },
            this.options
        );
    }

    async logout() {
        return axios.post(
            this.url,
            {
                query: `
                    mutation {
                        logout
                }`
            },
            this.options
        );
    }

    async register(email: string, password: string) {
        return axios.post(
            this.url,
            {
                query: `
                    mutation {
                        register(email: "${email}", password: "${password}") {
                            path
                            message
                    }
                }`
            },
            this.options
        );
    }

    async login(email: string, password: string) {
        return axios.post(
            this.url,
            {
                query: `
                    mutation {
                        login(email: "${email}", password: "${password}") {
                            path
                            message
                    }
                }`
            },
            this.options
        );
    }
}
