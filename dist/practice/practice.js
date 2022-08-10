"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ExamplePractice = /*#__PURE__*/function () {
  function ExamplePractice() {
    var _this = this;

    _classCallCheck(this, ExamplePractice);

    this.status = "not ready";
    this.waterLevelDetail = 0;
    this.resistancePositionDetail = 0;
    this.finalPosition = 0;
    this.sensors = {
      temperature: 25,
      resistancePosition: 0,
      waterLevel: 0,
      position: 0,
      selectedSensor: ""
    };
    this.actuators = {
      resistance: false,
      resistanceMotor: 0,
      positionMotor: 0,
      waterPump: false,
      fan: false
    };
    setInterval(function () {
      // Resistance position logic
      if (_this.actuators.resistanceMotor === -1 && _this.resistancePositionDetail >= 0) {
        _this.resistancePositionDetail -= 0.5;
      } else if (_this.actuators.resistanceMotor === 1 && _this.resistancePositionDetail <= 10) {
        _this.resistancePositionDetail += 0.5;
      }

      if (_this.actuators.resistanceMotor === -1 && _this.resistancePositionDetail < 0 || _this.actuators.resistanceMotor === 1 && _this.resistancePositionDetail > 10) {
        _this.actuators.resistanceMotor = 0;
      }

      if (_this.resistancePositionDetail <= 0) {
        _this.sensors.resistancePosition = 0;
      } else if (_this.resistancePositionDetail >= 10) {
        _this.sensors.resistancePosition = 1;
      } // Water level logic


      if (_this.actuators.waterPump && _this.waterLevelDetail < 10) {
        _this.waterLevelDetail += 0.5;
      }

      if (_this.actuators.waterPump && _this.waterLevelDetail >= 10) {
        _this.actuators.waterPump = false;
        _this.sensors.waterLevel = 1;
      }

      if (_this.waterLevelDetail <= 0) {
        _this.sensors.waterLevel = 0;
      }

      if (_this.actuators.resistance) {
        _this.waterLevelDetail -= 0.1;
      } // Temperature and resistence logic


      if (_this.sensors.resistancePosition === 0 && _this.actuators.resistance && _this.sensors.temperature < 25) {
        _this.sensors.temperature += 1;
      } else if (!_this.actuators.resistance && _this.sensors.temperature > 10) {
        _this.sensors.temperature -= 0.5;
      } // Position logic


      var positionDelta = _this.sensors.position - _this.finalPosition;

      if (Math.abs(positionDelta) < 3) {
        _this.sensors.position = _this.finalPosition;
      } else {
        _this.sensors.position -= positionDelta / 2;
      }

      if (_this.actuators.fan) {
        _this.sensors.temperature -= 0.1;
      }
    }, 500);
  }

  _createClass(ExamplePractice, [{
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "getSensorsData",
    value: function getSensorsData() {
      return this.sensors;
    }
  }, {
    key: "getActuatorsStatus",
    value: function getActuatorsStatus() {
      return this.actuators;
    }
  }, {
    key: "command",
    value: function command(_command, value) {
      if (this.status === "initializing") {
        return {
          status: "error",
          message: "Regresando a valores iniciales, espera a que esté lista la práctica"
        };
      }

      var errorMessage = "";

      switch (_command) {
        case "resistanceOn":
          if (this.sensors.waterLevel === 0) {
            return {
              status: "error",
              message: "No se puede encender la resistencia sin agua"
            };
          } else if (this.sensors.resistancePosition === 1) {
            return {
              status: "error",
              message: "No se puede encender la resistencia si está fuera del agua"
            };
          }

          this.actuators.resistance = true;
          break;

        case "resistanceOff":
          this.actuators.resistance = false;
          break;

        case "resistanceDown":
          // bajar resistencia
          this.actuators.resistanceMotor = -1;
          break;

        case "resistanceUp":
          // subir resistencia
          if (this.actuators.resistance === true) {
            return {
              status: "error",
              message: "No se puede subir la resistencia si está encendida"
            };
          }

          this.actuators.resistanceMotor = 1;
          break;

        case "fanOn":
          // encender ventilador
          this.actuators.fan = true;
          break;

        case "fanOff":
          // apagar ventilador
          this.actuators.fan = false;
          break;

        case "pumpOn":
          // encender bomba
          if (this.sensors.waterLevel === 1) {
            return {
              status: "warning",
              message: "Todavía hay agua en el recipiente"
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
          return {
            status: "error",
            message: "Command not found"
          };
      }

      return {
        status: "success"
      };
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      this.actuators.resistance = false;
      this.sensors.temperature = 15;
      this.status = "initializing";

      var checkInitialState = function checkInitialState() {
        setTimeout(function () {
          if (_this2.sensors.temperature <= 10) {
            _this2.status = "ready";
          } else {
            checkInitialState();
          }
        }, 200);
      };

      checkInitialState();
    }
  }]);

  return ExamplePractice;
}();

var _default = ExamplePractice;
exports["default"] = _default;