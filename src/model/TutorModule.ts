import { TutorClass, TutorClassInterface } from "@/model/TutorClass";

export interface TutorModuleInterface {
  moduleCode: string;
  moduleYear: string;
  classes: TutorClassInterface[];
}

export class TutorModule {
  private readonly _moduleCode: string;
  private readonly _moduleYear: string;
  private readonly _classes: TutorClass[];

  constructor(tutorModuleInterface: TutorModuleInterface) {
    this._moduleCode = tutorModuleInterface.moduleCode;
    this._moduleYear = tutorModuleInterface.moduleYear;
    this._classes = TutorClass.toCollection(tutorModuleInterface.classes);
  }

  // getters

  get moduleCode(): string {
    return this._moduleCode;
  }

  get moduleYear(): string {
    return this._moduleYear;
  }

  get classes(): TutorClass[] {
    return this._classes;
  }

  // static methods

  static toCollection(
    tutorModuleInterfaces: TutorModuleInterface[]
  ): TutorModule[] {
    return tutorModuleInterfaces.map<TutorModule>(
      (aModule) => new TutorModule(aModule)
    );
  }
}
