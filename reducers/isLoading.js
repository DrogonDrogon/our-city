export default (state = null, action) => {
  switch (action.type) {
    case 'IS_LOADING':
      return action.payload;
    default:
      return state;
  }
};
