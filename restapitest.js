import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import {url,vus,duration } from './env_rest_api.js';



export const options = {
  vus:vus,
  // duration:duration,
  stages: [
    { duration: "5s", target: 5 }, // needs for local testing
    { duration: "5s", target: 5 },
    { duration: "5s", target: 5 },
    { duration: "10s", target: 5 }
  ],

 
  ext: {
    loadimpact: {
      projectID: 3607882,
      // Test runs with the same name groups test runs together
      name: "Rest Api"
    }
  },
  
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 600ms
  },
  
}


const data = new SharedArray('Rest Api Data', function () {
  return JSON.parse(open('./restapiData.json')).users;
});


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
    const sdata = {"email":"resjhsd@gmail.com"}
    const putres = http.put(urlpost,JSON.stringify(sdata),params, {
      tags : {
        my_tag : "put data "
      }
    })
    check(putres,{
      "Put status is 200 is ok ": (r)=> r.status === 200,
    })
  }

  //This is delete Data 
  
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

