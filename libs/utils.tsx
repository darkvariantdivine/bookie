import {Tab, TABS} from "@/constants";


export function populateArray<T>(toPopulate: T[], populated: T[]) {
  toPopulate.length = populated.length;
  populated.forEach((slot: T, index: number) => {toPopulate[index] = slot});
  return toPopulate
}

export function resetArray<T>(arr: T[]) {
  arr.length = 0;
  return arr
}

export function getActiveTab(path: string): string {
  for (let tab of TABS.slice(1)) {
    if (path.includes(tab.link)) {
      return tab.link;
    }
  }
  return TABS[0].link;
}