// Importar bibliotecas de conexión con la práctica física o serial para arduino
var rpio = require("rpio");
// Necesario para poder usar PWM, también el programa debe ser ejecutado como root
rpio.init({ gpiomem: false });

const TURN_EVERYTHING_OFF_PIN = 5;
const LED_PIN = 3;
const PWM_LED_PIN = 12;

// Configuración de entradas y salidas
rpio.open(TURN_EVERYTHING_OFF_PIN, rpio.INPUT);
rpio.open(LED_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(PWM_LED_PIN, rpio.PWM);

// Configuración de pwm
rpio.pwmSetClockDivider(8);
rpio.pwmSetRange(PWM_LED_PIN, 1024);

class ExamplePractice {
  constructor() {
    this.status = "not ready";

    // Variables de ayuda
    this.pwmLedValue = 0;
    this.ledStatus = 0;

    this.emergencyButtonState = false;

    // lectura de variables y lógica, similar al loop de arduino
    setInterval(() => {
      // Agregar verificación de gpio y acciones acordes
      this.emergencyButtonState = this.readEmergencyStopButton();
      if (this.emergencyButtonState) {
        this.ledOff();
        this.setPWMLedValue(0);
      }
    }, 10);
  }

  // Funciones de ayuda
  ledOn() {
    rpio.write(LED_PIN, rpio.HIGH);
    this.ledStatus = 1;
  }

  ledOff() {
    rpio.write(LED_PIN, rpio.LOW);
    this.ledStatus = 0;
  }

  setPWMLedValue(value) {
    rpio.pwmSetData(PWM_LED_PIN, value);
    this.pwmLedValue = value;
  }

  readEmergencyStopButton() {
    return rpio.read(TURN_EVERYTHING_OFF_PIN);
  }

  // Se definen las acciones para cada comando
  command(command, value) {
    if (this.status === "initializing") {
      return {
        status: "error",
        message:
          "Regresando a valores iniciales, espera a que esté lista la práctica",
      };
    }

    if (this.emergencyButtonState) {
      return {
        status: "error",
        message:
          "No se puede recibir ningún comando mientras el botón de emergencia esté presionado",
      };
    }

    // Agregar acciones
    switch (command) {
      case "ledOn":
        this.ledOn();
        break;
      case "ledOff":
        this.ledOff();
        break;
      case "ledStatus":
        if (value === true) {
          this.ledOn();
        } else if (value === false) {
          this.ledOff();
        }
        break;
      case "pwmSlider":
        this.setPWMLedValue(value);
        break;
      default:
        return {
          status: "error",
          message: `No se reconoce el comando ${command}`,
        };
    }

    return { status: "success" };
  }

  // Se ejecuta cuando la interfaz se conecta por primera vez
  init() {
    // Checar el estatus de las cosas y si no está en el 'estado inicial' cambio el
    // estado de la práctica a 'initializing' y mando los comandos para que esté en
    // el estado inicial

    this.ledOff();
    this.setPWMLedValue(0);

    this.status = "ready";
  }
}

export default ExamplePractice;
