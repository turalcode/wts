import {MONTHS_PARAMETERS} from "../constants";

export const useCheckVersion = {
    isSalaryReport: (key) => MONTHS_PARAMETERS[key]?.appVersion >= 1.1,
    isDayOff: (key) => MONTHS_PARAMETERS[key]?.appVersion >= 1.2
};
