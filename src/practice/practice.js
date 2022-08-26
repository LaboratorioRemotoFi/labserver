// Importar bibliotecas de conexión con la práctica física o serial para arduino
// import gpio from "rpi-gpio";
// gpio.setup(12, gpio.DIR_OUT, off);

// pin 12 led
// pin 13 encender el motor
// pin 14 switch izquierdo del motor
// pin 15 switch derecho del motor

function on() {
  /* gpio.write(12, true, function (err) {
   *   if (err) throw err;
   *   console.log("Written to pin");
   * }); */
}

function off() {
  /* gpio.write(12, false, function (err) {
   *   if (err) throw err;
   *   console.log("Written to pin");
   * }); */
}

class ExamplePractice {
  constructor() {
    // Estado de la práctica
    this.status = "not ready";

    // Variables auxiliares
    this.motorPosition = 0; // -100 <-> 100, son 200 pero en pasos pueden ser 400

    // Definición de sensores
    this.sensors = {
      led: false,
      motorInLeftSwitch: 0,
      motorInRightSwitch: 0,
    };

    // Definición de actuadores
    this.actuators = {};

    // Comandos iniciales
    off();

    // lectura de variables y lógica, similar al loop de arduino
    setInterval(() => {
      /* this.sensors.motorInLeftSwitch = gpio.read(14);
       * this.sensors.motorInRightSwitch = gpio.read(15);
       * this.sensors.waterLevel = gpio.read(18); */

      if (this.sensors.waterLevel == 0) {
        this.turnResistanceOff();
      }

      if (this.sensors.motorInLeftSwitch) {
        this.turnMotorOff();
        this.motorPosition = -100;
      }

      if (this.sensors.motorInRightSwitch) {
        this.turnMotorOff();
        this.motorPosition = 100;
      }
    }, 10);
  }

  turnMotorRightSteps(n) {
    this.sensors.motorPosition += n;
    /* gpio.write(13, true, function (err) {
     *   if (err) throw err;
     *   console.log("Written to pin");
     * }); */
  }

  turnMotorLeftSteps(n) {
    this.sensors.motorPosition -= n;
    /* gpio.write(13, true, function (err) {
     *   if (err) throw err;
     *   console.log("Written to pin");
     * }); */
  }

  turnMotorOff() {
    gpio.write(13, false, function (err) {
      if (err) throw err;
      console.log("Written to pin");
    });
  }

  // No tocar
  getStatus() {
    return this.status;
  }

  // No tocar
  getSensorsData() {
    return this.sensors;
  }

  // No tocar
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
    let pasos;

    // Agregar acciones
    switch (command) {
      case "ledOn":
        on();
        break;
      case "ledOff":
        off();
        break;
      case "motorPosition":
        // Calculos para determinar los pasos
        // Valor de los pasos a moverse
        pasos = this.motorPosition - 20;
        if (pasos < 0) {
          this.turnMotorLeftSteps(pasos);
        } else if (pasos > 0) {
          this.turnMotorRightSteps(pasos);
        } else {
          this.turnMotorOff();
        }
        break;
      default:
        return { status: "error", message: "Command not found" };
    }

    return { status: "success" };
  }

  // Se ejecuta cuando la interfaz se conecta por primera vez
  init() {
    // Checar el estatus de las cosas y si no está en el 'estado inicial' cambio el
    // estado de la práctica a 'initializing' y mando los comandos para que esté en
    // el estado inicial

    off();
    this.turnMotorLeftSteps(-300);
    this.status = "ready";

    /* const checkInitialState = () => {
     *   setTimeout(() => {
     *     if (this.sensors.led !== 0) {
     *       this.status = "initializing";
     *       checkInitialState();
     *     } else if (this.sensor.led === 0) {
     *       this.status = "ready";
     *     }
     *   }, 200);
     * }; */
    // checkInitialState();
  }
}

export default ExamplePractice;
