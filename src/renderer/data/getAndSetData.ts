import { CurrentIntervalData } from "../../shared";
import { SAVED_DATA_KEY } from "./constants";

// TODO: this is an mvp for persisting data; need to develop proper solution
export function saveIntervalData(
    storage: Storage,
    currentIntervalData: CurrentIntervalData
) {
    try {
        const savedDataStr = storage.getItem(SAVED_DATA_KEY);
        let savedData: CurrentIntervalData[];

        if (savedDataStr) {
            savedData = JSON.parse(savedDataStr);
            savedData.push(currentIntervalData);
        } else {
            savedData = [currentIntervalData];
        }

        storage.setItem(SAVED_DATA_KEY, JSON.stringify(savedData));
        return Promise.resolve();
    } catch (err) {
        console.error(err);
        return Promise.reject();
    }
}

export function getSavedIntervalData(storage: Storage) {
    try {
        const savedDataStr = storage.getItem(SAVED_DATA_KEY);
        let savedData: CurrentIntervalData[];

        if (savedDataStr) {
            savedData = JSON.parse(savedDataStr);
            return Promise.resolve(savedData);
        } else {
            return Promise.resolve([] as CurrentIntervalData[]);
        }
    } catch (err) {
        console.error(err);
        return Promise.reject();
    }
}

export function deleteIntervalData(storage: Storage) {
    storage.removeItem(SAVED_DATA_KEY);
}
