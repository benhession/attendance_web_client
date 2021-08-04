import { TutorModule } from "@/model/TutorModule";
import { TutorClass } from "@/model/TutorClass";
import { Ref } from "vue";

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  items?: MenuItem[];
  command?(): void;
}

export class PanelMenuFormatter {
  static formatByYear(
    modules: TutorModule[],
    selectedClass: Ref<TutorClass | undefined>
  ): MenuItem[] {
    const menuItems = new Array<MenuItem>();
    const yearSet = new Set<string>();
    const yearArray = new Array<string>();
    let index = 0;

    // use a Set to ensure values are unique
    modules.forEach((module) => yearSet.add(module.moduleYear));

    // push values to an array to enable sorting
    yearSet.forEach((year) => {
      yearArray.push(year);
    });

    // sort by year starting with most recent
    yearArray.sort((a, b) => {
      return a > b ? -1 : 1;
    });

    // assemble MenuItem array
    yearArray.forEach((year) => {
      const stringIndex = index.toString();
      menuItems.push({
        key: stringIndex,
        label: year,
        icon: "pi pi-fw pi-folder",
        items: PanelMenuFormatter.formatModules(
          modules,
          year,
          stringIndex,
          selectedClass
        ),
      });
      index++;
    });

    return menuItems;
  }

  private static formatModules(
    modules: TutorModule[],
    year: string,
    parentIndex: string,
    selectedClass: Ref<TutorClass | undefined>
  ): MenuItem[] {
    const menuItems = new Array<MenuItem>();
    let index = 0;

    modules.forEach((module) => {
      if (module.moduleYear === year) {
        const indexString = parentIndex.concat("_").concat(index.toString());

        menuItems.push({
          key: indexString,
          label: module.moduleCode,
          icon: "pi pi-fw pi-folder",
          items: PanelMenuFormatter.formatClasses(
            module.classes,
            indexString,
            selectedClass
          ),
        });
      }
      index++;
    });
    return menuItems;
  }

  private static formatClasses(
    classes: TutorClass[],
    parentIndex: string,
    selectedClass: Ref<TutorClass | undefined>
  ): MenuItem[] {
    const menuItems = new Array<MenuItem>();
    const index = 0;

    // sort classes sequentially by id
    classes.sort((a, b) => {
      return a.classId < b.classId ? -1 : 1;
    });

    classes.forEach((aClass) => {
      const indexString = parentIndex.concat("_").concat(index.toString());

      menuItems.push({
        key: indexString,
        label: aClass.name,
        icon: "pi pi-fw pi-book",
        command: () => {
          selectedClass.value = aClass;
        },
      });
    });

    return menuItems;
  }
}
