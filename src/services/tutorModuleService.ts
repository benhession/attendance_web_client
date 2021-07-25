import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const webServiceTutorModules = axios.create({
  baseURL: "http://192.168.0.13:8080/tutor",
});

export default {
  fetchTutorModules(accessToken: string): Promise<AxiosResponse> {
    const token = "Bearer ".concat(accessToken);

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
      timeout: 10000,
      timeoutErrorMessage: "Unable to get response from resource server",
    };

    return webServiceTutorModules.get("/classes", config);
  },
};
