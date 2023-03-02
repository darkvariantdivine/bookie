import {PASSWORD_REQS} from "@/constants";

export function checkStrength(password: string): number {
  let satisfied: number = password.length >= 8 ? 1 : 0

  PASSWORD_REQS.forEach((req) => {
    if (req.req.test(password)) {
      satisfied += 1;
    }
  });

  return 100 / (PASSWORD_REQS.length + 1) * satisfied
}
