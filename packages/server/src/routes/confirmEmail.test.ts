import phin from "phin";

test("Express route returns an error when an invalid ID is given", async () => {
    const res = await phin(`${process.env.TEST_HOST}/confirm/3424`);
    expect(res.statusCode).not.toEqual(200);
});
