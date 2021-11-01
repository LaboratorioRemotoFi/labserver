// Estados: initializing, ongoing, error

class ExamplePractice {
  constructor() {
    this.name = "Practica 1";
    this.temperature = 0;
    this.resistanceOn = false;
    this.status = "not ready";

    setInterval(() => {
      if (this.resistanceOn && this.temperature < 25) {
        this.temperature += 1;
      } else if (!this.resistanceOn && this.temperature > 0) {
        this.temperature -= 1;
      }
    }, 500);
  }

  getName() {
    return this.name;
  }

  getData() {
    return {
      temperature: this.temperature,
      status: this.status,
    };
  }

  sendCommand(command) {
    if (command === "i") {
      this.resistanceOn = true;
    } else if (command === "o") {
      this.ressitenceOn = false;
    }
  }

  init() {
    this.resistanceOn = false;
    this.state = "reseting";
    setTimeout(() => {
      if (this.temperature === 0) {
        this.state = "ready";
      }
    }, 200);
  }
}

export default ExamplePractice;
