import axios, { AxiosRequestConfig } from "axios";
import { ACTIONS } from "@/store";
import { Buffer } from "buffer";
import { store } from "@/store";

const webServiceUniversityClass = axios.create({
  baseURL: "http://192.168.0.13:8080/class",
});

export default {
  fetchQRImage(classID: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      store
        .dispatch(ACTIONS.UPDATE_ACCESS_TOKEN)
        .then(() => {
          const token = "Bearer ".concat(store.getters.getAccessToken);

          const config: AxiosRequestConfig = {
            headers: {
              Authorization: token,
              Accept: "image/png",
            },
            responseType: "arraybuffer",
            timeout: 10000,
            timeoutErrorMessage: "Unable to get response from resource server",
            params: {
              classId: classID,
            },
          };

          webServiceUniversityClass
            .get("/qrcode", config)
            .then((response) => {
              switch (response.status) {
                case 200: {
                  const imageString = Buffer.from(
                    response.data,
                    "binary"
                  ).toString("base64");

                  const img = "data:image/png;base64,".concat(imageString);
                  resolve(img);
                  break;
                }
                case 204: {
                  reject(new Error("Class code not present"));
                  break;
                }
                default: {
                  reject(
                    "Unrecognised status code: ".concat(
                      response.status.toString()
                    )
                  );
                }
              }
            })
            .catch((error) => {
              if (error.message === "Network Error") {
                reject("Unable to reach resource server");
              } else {
                switch (error.response.status) {
                  case 412: {
                    reject(new Error("Class has finished"));
                    break;
                  }
                  case 417: {
                    reject(new Error("Tutor not found"));
                    break;
                  }
                  default: {
                    reject(
                      "Unable to update attendance: ".concat(error.message)
                    );
                  }
                }
              }
            });
        })
        .catch((e: Error) => {
          reject("Unable to get access token: ".concat(e.message));
        });
    });
  },
};
