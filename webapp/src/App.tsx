import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, Edit, Refresh } from "@material-ui/icons";
import axios from "axios";
import "./App.css";

const URL = `http://${window.location.hostname}:5000/todos`;

async function deleteEntry(id: number) {
  try {
    await axios.delete(`${URL}/${id}`);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function updateEntry(id: number, content: string) {
  try {
    await axios.put(`${URL}/${id}`, { content });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function createEntry(content: string) {
  try {
    await axios.post(URL, { content });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function fetchEntries() {
  try {
    const res = await axios.get(URL);
    console.log(res);
    if (res.data) {
      return res.data as ToDo[];
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

interface ToDo {
  id: number;
  content: string;
}

interface EntryProps extends ToDo {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function Entry(props: EntryProps) {
  return (
    <Card key={props.id} className="Entry">
      <Typography variant="h3">{props.content}</Typography>
      <IconButton onClick={() => props.onEdit(props.id)}>
        <Edit />
      </IconButton>
      <IconButton onClick={() => props.onDelete(props.id)}>
        <Delete />
      </IconButton>
    </Card>
  );
}

interface ConfirmProps {
  title: string;
  content: string;
  onPositive: () => void;
  open: boolean;
  onClose: () => void;
}

function Confirm(props: ConfirmProps) {
  function handleOk() {
    props.onPositive();
    props.onClose();
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.content}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleOk}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface TextDialogProps extends Omit<ConfirmProps, "onPositive"> {
  onPositive: (text: string) => void;
}

function TextDialog(props: TextDialogProps) {
  const [text, setText] = useState("");

  function handleOk() {
    if (text) {
      props.onPositive(text);
      props.onClose();
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent className="TextDialogContent">
        <div>{props.content}</div>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleOk}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function App() {
  function confirm(title: string, content: string, onPositive: () => void) {
    setConfirmProps({
      content,
      title,
      onPositive,
      onClose: () => setShowConfirm(false),
    });
    setShowConfirm(true);
  }

  function textDialog(
    title: string,
    content: string,
    onPositive: (text: string) => void
  ) {
    setTextDialogProps({
      content,
      title,
      onPositive,
      onClose: () => setShowTextDialog(false),
    });
    setShowTextDialog(true);
  }

  const [todos, setTodos] = useState<ToDo[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmProps, setConfirmProps] = useState<Omit<ConfirmProps, "open">>({
    content: "",
    title: "",
    onClose: () => void null,
    onPositive: () => void null,
  });

  const [showTextDialog, setShowTextDialog] = useState(false);
  const [textDialogProps, setTextDialogProps] = useState<
    Omit<TextDialogProps, "open">
  >({
    content: "",
    title: "",
    onClose: () => void null,
    onPositive: () => void null,
  });

  useEffect(() => {
    //window.location.host/todos:5000
    (async () => {
      //fetch all
      setTodos(await fetchEntries());
    })();
  }, []);

  return (
    <Container className="App">
      <Confirm {...confirmProps} open={showConfirm} />
      <TextDialog {...textDialogProps} open={showTextDialog} />
      <Paper className="AppInner">
        <div className="AppTitle">
          <Typography variant="h3">Simple-ToDo 2</Typography>
          <IconButton
            onClick={() =>
              textDialog("Create a new task", "", (text) => createEntry(text))
            }
          >
            <Add />
          </IconButton>
          <IconButton onClick={async () => setTodos(await fetchEntries())}>
            <Refresh />
          </IconButton>
        </div>
        <div>
          {todos.map((entry) => (
            <Entry
              {...entry}
              onDelete={(id) =>
                void confirm(
                  "Delete this task?",
                  `Are you sure you want to delete this task? (${id})`,
                  () => deleteEntry(id)
                )
              }
              onEdit={(id) =>
                void textDialog(
                  "Edit this task",
                  `Enter the new text for ${id}`,
                  (text) => void updateEntry(id, text)
                )
              }
            />
          ))}
        </div>
      </Paper>
    </Container>
  );
}

export default App;
