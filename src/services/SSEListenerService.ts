import { TutorClass } from "@/model/TutorClass";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EventSourcePolyfill } from "event-source-polyfill";
import { ACTIONS, store } from "@/store";

export class SSEListenerService {
  private currentEventSource: EventSourcePolyfill;
  private _classId = "none";

  constructor(accessToken: string, classId: string) {
    const EventSource = EventSourcePolyfill;
    const options = {
      headers: {
        Authorization: "Bearer ".concat(accessToken),
      },
    };
    const url = "http://192.168.0.13:8080/tutor/attendance-for/".concat(
      classId
    );

    this.currentEventSource = new EventSource(url, options);

    this.currentEventSource.onmessage = (event: { data: string }) => {
      if (event.data !== "ping") {
        const theClass = new TutorClass(JSON.parse(event.data));
        console.log(theClass);
        this._classId = theClass.classId;
        store.dispatch(ACTIONS.UPDATE_CLASS, theClass).catch((e) => {
          console.error("SSEListener: ", e);
        });
      } else {
        console.log("ping");
      }
    };
  }

  public closeConnection(): void {
    this.currentEventSource.close();
  }

  // Getters

  get classId(): string {
    return this._classId;
  }
}
