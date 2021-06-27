import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const keycloakMobileClient = axios.create({
  baseURL:
    "http://192.168.0.13:9090/auth/realms/master/protocol/openid-connect/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
});

const clientSecret = "b5768dbb-377c-45c1-a024-6e991ad1d35d";
const clientID = "web_client";
const scope = "web_client";

export interface KeyCloakTokens {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

export default {
  fetchTokensPwdGrant(
    username: string,
    password: string
  ): Promise<AxiosResponse<KeyCloakTokens>> {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", clientID);
    params.append("scope", scope);
    params.append("client_secret", clientSecret);
    params.append("username", username);
    params.append("password", password);

    const config: AxiosRequestConfig = {
      timeout: 10000,
      timeoutErrorMessage: "Unable to get response from authorisation server",
    };

    return keycloakMobileClient.post<KeyCloakTokens>("/", params, config);
  },
  fetchTokensRefreshTokenGrant(
    refreshToken: string
  ): Promise<AxiosResponse<KeyCloakTokens>> {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", clientID);
    params.append("client_secret", clientSecret);
    params.append("refresh_token", refreshToken);

    const config: AxiosRequestConfig = {
      timeout: 10000,
      timeoutErrorMessage: "Unable to get response from authorisation server",
    };

    return keycloakMobileClient.post<KeyCloakTokens>("/", params, config);
  },
};
