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
  Link,
} from "@mui/material";

function Page({
  index,
  instructions,
  sensors,
  actuators,
  actions,
  sendCommand,
  setPageIndex,
}) {
  // const [hideMessage, setHideMessage] = React.useState(false);

  return (
    <div>
      <Typography variant="h4">Componentes</Typography>
      {sensors && (
        <ul>
          {sensors.map((sensor) => {
            const { id, labels, name, value } = sensor;
            return (
              <li key={id}>
                <Typography>
                  {name + ": "}
                  {labels ? labels[value] : value}
                </Typography>
              </li>
            );
          })}
        </ul>
      )}
      {actuators && (
        <ul>
          {actuators.map((actuator) => {
            const { name, info, labels, value } = actuator;
            return (
              <li key={actuator.n}>
                <Typography>
                  {name + ": "}
                  {labels ? labels[value] : value}
                </Typography>
              </li>
            );
          })}
        </ul>
      )}
      <Typography variant="h4">{`Paso ${index + 1}`}</Typography>
      <ul>
        {instructions.map((text, index) => {
          return (
            <li key={index}>
              <Typography>{text}</Typography>
            </li>
          );
        })}
      </ul>
      {actions && (
        <Box sx={{ display: "flex", alignItems: "flex-end", mt: 1, ml: 3 }}>
          {actions.map((action, index) => {
            const { name, command } = action;
            return (
              <Button
                key={index}
                size="small"
                variant="text"
                onClick={() => sendCommand(command)}
                sx={{ ml: 0, mr: 2 }}
              >
                {name}
              </Button>
            );
          })}
        </Box>
      )}
    </div>
  );
}

export default Page;
