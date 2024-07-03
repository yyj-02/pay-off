import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: number) {
  let d = new Date(date),
    day = "" + d.getDate(),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear(),
    hour = "" + d.getHours(),
    minute = "" + d.getMinutes();

  if (day.length < 2) day = "0" + day;
  if (month.length < 2) month = "0" + month;
  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;

  return [day, month, year].join("/") + " " + [hour, minute].join(":");
}
