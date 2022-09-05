/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
]);

module.exports = withTM({
  // your custom config goes here
});