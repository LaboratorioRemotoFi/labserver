import React from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Chip,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";

const socket = io("http://localhost:8000");

function App() {
  const [websocketConnected, setWebsocketConnected] = React.useState(false);
  const [data, setData] = React.useState({});
  const [messageText, setMessageText] = React.useState("");
  const [messageStatus, setMessageStatus] = React.useState("");
  const [command, setCommand] = React.useState("");

  const commandInput = React.useRef();

  React.useEffect(() => {
    socket.on("connect", () => {
      setWebsocketConnected(true);
    });

    socket.io.on("reconnect", () => {
      setWebsocketConnected(true);
    });

    socket.on("disconnect", () => {
      setWebsocketConnected(false);
    });

    socket.on("data", (newData) => {
      setData(newData);
    });

    socket.on("message", (newMessage) => {
      setMessageStatus(newMessage.messageStatus);
      setMessageText(newMessage.messageText);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendCommand = () => {
    socket.emit("command", command);
    setCommand("");
  };

  return (
    <div>
      <Container>
        <Box mb={5}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cliente para Laboratorio Remoto
            </Typography>
            <Chip
              label={websocketConnected ? "Conectado" : "Desconectado"}
              color={websocketConnected ? "success" : "error"}
              variant="outlined"
            />
          </Toolbar>
        </Box>
        <Typography variant="h2">Práctica de temperatura</Typography>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4"></Typography>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <TextField
              sx={{ marginRight: 2 }}
              id="standard-basic"
              label="Comando"
              variant="standard"
              ref={commandInput}
              value={command}
              onChange={(e) => {
                setCommand(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  sendCommand();
                }
              }}
            />
            <Button size="small" variant="contained" onClick={sendCommand}>
              Enviar
            </Button>
          </Box>
          {messageText && (
            <Paper
              variant="outlined"
              sx={{ padding: 2, marginTop: 2, marginBottom: 2 }}
            >
              <Typography>{messageText}</Typography>
            </Paper>
          )}
        </Box>
        <Typography variant="h4">Datos</Typography>
        <Box sx={{ my: 4 }}>
          <TableContainer sx={{ maxWidth: 700 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {Object.keys(data).map((key) => (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell align="right">{data[key]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Typography variant="h4">Vídeos</Typography>
      </Container>
    </div>
  );
}

export default App;
