import { api } from "../axiosInstance";

import axios from "axios";


// const GetTodoss = async () => {
//   const result = await api.get();
//   return result;
// };

// const GetSingleTodo = async (id) => {
//   const result = await api.get(`${id}`);
//   return result;
// };

// const AddTodoo = async (data) => {
//   const result = await api.post("", data);
//   return result;
// };

// const UpdateTodoo = async (id, data) => {
//   const result = await api.put(`${id}`, data);
//   return result;
// };

// const DeleteTodoo = async (id) => {
//   const result = await api.delete(`${id}`);
//   return result;
// };

let accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODYyMDgwMjksIm5iZiI6MTY4NjIwODAyOSwianRpIjoiOTJhYjU5ODQtM2RjNS00NGVkLWJkZmUtOTlmN2QyN2M2MzYzIiwiaWRlbnRpdHkiOnsibmFtZSI6IlNhcmF2YW5hbiBDIiwiZW1haWwiOiJzbWl0aHdpbGxzMTk4OUBnbWFpbC5jb20iLCJ1c2VyX2lkIjoidXNlcl84YzJmZjIxMjhlNzA0OTNmYTRjZWRkMmNhYjk3YzQ5MiIsImljb24iOiJodHRwOi8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvY2Y5NGI3NGJkNDFiNDY2YmIxODViZDRkNjc0ZjAzMmI_ZGVmYXVsdD1odHRwcyUzQSUyRiUyRnMzLnNsb292aS5jb20lMkZhdmF0YXItZGVmYXVsdC1pY29uLnBuZyIsImJ5X2RlZmF1bHQiOiJvdXRyZWFjaCJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.hb2zIuFyJ_eL6sAqfP3BgZ7JS2LykBhd1JDWsHeNm6g";
let companyId = "company_0f8d040401d14916bc2430480d7aa0f8";
let userId = "user_8c2ff2128e70493fa4cedd2cab97c492";

// authentication & getting Access Token

const Authentication = async (email, password) => {


  const apiUrl = 'https://stage.api.sloovi.com/login?product=outreach';

const loginpostData = {
  email: email,
  password: password,
};

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};


const result = await axios.post(apiUrl, JSON.stringify(loginpostData), { headers })


return result;
};



// // 2 team data fetch

// // *************** replace or remove companyId ***************
const commonheaders = {
  'Authorization': `Bearer ${accessToken}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const TeamApi = async () => {

const teamApiUrl = "https://stage.api.sloovi.com/team?product=outreach&company_id=company_0f8d040401d14916bc2430480d7aa0f8";




await axios.get(teamApiUrl, { headers: commonheaders })
  .then(response => {
    const users = response.data.results.data;
    console.log(response.data);
    console.log(response.data.results.data[0].id);
    console.log(response.data.results.data[0].name);
    console.log(response.data.results.data[1].id);
    console.log(response.data.results.data[1].name);

    // Populate the dropdown with user details
    // const dropdown = document.getElementById('userDropdown');
    // console.log("dropdown element",dropdown)

    // users.forEach(user => {
    //   console.log(user.id);
    //   console.log(user.name);
    //   const option = document.createElement('option');
    //   option.value = user.id;
    //   option.text = user.name;
    //   dropdown.appendChild(option);
    // });


  })
  .catch(error => {
    console.error(error);
  });

}
TeamApi()



  // 1.1 adding taks

 
  const fetchputapiUrl = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=company_0f8d040401d14916bc2430480d7aa0f8`;



  const AddTodo = async (data) => {
// const addpostData = {
//   assigned_user: userId,
//   task_date: '<date-in-YYYY-MM-DD-format>',
//   task_time: '<time-in-seconds>',
//   is_completed: '<0-or-1-integer>',
//   time_zone: '<current-timezone-in-seconds>',
//   task_msg: '<task-description>',
// };

const result = await axios.post(fetchputapiUrl, data, { headers: commonheaders })
  // .then(response => {
  //   // Handle the response
  //   console.log(response.data);
  //   console.log("addtodos response",response.data);

  // })
  // .catch(error => {
  //   // Handle the error
  //   console.error(error);
  // });

//   // const AddTodo = async (data) => {
//   //   const result = await api.post("", data);
//   //   return result;
//   // };
return result;

}


  // 1.2 getting tasks
const GetTodos = async () => {
const result = await  axios.get(fetchputapiUrl, { headers: commonheaders })
  // .then(response => {
  //   const tasks = response.data.results;

  //   console.log("get tasks data", response.data);
  //   console.log("get tasks results", response.data.results);
  //   console.log("get tasks results 1  ", response.data.results[0]);
  //   console.log("get tasks results 2  ", response.data.results[1]);
  //   // Handle the tasks
  // })
  // .catch(error => {
  //   console.error(error);
  // });
return result;
};

  //const GetTodos = async () => {
//   const result = await api.get();
//   return result;
// };


// 1.4 updatedata

const UpdateTodo = async (id, data) => {
  const updateTaskUrl = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${id}?company_id=${companyId}`;

  const result = await axios.put(updateTaskUrl, data, { commonheaders })
  // .then(response => {
  //   // Handle the response
  //   console.log('Task updated successfully:', response.data);
  // })
  // .catch(error => {
  //   // Handle the error
  //   console.error('Error updating task:', error);
  // });
   

  // const UpdateTodo = async (id, data) => {
  //   const result = await api.put(`${id}`, data);
  //   return result;
  // };

  return result;
};

// 1.5 delete tasks



const DeleteTodo = async (id) => {
const deletetaskApi = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${id}?company_id=${companyId}`;

const result = axios.delete(deletetaskApi, { headers: commonheaders })
  .then(response => {
    console.log('Task deleted successfully');
  })
  .catch(error => {
    console.error('Error deleting task:', error);
  });
  return result;

  // const DeleteTodo = async (id) => {
  //   const result = await api.delete(`${id}`);
  //   return result;
  // };
};
export { GetTodos, AddTodo, UpdateTodo, DeleteTodo, Authentication, TeamApi };
