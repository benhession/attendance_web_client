import {
  StudentAttended,
  StudentAttendedInterface,
} from "@/model/StudentAttended";
import moment from "moment";

export interface TutorClassInterface {
  classId: string;
  name: string;
  location: string;
  dateTime: string;
  duration: string;
  classType: string;
  students: StudentAttendedInterface[];
}

export enum ClassStatus {
  UPCOMING,
  IN_PROGRESS,
  PREVIOUS,
}

export class TutorClass {
  private readonly _classId: string;
  private readonly _name: string;
  private readonly _location: string;
  private readonly _dateTime: string;
  private readonly _duration: string;
  private readonly _classType: string;
  private readonly _students: StudentAttended[];

  constructor(tutorClassInterface: TutorClassInterface) {
    this._classId = tutorClassInterface.classId;
    this._name = tutorClassInterface.name;
    this._location = tutorClassInterface.location;
    this._dateTime = tutorClassInterface.dateTime;
    this._duration = tutorClassInterface.duration;
    this._classType = tutorClassInterface.classType;
    this._students = StudentAttended.toCollection(tutorClassInterface.students);
  }

  // Getters

  get classId(): string {
    return this._classId;
  }

  get name(): string {
    return this._name;
  }

  get location(): string {
    return this._location;
  }

  get startTime(): moment.Moment {
    return moment.utc(this._dateTime).local();
  }

  get duration(): moment.Duration {
    return moment.duration(this._duration);
  }

  get classType(): string {
    return this._classType;
  }

  get students(): StudentAttended[] {
    return this._students;
  }

  get classStatus(): ClassStatus {
    const now: moment.Moment = moment();

    if (now.isBefore(this.startTime)) {
      return ClassStatus.UPCOMING;
    } else if (now.isAfter(this.startTime.add(this.duration))) {
      return ClassStatus.PREVIOUS;
    } else {
      return ClassStatus.IN_PROGRESS;
    }
  }

  // static methods
  static toCollection(classes: TutorClassInterface[]): TutorClass[] {
    return classes.map<TutorClass>((aClass) => new TutorClass(aClass));
  }
}
