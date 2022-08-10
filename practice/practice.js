class ExamplePractice {
  constructor() {
    this.status = "not ready";

    this.waterLevelDetail = 0;
    this.resistancePositionDetail = 0;
    this.finalPosition = 0;

    this.sensors = {
      temperature: 25,
      resistancePosition: 0,
      waterLevel: 0,
      position: 0,
      selectedSensor: "",
    };

    this.actuators = {
      resistance: false,
      resistanceMotor: 0,
      positionMotor: 0,
      waterPump: false,
      fan: false,
    };

    setInterval(() => {
      // Resistance position logic
      if (
        this.actuators.resistanceMotor === -1 &&
        this.resistancePositionDetail >= 0
      ) {
        this.resistancePositionDetail -= 0.5;
      } else if (
        this.actuators.resistanceMotor === 1 &&
        this.resistancePositionDetail <= 10
      ) {
        this.resistancePositionDetail += 0.5;
      }

      if (
        (this.actuators.resistanceMotor === -1 &&
          this.resistancePositionDetail < 0) ||
        (this.actuators.resistanceMotor === 1 &&
          this.resistancePositionDetail > 10)
      ) {
        this.actuators.resistanceMotor = 0;
      }

      if (this.resistancePositionDetail <= 0) {
        this.sensors.resistancePosition = 0;
      } else if (this.resistancePositionDetail >= 10) {
        this.sensors.resistancePosition = 1;
      }

      // Water level logic
      if (this.actuators.waterPump && this.waterLevelDetail < 10) {
        this.waterLevelDetail += 0.5;
      }

      if (this.actuators.waterPump && this.waterLevelDetail >= 10) {
        this.actuators.waterPump = false;
        this.sensors.waterLevel = 1;
      }

      if (this.waterLevelDetail <= 0) {
        this.sensors.waterLevel = 0;
      }

      if (this.actuators.resistance) {
        this.waterLevelDetail -= 0.1;
      }

      // Temperature and resistence logic
      if (
        this.sensors.resistancePosition === 0 &&
        this.actuators.resistance &&
        this.sensors.temperature < 25
      ) {
        this.sensors.temperature += 1;
      } else if (!this.actuators.resistance && this.sensors.temperature > 10) {
        this.sensors.temperature -= 0.5;
      }

      // Position logic
      const positionDelta = this.sensors.position - this.finalPosition;
      if (Math.abs(positionDelta) < 3) {
        this.sensors.position = this.finalPosition;
      } else {
        this.sensors.position -= positionDelta / 2;
      }

      if (this.actuators.fan) {
        this.sensors.temperature -= 0.1;
      }
    }, 500);
  }

  getStatus() {
    return this.status;
  }

  getSensorsData() {
    return this.sensors;
  }

  getActuatorsStatus() {
    return this.actuators;
  }

  command(command, value) {
    if (this.status === "initializing") {
      return {
        status: "error",
        message:
          "Regresando a valores iniciales, espera a que esté lista la práctica",
      };
    }

    let errorMessage = "";

    switch (command) {
      case "resistanceOn":
        if (this.sensors.waterLevel === 0) {
          return {
            status: "error",
            message: "No se puede encender la resistencia sin agua",
          };
        } else if (this.sensors.resistancePosition === 1) {
          return {
            status: "error",
            message:
              "No se puede encender la resistencia si está fuera del agua",
          };
        }
        this.actuators.resistance = true;
        break;
      case "resistanceOff":
        this.actuators.resistance = false;
        break;
      case "resistanceDown": // bajar resistencia
        this.actuators.resistanceMotor = -1;
        break;
      case "resistanceUp": // subir resistencia
        if (this.actuators.resistance === true) {
          return {
            status: "error",
            message: "No se puede subir la resistencia si está encendida",
          };
        }
        this.actuators.resistanceMotor = 1;
        break;
      case "fanOn": // encender ventilador
        this.actuators.fan = true;
        break;
      case "fanOff": // apagar ventilador
        this.actuators.fan = false;
        break;
      case "pumpOn": // encender bomba
        if (this.sensors.waterLevel === 1) {
          return {
            status: "warning",
            message: "Todavía hay agua en el recipiente",
          };
        }
        this.actuators.waterPump = true;
        break;
      case "positionSelector":
        this.finalPosition = value;
        break;
      case "selectSensor":
        this.sensors.selectedSensor = value;
        break;
      default:
        return { status: "error", message: "Command not found" };
    }

    return { status: "success" };
  }

  init() {
    this.actuators.resistance = false;
    this.sensors.temperature = 15;
    this.status = "initializing";

    const checkInitialState = () => {
      setTimeout(() => {
        if (this.sensors.temperature <= 10) {
          this.status = "ready";
        } else {
          checkInitialState();
        }
      }, 200);
    };
    checkInitialState();
  }
}

export default ExamplePractice;
