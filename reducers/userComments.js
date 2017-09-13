const userComments = (state = [], action) => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return action.payload;
    default:
      return state;
  }
};

export default userComments;
