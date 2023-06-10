import React, { useState, useEffect, Suspense } from "react";
import {
  Grid,
  Loading,
  Input,
  Button,
  useTheme,
  Text,
  Pagination,
  Dropdown,
  Modal,
  Row,
  Col,
  Checkbox,
  Popover,
  Container,
  gray,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "./Box";
import TodoCard from "./TodoCard";
import { GetTodos, AddTodo, TeamApi } from "../api/http/todosRequest";

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

  const [users, setUsers] = useState([]);

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.sort((a, b) => b.id - a.id).slice(indexOfFirstTodo, indexOfLastTodo);




  const [UserSelected, setUserSelected] = React.useState("user");

  const selectedValue = React.useMemo(
    () => Array.from(UserSelected), [UserSelected]
  );


  const notify = (proccess) => toast(proccess);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo()
    }
  }

  const handleAddTodo = () => {
    setLoading(true);
    if (task_msg.trim().length > 2) {

      //  Time Conversion HH:MM into SS
      const [hours, minutes] = task_time.split(":");
      const timeInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
      // console.log(timeInSeconds);

      // TimeZone Offset Value
      const currentDate = new Date();
      const timezoneOffsetInSeconds = Math.abs(currentDate.getTimezoneOffset() * 60);
      // console.log(timezoneOffsetInSeconds);

      AddTodo({ assigned_user: selectedValue[0], task_date: task_date, task_time: timeInSeconds, time_zone: timezoneOffsetInSeconds, is_completed: 0, task_msg: task_msg })
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
              setTask_msg("");
              setTask_date("");
              setTask_time("");
            });
        })
    } else {
      notify("Todo content length min 3 characters")
    }



  };

  useEffect(() => {
    TeamApi().then((res) => {
      setUsers(res.data.results.data);

    }).catch((err) => {
      console.log(err);
    });

    GetTodos()
      .then((res) => {
        setTodos(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });


  }, []);


  // update UI
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

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


        {/* adding Task Modal */}
        <Modal
          closeButton
          aria-labelledby="adding_task"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="adding_task" size={18}>
              <h3>Adding Task</h3>
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              clearable
              label="Task Description"
              value={task_msg}
              onChange={(e) => setTask_msg(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <Row justify="space-between">
              <Input
                width="45%"
                label="Date"
                type="date"
                value={task_date}
                onChange={(event) => {
                  const newDate = event.target.value;
                  const formattedDate = new Date(newDate).toISOString().split("T")[0];
                  console.log("selected date", newDate);
                  console.log("formated date", formattedDate);
                  setTask_date(formattedDate)
                }}
              />
              <Input
                width="45%"
                label="Time"
                type="time"
                id="time" step="1800" min="00:00" max="23:59"
                name="time" value={task_time}
                onChange={(event) => {
                  const newTime = event.target.value;
                  console.log(newTime);
                  setTask_time(newTime);
                }}
              />
            </Row>

            {/* {console.log(users)} */}
            <Dropdown>
              <Dropdown.Button flat>{selectedValue}</Dropdown.Button>
              <Dropdown.Menu aria-label="Single selection actions"
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={UserSelected}
                onSelectionChange={setUserSelected}
                items={users}
              >
                {(item) => (
                  <Dropdown.Item key={item.id} >
                    {item.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* {console.log("slected value",selectedValue)}
            {console.log("uservalue value",UserSelected)} */}
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onPress={closeHandler}>
              Cancel
            </Button>

            <Button onPress={handleAddTodo} css={{ ml: "$10" }} auto   >
              Add
            </Button>
          </Modal.Footer>
        </Modal>


        <Box css={{ m: "$10" }}>

          <Container
            css={{
              w: 500, border: "solid 2px #ECF0F1", p: 0

            }}
          >

            <Row justify="space-between" css={{
              bgColor: "#F2F1EF", p: 10

            }}>
              <Text><h3>Task</h3></Text>
              <Button auto shadow onPress={handler}>
                Add Task
              </Button>
            </Row>
            {todos.map((item) => (
              // <Grid key={item.id} xs={10} sm={6} md={3}>
              <TodoCard
                setLoading={setLoading}
                setTodos={setTodos}
                item={item}
              />
              // </Grid>
            ))}
          </Container>

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
