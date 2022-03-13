export default () => {
  return {
    miniProgram: {
      envVersion:
        process.env.NODE_ENV === 'development' ? 'develop' : 'release',
    },
  };
};
