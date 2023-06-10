import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Tooltip,
  Text,
  Badge,
  Modal,
  Input,
  Button,
  Radio,
  Container,
  Dropdown
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { DeleteTodo, GetTodos, UpdateTodo, TeamApi } from "../api/http/todosRequest";
import { DeleteIcon } from "./icons/deleteIcon";
import { IconButton } from "./icons/IconButton";
import { EditIcon } from "./icons/editIcon";
import { EyeIcon } from "./icons/eyeIcon";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';

const TodoCard = ({ item, setTodos, setLoading }) => {
  const [visible, setVisible] = useState(false);
  const [task_msg, setTask_msg] = useState(item.task_msg);
  const [task_date, setTask_date] = useState(item.task_date);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    TeamApi().then((res) => {
      setUsers(res.data.results.data);
      console.log("userdata @ todocard:", res.data.results.data)

    }).catch((err) => {
      console.log(err);
    });

  }, []);

  const [users, setUsers] = useState([]);
  const [UserSelected, setUserSelected] = React.useState("user");

  const selectedValue = React.useMemo(
    () => Array.from(UserSelected), [UserSelected]
  );


  //  Date & Time Manipulation
  const formattedDate = dayjs(item.task_date).format('DD-MM-YYYY');
  // console.log(formattedDate); // output 16.06.2023

  const hours = Math.floor(item.task_time / 3600);
  const minutes = Math.floor((item.task_time % 3600) / 60);
  const period = hours >= 12 ? 'pm' : 'am';

  const formattedTime = `${String(hours % 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${period}`;


  // Show date & time on update modal
  const totalSeconds = item.task_time; //  time in seconds

  const updatehours = Math.floor(totalSeconds / 3600);
  const updateminutes = Math.floor((totalSeconds % 3600) / 60);

  const updateformattedTime = `${updatehours.toString().padStart(2, "0")}:${updateminutes.toString().padStart(2, "0")}`;

  // console.log("Formatted time:", updateformattedTime);


  const [task_time, setTask_time] = useState(updateformattedTime);
  // console.log(formattedTime); // Output: "01:30am"


  const currentDate = new Date();
  const timezoneOffsetInSeconds = Math.abs(currentDate.getTimezoneOffset() * 60);


  //  Time Conversion HH:MM into SS

  const [reupdatehours, reupdateminutes] = task_time.split(":");
  const timeInSeconds = parseInt(reupdatehours) * 3600 + parseInt(reupdateminutes) * 60;
  // console.log(timeInSeconds);

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  const notify = (proccess) => toast(proccess);

  const handleDeleteTodo = (id) => {
    setLoading(true);
    DeleteTodo(id)
      .then((res) => notify("Deleting"))
      .catch((err) => {
        notify("Upss somethings went wrong")
      })
      .finally(() => {
        GetTodos().then((res) => setTodos(res.data.results));
        notify("Deleted");
      });
    setLoading(false);
  };


  const handleSetCompleted = (id) => {

    UpdateTodo(id, {
      "assigned_user": item.assigned_user,
      "task_date": item.task_date,
      "task_time": item.task_time,
      "is_completed": completed,
      "time_zone": item.time_zone,
      "task_msg": task_msg === "" ? item.task_msg : task_msg

    })
      .then((res) => {
        notify("Updating");
        if (res.data.code === 400 || res.data.status === "error") {
          notify("Error occured while updating");
          console.log("Error occured while updating: ", res.data);
          throw (res);
        } else {
          notify("Updated");

        }
      })

      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        GetTodos().then((res) => setTodos(res.data.results));
      });
  };


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUpdateTodo(item.id)
    }
  }

  const handleUpdateTodo = (id) => {
    const query = {
      task_msg: task_msg === "" ? item.task_msg : task_msg,
      task_date: task_date === item.task_date ? item.task_date : task_date,
      task_time: timeInSeconds === item.task_time ? item.task_time : timeInSeconds,
      time_zone: timezoneOffsetInSeconds === item.time_zone ? item.time_zone : timezoneOffsetInSeconds,
      is_completed: completed === item.is_completed ? item.is_completed : completed,
      assigned_user: selectedValue[0] === item.assigned_user ? item.assigned_user : selectedValue[0],

    };

    UpdateTodo(id, query)
      .then((res) => {
        notify("Updating")
        console.log("update response data", res.data);
        if (res.data.code === 400 || res.data.status === "error") {
          notify("Error occured while updating");
          console.log("Error occured while updating: ", res.data);
        } else {
          notify("Updated");
          console.log("updated successfully", res.data);
        }
      })
      .catch((err) => {

      })
      .finally(() => {
        GetTodos().then((res) => setTodos(res.data.results));
      });

    setVisible(false);
  };




  return (
    <>
      {/* Task Card */}
      <Card css={{
        width: 450,
        height: 120,
        m: 20,
      }}>
        <Card.Body css={{
          pt: 20,
        }}>

          <Row justify="space-between">
            <Col>
              <Text h3>{item.task_msg}</Text>
              <Text h5>{formattedDate} at {formattedTime}</Text>
            </Col>

            {/* <Text h5>Date,Time, Zone format to API</Text>
      <Text h5>{item.task_date}</Text>
      <Text h6>{item.task_time}</Text>
      <Text h6>{item.time_zone}</Text> */}

            <Row justify="flex-end">
              <Tooltip content="Edit Task">
                <IconButton onClick={handler}>
                  <EditIcon size={30} fill="#16181A" />
                </IconButton>
              </Tooltip>
            </Row>

            <Tooltip content="Do Completed" >
              <IconButton
                css={{ ml: "20px" }}
                onClick={() => handleSetCompleted(item.id)}
              >
                <EyeIcon size={30} fill="#16181A" />
              </IconButton>
            </Tooltip>
          </Row>
        </Card.Body>
      </Card>


      {/* Update Modal */}
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text >
            <h3>Update Task</h3>
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

          <Row justify="space-between">
            <Radio.Group
              onChange={(e) => {
                setCompleted(e);
              }}
              label="Status"
              defaultValue={item.is_completed}
            >
              <Radio value={1}>Completed</Radio>
              <Radio value={0}>Not Completed</Radio>
            </Radio.Group>
          </Row>

          <Dropdown>
            <Dropdown.Button flat>{selectedValue}</Dropdown.Button>
            <Dropdown.Menu aria-label="Single selection actions"
              color="secondary"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={UserSelected}
              value={item.assigned_user}
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

        </Modal.Body>
        <Modal.Footer>

          <Row justify="space-between">

            <IconButton onClick={() => handleDeleteTodo(item.id)}>
              <DeleteIcon size={30} fill="#FF0080" />
            </IconButton>
            <Row justify="flex-end">
              <Button  auto flat color="error" onPress={closeHandler}>
                Close
              </Button>
              <Button css={{ ml: "20px" }} auto onPress={() => handleUpdateTodo(item.id)}>
                Save
              </Button>
            </Row>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodoCard;
