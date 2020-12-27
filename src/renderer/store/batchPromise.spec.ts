import { batchPromise } from "./batchPromise";

describe("batchPromise()", () => {
    it("should return a resolved promise from the callback passed", (done) => {
        const cb = jest.fn().mockResolvedValue("a resolved value");
        batchPromise(cb).then((value) => {
            expect(value).toBe("a resolved value");
            done();
        });
    });

    it("should return a rejected promise from the callback passed", (done) => {
        const cb = jest.fn().mockRejectedValue("a rejected value");
        batchPromise(cb).catch((value) => {
            expect(value).toBe("a rejected value");
            done();
        });
    });
});
