export interface StudentAttendedInterface {
  studentId: string;
  forename: string;
  surname: string;
  attended: boolean;
}

export class StudentAttended {
  private readonly _studentId: string;
  private readonly _forename: string;
  private readonly _surname: string;
  private readonly _attended: boolean;

  constructor(studentAttendedInterface: StudentAttendedInterface) {
    this._studentId = studentAttendedInterface.studentId;
    this._forename = studentAttendedInterface.forename;
    this._surname = studentAttendedInterface.surname;
    this._attended = studentAttendedInterface.attended;
  }

  // Getters

  get studentId(): string {
    return this._studentId;
  }

  get forename(): string {
    return this._forename;
  }

  get surname(): string {
    return this._surname;
  }

  get attended(): boolean {
    return this._attended;
  }

  // Static methods

  static toCollection(students: StudentAttendedInterface[]): StudentAttended[] {
    return students.map<StudentAttended>(
      (aStudent) => new StudentAttended(aStudent)
    );
  }
}
