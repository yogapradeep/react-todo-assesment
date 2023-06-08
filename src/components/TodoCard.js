import { useState } from "react";
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
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { DeleteTodo, GetTodos, UpdateTodo } from "../api/http/todosRequest";
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
  const [completed, setCompleted] = useState(0);

  const formattedDate = dayjs(item.task_date).format('DD-MM-YYYY');
  // console.log(formattedDate); // output 16.06.2023

  const hours = Math.floor(item.task_time / 3600);
  const minutes = Math.floor((item.task_time % 3600) / 60);
  const period = hours >= 12 ? 'pm' : 'am';

  const formattedTime = `${String(hours % 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${period}`;

  // console.log(formattedTime); // Output: "01:30am"

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
    const query = {
      isCompleted: completed ,
    };
    UpdateTodo(id, {
      "assigned_user": item.assigned_user,
      "task_date": item.task_date,
      "task_time": item.task_time,
      "is_completed": completed,
      "time_zone": item.time_zone,
      "task_msg": task_msg === "" ? item.task_msg : task_msg

    })
      .then((res) => notify("Updating"))
      .catch((err) => {
        notify("Upss somethings went wrong")
      })
      .finally(() => {
        GetTodos().then((res) => setTodos(res.data.results));
        notify("Updated");
      });
  };
  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUpdateTodo(item.id)
    }
  }

  const handleUpdateTodo = (id) => {
    const query = {
      isCompleted: completed,
      task_msg: task_msg === "" ? item.task_msg : task_msg,

    };

    UpdateTodo(id, {
      "assigned_user": item.assigned_user,
      "task_date": item.task_date,
      "task_time": item.task_time,
      "is_completed": completed,
      "time_zone": item.time_zone,
      "task_msg": task_msg === "" ? item.task_msg : task_msg

    })
      .then((res) => notify("Updating"))
      .catch((err) => {
        notify("Upss somethings went wrong")
      })
      .finally(() => {
        GetTodos().then((res) => setTodos(res.data.results));
        notify("Updated");
      });

    setVisible(false);
  };




  return (
    <>
      <Card  >

        <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
          <Col>
            <Tooltip
              content={
                item.isCompleted === 1 ? "Completed" : "Not Completed"
              }
              color={item.isCompleted === 1 ? "success" : "error"}
            >
              <Badge
                css={{ border: "none" }}
                color={item.isCompleted === 1 ? "success" : "error"}
                variant="points"
              />
            </Tooltip>

          </Col>
        </Card.Header>
        <Card.Body css={{
          pt: 50,
          width: 300,
          height: 200,
        }}>


          <Text h3>{item.task_msg}</Text>
          <Text h5>{formattedDate} at {formattedTime}</Text>

          {/* <Text h5>Date,Time, Zone format to API</Text>
      <Text h5>{item.task_date}</Text>
      <Text h6>{item.task_time}</Text>
      <Text h6>{item.time_zone}</Text> */}

        </Card.Body>
        <Card.Footer
          isBlurred
          css={{
            position: "absolute",
            bgBlur: "#ffffff66",
            borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Row>
            <Tooltip content="Edit Todo">
              <IconButton onClick={handler}>
                <EditIcon size={30} fill="#16181A" />
              </IconButton>
            </Tooltip>
            <Tooltip
              content={
                item.isCompleted === 1 ? "Do UnCompleted" : "Do Completed"
              }
            >
              <IconButton
                css={{ ml: "20px" }}
                onClick={() => handleSetCompleted(item.id)}
              >
                <EyeIcon size={30} fill="#16181A" />
              </IconButton>
            </Tooltip>
            <Col>
              <Row justify="flex-end">
                <Tooltip content="Delete Todo" color="error">
                  <IconButton onClick={() => handleDeleteTodo(item.id)}>
                    <DeleteIcon size={30} fill="#FF0080" />
                  </IconButton>
                </Tooltip>
              </Row>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>


          <Text b size={18}>
            Edit Todo
          </Text>

        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Content"
            value={task_msg}
            onChange={(e) => setTask_msg(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Row justify="space-between">
            <Radio.Group
              onChange={(e) => {
                setCompleted(e);
              }}
              label="Status"
              defaultValue={item.isCompleted}
            >
              <Radio value={1}>Completed</Radio>
              <Radio value={0}>Not Completed</Radio>
            </Radio.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
          <Button auto onClick={() => handleUpdateTodo(item.id)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodoCard;
