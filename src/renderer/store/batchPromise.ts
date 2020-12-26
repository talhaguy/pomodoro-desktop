// the redux `batch` does not return any value
// this function wraps the original `batch` function so that any promise returned from

import { batch } from "react-redux";

// a dispatched action can be accessed
export function batchPromise<T>(cb: () => Promise<T>) {
    return new Promise<T>((res, rej) => {
        batch(() => {
            cb()
                .then((data) => res(data))
                .catch((err) => rej(err));
        });
    });
}
