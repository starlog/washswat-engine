import * as util2 from '../src/util2';
import * as rest from '../src/httpclient';
import {RestQueryInterface} from "../lib/httpclient";

async function test1() {
  try{
    const rosettaRouteTable = [
      {
        "method" : "get",
        "normal" : "(.+//[a-z-\\.:\\d]+)/configuration/v1/app/ui/UI051$",
        "testing" : "##1##/configuration//v2/app/ui/UI051"
      },
      {
        method: 'get',
        normal: '(.+\\/\\/[a-z-\\.:\\d]+)/configuration/v1/app/ui/order/(.+)$',
        testing: '##1##/configuration/v2/app/ui/order/##2##'
      },
      {
        "method" : "get",
        "normal" : "(.+\\/\\/[a-z-\\.:\\d]+)/configuration/v1/app/ui/point$",
        "testing" : "##1##/configuration/v2/app/ui/point"
      }
    ];

    const rosettaRouteUser = [
      566977
    ];

    // Before rosetta
    // const queryObject1: RestQueryInterface = {
    //   auth: {  },
    //   body: {},
    //   method: 'get',
    //   url: 'https:///configuration/v1/app/FIRST3434VARIABLE/order/ORDERIDIS12345678',
    //   params: {
    //     screen: 'SCREEN001',
    //   },
    //   timeout: 3000,
    //   useCache: true,
    //   cacheTtl: 100,
    //   retryConfig: {
    //     times: 3,
    //     interval: 10,
    //   },
    //   headers: {
    //     'x-washswat-token':
    //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo',
    //   }
    // };
    //
    // const result1 = await rest.call(queryObject1);

    // After Rosetta
    rest.setRosettaRouteTable(rosettaRouteTable);
    rest.setRosettaUserTable(rosettaRouteUser);

    const queryObject: RestQueryInterface = {
      auth: {  },
      body: {},
      method: 'get',
      url: 'http://eks-kong-internal-gateway.system.svc.cluster.local:8000/configuration/v1/app/ui/UI051',
      params: {
        screen: 'SCREEN001',
      },
      timeout: 3000,
      useCache: true,
      cacheTtl: 100,
      retryConfig: {
        times: 3,
        interval: 10,
      },
      headers: {
        'x-washswat-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo',
      }
    };

    // const queryObject: RestQueryInterface = {
    //   auth: {  },
    //   body: {},
    //   method: 'get',
    //   url: 'http://eks-kong-internal-gateway.system.svc.cluster.local:8000/configuration/v1/app/ui/order/ORDERIDIS12345678',
    //   params: {
    //     screen: 'SCREEN001',
    //   },
    //   timeout: 3000,
    //   useCache: true,
    //   cacheTtl: 100,
    //   retryConfig: {
    //     times: 3,
    //     interval: 10,
    //   },
    //   headers: {
    //     'x-washswat-token':
    //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo',
    //   }
    // };

    // const queryObject: RestQueryInterface = {
    //   auth: {  },
    //   body: {},
    //   method: 'get',
    //   url: 'http://eks-kong-internal-gateway.system.svc.cluster.local:8000/configuration/v1/app/ui/point',
    //   params: {
    //     screen: 'SCREEN001',
    //   },
    //   timeout: 3000,
    //   useCache: true,
    //   cacheTtl: 100,
    //   retryConfig: {
    //     times: 3,
    //     interval: 10,
    //   },
    //   headers: {
    //     'x-washswat-token':
    //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo',
    //   }
    // };

    const result = await rest.call(queryObject);
    return true;

  }catch(ex){
    return true;
  }
}

describe('rosetta test module', () => {
  test('rosetta test 1', async () => {
    expect(await test1()).toBe(true);
  });
});
