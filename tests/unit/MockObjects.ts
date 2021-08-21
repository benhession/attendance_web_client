import { TutorClass } from "@/model/TutorClass";
import moment from "moment";
import { StudentAttended } from "@/model/StudentAttended";

const tomorrow: string = moment().add(1, "day").toISOString().replace("Z", "");
const twoMinutesAgo: string = moment()
  .subtract(1, "minutes")
  .toISOString()
  .replace("Z", "");
const yesterday: string = moment()
  .subtract(1, "day")
  .toISOString()
  .replace("Z", "");

export const attendedStudent = new StudentAttended({
  studentId: "yarrowp3138",
  forename: "Peter",
  surname: "Yarrow",
  attended: true,
});

export const absentStudent = new StudentAttended({
  studentId: "traversm0936",
  forename: "Mary",
  surname: "Travers",
  attended: false,
});

export default {
  upcomingClass: new TutorClass({
    classId: "01",
    classType: "",
    name: "upcoming class",
    dateTime: tomorrow,
    duration: "PT1H",
    students: [],
    moduleCode: "",
    location: "",
  }),

  inProgressClass: new TutorClass({
    classId: "02",
    classType: "",
    name: "in-progress class",
    dateTime: twoMinutesAgo,
    duration: "PT1H",
    students: [],
    moduleCode: "",
    location: "",
  }),

  completedClass: new TutorClass({
    classId: "03",
    classType: "",
    name: "completed class",
    dateTime: yesterday,
    duration: "PT1H",
    students: [attendedStudent, absentStudent],
    moduleCode: "",
    location: "",
  }),
};
