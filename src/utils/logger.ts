const info = (...msg: any[]) => {
  console.info(...msg);
};
const debug = (...msg: any[]) => {
  console.debug(...msg);
};
const error = (...msg: any[]) => {
  console.error(...msg);
};

const logger = {
  info,
  debug,
  error,
};
export default logger;
