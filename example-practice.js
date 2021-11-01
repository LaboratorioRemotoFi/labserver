// Estados: initializing, ongoing, error

class ExamplePractice {
  constructor() {
    this.name = "Practica 1";
    this.temperature = 10;
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

  command(command) {
    if (this.status === "initializing" && ["i", "o"].includes(command)) {
      this.status = "ongoing";
    }

    if (command === "i") {
      this.resistanceOn = true;
    } else if (command === "o") {
      this.resistanceOn = false;
    } else {
      return { status: "error", message: "Command not found" };
    }

    return { status: "success" };
  }

  init() {
    this.resistanceOn = false;
    this.status = "initializing";
    setInterval(() => {
      if (this.status === "initializing" && this.temperature === 0) {
        this.status = "ready";
      }
    }, 200);
  }
}

export default ExamplePractice;
