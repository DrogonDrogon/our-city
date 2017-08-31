export default (state = null, action) => {
  switch (action.type) {
    case 'IS_POSTING':
      return action.payload;
    default:
      return state;
  }
};
