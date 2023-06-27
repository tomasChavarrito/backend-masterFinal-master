const log4js = require("log4js");

log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerWarnFile: { type: "file", filename: "warn.log" },
    miLoggerErrorFile: { type: "file", filename: "error.log" },
    errorLogger: {
      type: "logLevelFilter",
      appender: "miLoggerErrorFile",
      level: "error",
      maxLevel: "error",
    },
    warnLogger: {
      type: "logLevelFilter",
      appender: "miLoggerWarnFile",
      level: "warn",
      maxLevel: "warn",
    },
  },
  categories: {
    default: {
      appenders: ["miLoggerConsole", "errorLogger", "warnLogger"],
      level: "all",
    },
  },
});

module.exports = logger = log4js.getLogger();