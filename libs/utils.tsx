import {SLOT_INTERVAL, TABS} from "@/constants";

export function getActiveTab(path: string): string {
  for (let tab of TABS.slice(1)) {
    if (path.includes(tab.link)) {
      return tab.link;
    }
  }
  return TABS[0].link;
}

export function roundInterval(value: number): {[k: string]: number} {
  let interval: number = 60 * SLOT_INTERVAL;
  return {
    minutes: (Math.round(value / interval) * interval) % 60,
    hours: Math.floor((Math.round(value / interval) * interval) / 60)
  }
}