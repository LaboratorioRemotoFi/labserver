import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

function PracticePage({
  socket,
  metadata,
  practiceStatus,
  sensorsData,
  actuatorsStatus,
  errorMessage,
}) {
  const [hideMessage, setHideMessage] = React.useState(false);

  React.useEffect(() => {
    if (hideMessage) {
      setHideMessage(false);
    }
  }, [errorMessage]);

  const sendCommand = (command) => {
    socket.emit("command", command);
  };

  return (
    <div>
      <Typography variant="h2">
        {metadata.name + ` (${practiceStatus})`}
      </Typography>
      <Typography paragraph>{metadata.objective}</Typography>
      <Typography variant="h4">Instrucciones:</Typography>
      <ul>
        {metadata.steps.map((step, index) => {
          return (
            <li key={index}>
              <Typography>{step}</Typography>
            </li>
          );
        })}
      </ul>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">Comandos</Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end", mt: 1 }}>
          {metadata.commands.map((command, index) => {
            const key = Object.keys(command)[0];
            return (
              <Button
                key={index}
                size="small"
                variant="contained"
                onClick={() => sendCommand(key)}
                sx={{ ml: 0, mr: 2 }}
              >
                {command[key]}
              </Button>
            );
          })}
        </Box>
        {!hideMessage && errorMessage && (
          <Paper
            variant="outlined"
            sx={{
              padding: 2,
              marginTop: 2,
              marginBottom: 2,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Typography>{errorMessage}</Typography>
            <ClearIcon onClick={() => setHideMessage(true)} />
          </Paper>
        )}
      </Box>
      <Typography variant="h4">Sensores</Typography>
      <ul>
        {Object.keys(sensorsData).map((sensorId) => {
          const { name, info, units, labels } = metadata.sensors[sensorId];
          return (
            <li key={sensorId}>
              <Typography>
                {name + ": "}
                {labels ? labels[sensorsData[sensorId]] : sensorsData[sensorId]}
              </Typography>
            </li>
          );
        })}
      </ul>
      <Typography variant="h4">Actuadores</Typography>
      <ul>
        {Object.keys(actuatorsStatus).map((actuatorId) => {
          const { name, info, labels } = metadata.actuators[actuatorId];
          const value = actuatorsStatus[actuatorId];
          return (
            <li key={actuatorId}>
              <Typography>
                {name + ": "}
                {labels ? labels[value] : value}
              </Typography>
            </li>
          );
        })}
      </ul>
      <Typography variant="h4">Vídeos</Typography>
      <ul>
        {metadata.cameras.map((camera, index) => (
          <li key={index}>
            <Typography>{camera.name}</Typography>
            <img
              width={camera.width}
              height={camera.height}
              src={camera.url}
              alt=""
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PracticePage;
