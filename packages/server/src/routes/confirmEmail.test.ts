import axios from "axios";

test("Express route returns an error when an invalid ID is given", async () => {
    const res = await axios(`${process.env.TEST_HOST}/confirm/3424`, {
        validateStatus: () => true
    });
    expect(res.status).not.toEqual(200);
});
