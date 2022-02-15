import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import useSocket from "./hooks/useSocket";
import PracticePage from "./PracticePage";
import {
  AppBar,
  Box,
  Button,
  Container,
  Input,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

function SetupPage({ isConnected, connect, errorMessage }) {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [serverIp, setServerIp] = React.useState("localhost:8000");

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography>
        Colocar el puerto de la práctica e iniciar conexión.
      </Typography>
      <Input
        placeholder="Usuario"
        variant="standard"
        value={user}
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />
      <Input
        placeholder="Contraseña"
        variant="standard"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Input
        placeholder="192.168.1.100:8000"
        variant="standard"
        value={serverIp}
        onChange={(e) => {
          setServerIp(e.target.value);
        }}
      />
      <Button
        variant="contained"
        onClick={() => connect(serverIp, user, password)}
        disabled={isConnected && !errorMessage}
      >
        {errorMessage
          ? "Reintentar conexión"
          : isConnected
          ? "Configurando ..."
          : "Iniciar conexión"}
      </Button>
      {errorMessage && (
        <Typography sx={{ color: "error.main" }}>{errorMessage}</Typography>
      )}
    </Stack>
  );
}

function App() {
  const {
    socket,
    isConnected,
    connect,
    metadata,
    errorMessage,
    practiceStatus,
    sensorsData,
    actuatorsStatus,
  } = useSocket();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cliente para Laboratorio Remoto
          </Typography>
          <Box mr={1} alignItems="center">
            {isConnected ? <CheckIcon /> : <ClearIcon />}
          </Box>
          <Typography variant="h6" component="div">
            {isConnected ? "Conectado" : "Desconectado"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ paddingTop: 2 }}>
        {isConnected && metadata ? (
          <PracticePage
            socket={socket}
            metadata={metadata}
            practiceStatus={practiceStatus}
            sensorsData={sensorsData}
            actuatorsStatus={actuatorsStatus}
            errorMessage={errorMessage}
          />
        ) : (
          <SetupPage
            connect={connect}
            isConnected={isConnected}
            errorMessage={errorMessage}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
