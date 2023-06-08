import React, { useState, useEffect, Suspense } from "react";
import {
  Grid,
  Loading,
  Input,
  Button,
  useTheme,
  Text,
  Pagination,
  Dropdown
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "./Box";
import TodoCard from "./TodoCard";
import { GetTodos, AddTodo, TeamApi} from "../api/http/todosRequest";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

const TodoList = () => {
  const { type, theme } = useTheme();
  const [todos, setTodos] = useState([]);
  const [task_msg, setTask_msg] = useState("");
  const [task_date, setTask_date] = useState("");
  const [task_time, setTask_time] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 8;

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.sort((a,b) => b.id - a.id).slice(indexOfFirstTodo, indexOfLastTodo);


 // console.log(SortedArray)

//  Authentication().then((res) => notify("Authentication sucessfull"))
//  .catch((err) => notify("Upss somethings went wrong"))
//  .finally(() => {
//   setLoading(false);
//   notify("Success");
//   })
  const notify = (proccess) => toast(proccess);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo()
    }
  }

  const handleAddTodo = () => {
    setLoading(true);
    if(task_msg.trim().length > 2){
      const formattedTime = dayjs(task_time).format('HH:mm:ss');
      console.log("before conversion",formattedTime);
const [hours, minutes] = formattedTime.split(":");
const timeInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;

console.log(timeInSeconds);    
const currentDate = new Date();
const timezoneOffsetInSeconds = Math.abs(currentDate.getTimezoneOffset() * 60);
console.log(timezoneOffsetInSeconds);

      AddTodo({assigned_user:"user_8c2ff2128e70493fa4cedd2cab97c492", task_date:task_date, task_time:timeInSeconds, time_zone:timezoneOffsetInSeconds,  is_completed:false, task_msg:task_msg })
      .then((res) => notify("Addedtasks"))
      .catch((err) => notify("Upss somethings went wrong"))
      .finally(() => {
        
        GetTodos()
          .then((res) => {
            setTodos(res.data.results);
          })
          .catch((err) => {
           notify("Upss somethings went wrong");
          })
          .finally(() => {
            setLoading(false);
            notify("Success");
          });
      })
    }else {
      notify("Todo content length min 3 characters")
    }
   
    setTask_msg("");
    setTask_date("");
    setTask_time("");
  
  };

  useEffect(() => {
    GetTodos()
      .then((res) => {
        setTodos(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });

     
  }, []);

  if (todos) {
    return (
      <Suspense
        fallback={
          <Box
            css={{
              width: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading
              type="default"
              loadingCss={{ $$loadingSize: "100px", $$loadingBorder: "10px" }}
            />
          </Box>
        }
      >
        <Box css={{ mt: "$5" }}>
          <Box
            css={{
              mt: "$15",
              mb: "$10",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Input
              width="400px"
              clearable
              bordered
              labelPlaceholder="Task Desc"
              value={task_msg}
              onChange={(e) => setTask_msg(e.target.value)}
              onKeyDown={handleKeyDown}
              css={{
                mr: "$10",
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date" 
              value={task_date}
              onChange={(newvalue) => {
                const formattedDate = dayjs(newvalue).format('YYYY-MM-DD');
                setTask_date(formattedDate)}}
            />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                      label="Time"
                      value={task_time}
                      onChange={(newValue) =>{
            setTask_time(newValue)
                      } } />
                  </LocalizationProvider>


                  
                  <Dropdown id="userDropdown">
      <Dropdown.Button flat>user</Dropdown.Button>
      <Dropdown.Menu aria-label="user">
        <Dropdown.Item key="new">User1</Dropdown.Item>
        <Dropdown.Item key="copy">User2</Dropdown.Item>
        <Dropdown.Item key="edit">User3</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>


            <Button
              onClick={handleAddTodo}
              css={{ ml: "$10" }}
              color={theme.colors.gray800.value}
              auto
            >
              <Text b color={theme.colors.black.value}>
                Add
              </Text>
            </Button>
          </Box>
          <Pagination
          css={{
            float:"right",
            position:"relative"
          }}
            onClick={(e) => {
              setCurrentPage(Number(e.target.textContent));
            }}
            total={
              todos.length % todosPerPage === 0
                ? todos.length / todosPerPage
                : Math.floor(todos.length / todosPerPage + 1)
            }
            initialPage={currentPage}
          />
          <Grid.Container gap={2} justify="flex-start">
            {currentTodos.map((item) => (
              <Grid key={item.id} xs={10} sm={6} md={3}>
                <TodoCard
                  setLoading={setLoading}
                  setTodos={setTodos}
                  item={item}
                />
              </Grid>
            ))}
          </Grid.Container>
         
        </Box>
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={type === "dark" ? "dark" : "light"}
        />
      </Suspense>
    );
  }
  if (isLoading === true) {
    return (
      <Box
        css={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading
          type="default"
          loadingCss={{ $$loadingSize: "100px", $$loadingBorder: "10px" }}
        />
      </Box>
    );
  } 
};

export default TodoList;
