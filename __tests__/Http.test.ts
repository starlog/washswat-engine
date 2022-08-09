import * as http from "../src/httpclient";

const queryObject = {
    method: 'get',
    url: 'https://apis.washswat.com/configuration/v1/admin/ui/editor',
    params: {
        screen: 'SCREEN001',
    },
    timeout: 300,
    useCache: true,
    CacheTTL: 100,
    retryConfig: {
        times: 3,
        interval: 10
    },
    headers: {
        "x-washswat-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo"
    }
};

const expectedResultCode = [200, 550, 403];


test('Http call', async () => {
    const data = await http.call(queryObject);
    expect(data).toBeDefined();
})

test('Http status call', async () => {
    const data = await http.callWithComStatus(queryObject, expectedResultCode);
    expect(data).toBeDefined();
})

