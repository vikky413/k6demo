import { check } from 'k6';
import { SharedArray } from 'k6/data';
import http from 'k6/http';
import { vus } from './env_rest.js';
import { duration } from './env_rest.js';



export const options = {
  ext: {
    loadimpact: {
      projectID: 3607882,
      // Test runs with the same name groups test runs together
      name: "Demo 1"
    }
  },
  vus:vus,
  duration:duration,
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
  
}

// not using SharedArray here will mean that the code in the function call (that is what loads and
// parses the json) will be executed per each VU which also means that there will be a complete copy
// per each VU
const data = new SharedArray('some data name', function () {
  return JSON.parse(open('./data.json')).users;
});
const url = 'https://petstore.swagger.io/v2/user'; 

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const user = data[0];

  // This is the Post Data 

  for(const jsondata of data){
   // console.log(jsondata);
    const postres = http.post(url,JSON.stringify(jsondata),params,{
      tags :{
        my_tag :"Post data "
      }
    })
    check(postres,{
      "post status is ok 200": (r)=> r.status === 200,
    })

  }

  // This is the get Data 
  for(const getdata of data) {
    //console.log(getdata.username)
    const urlget = url + `/${getdata.username}`
    const getres = http.get(urlget,params,{
      tags :{
        my_tag:"Get data"
      }
    })
    check(getres,{
      'get status ok 200' : (r)=> r.status === 200,
    })
  }
  
  // This is Put Data 
  for(const getpostdata of data){
    const urlpost = url + `/${getpostdata.username}` ;
    const sdata = {"email":"resjhsd"}
    const putres = http.put(urlpost,JSON.stringify(sdata),params, {
      tags : {
        my_tag : "put data "
      }
    })
    check(putres,{
      "Put status is 200 is ok ": (r)=> r.status === 200,
    })
  }

  // This is delete Data 

  for(const deldata of data) {
    const urldel = url + `/${deldata.username}`;
    const delres = http.del(urldel,null,params,{
      tags : {
        my_tag : "del data"
      }
    })
    check(delres,{
      "delete status is ok ": (r)=> r.status === 200,
    })
  }

}
