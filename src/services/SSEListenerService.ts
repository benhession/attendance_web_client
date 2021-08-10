import { TutorClass } from "@/model/TutorClass";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EventSourcePolyfill } from "event-source-polyfill";
import { ACTIONS, store } from "@/store";

export class SSEListenerService {
  private static currentEventSource: EventSourcePolyfill | undefined;
  private static classId = "none";
  private static instance: SSEListenerService;

  private constructor(accessToken: string, classId: string) {
    const EventSource = EventSourcePolyfill;
    const options = {
      headers: {
        Authorization: "Bearer ".concat(accessToken),
      },
    };
    const url = "http://192.168.0.13:8080/tutor/attendance-for/".concat(
      classId
    );

    if (SSEListenerService.currentEventSource !== undefined) {
      SSEListenerService.currentEventSource.close();
    }

    // create eventsource
    SSEListenerService.currentEventSource = new EventSource(url, options);

    // define what to do when a message is received
    SSEListenerService.currentEventSource.onmessage = (event: {
      data: string;
    }) => {
      if (event.data !== "ping") {
        const theClass = new TutorClass(JSON.parse(event.data));

        store.dispatch(ACTIONS.UPDATE_CLASS, theClass).catch((e) => {
          console.error("SSEListener: ", e);
        });
      } else {
        console.log("SSEListenerService: ping");
      }
    };

    SSEListenerService.instance = this;
    SSEListenerService.classId = classId;
  }

  // Methods

  public static closeConnection(): void {
    if (SSEListenerService.currentEventSource !== undefined) {
      SSEListenerService.currentEventSource.close();
      SSEListenerService.classId = "none";
      SSEListenerService.currentEventSource = undefined;
    }
  }

  public static startConnection(
    accessToken: string,
    classId: string
  ): SSEListenerService {
    return new SSEListenerService(accessToken, classId);
  }

  public static getIdOfConnection(): string {
    return SSEListenerService.classId;
  }
}
