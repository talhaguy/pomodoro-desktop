import { CurrentIntervalData } from "../../shared";
import {
    saveIntervalData as _saveIntervalData,
    getSavedIntervalData as _getSavedIntervalData,
} from "./getAndSetData";

export const saveIntervalData = ((storage: Storage) => (
    currentIntervalData: CurrentIntervalData
) => _saveIntervalData(storage, currentIntervalData))(window.localStorage);

export const getSavedIntervalData = ((storage: Storage) => () =>
    _getSavedIntervalData(storage))(window.localStorage);
