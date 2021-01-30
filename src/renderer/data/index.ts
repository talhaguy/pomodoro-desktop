import { CurrentIntervalData } from "../../shared";
import {
    saveIntervalData as _saveIntervalData,
    getSavedIntervalData as _getSavedIntervalData,
    deleteIntervalData as _deleteIntervalData,
} from "./getAndSetData";

export const saveIntervalData = ((storage: Storage) => (
    currentIntervalData: CurrentIntervalData
) => _saveIntervalData(storage, currentIntervalData))(window.localStorage);

export const getSavedIntervalData = ((storage: Storage) => () =>
    _getSavedIntervalData(storage))(window.localStorage);

export const deleteIntervalData = ((storage: Storage) => () =>
    _deleteIntervalData(storage))(window.localStorage);
