"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mod = mod;
exports.lerp = lerp;
exports.isValid = isValid;
exports.getEndValueByShortestPath = getEndValueByShortestPath;
var WRAPPED_ANGULAR_PROPS = {
  longitude: 1,
  bearing: 1
};

function mod(value, divisor) {
  var modulus = value % divisor;
  return modulus < 0 ? divisor + modulus : modulus;
}

function lerp(start, end, step) {
  if (Array.isArray(start)) {
    return start.map(function (element, index) {
      return lerp(element, end[index], step);
    });
  }

  return step * end + (1 - step) * start;
}

function isValid(prop) {
  return Number.isFinite(prop) || Array.isArray(prop);
}

function isWrappedAngularProp(propName) {
  return WRAPPED_ANGULAR_PROPS[propName];
}

function getEndValueByShortestPath(propName, startValue, endValue) {
  if (isWrappedAngularProp(propName) && Math.abs(endValue - startValue) > 180) {
    endValue = endValue < 0 ? endValue + 360 : endValue - 360;
  }

  return endValue;
}
//# sourceMappingURL=transition-utils.js.map