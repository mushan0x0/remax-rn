export default (...args: any[]) =>
  Object.assign({}, ...args.filter((item) => typeof item !== 'string'));
