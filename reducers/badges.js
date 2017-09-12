const badges = (state = 0, action) => {
  switch (action.type) {
    case 'SET_BADGE':
      return action.payload;
    default:
      return state;
  }
};

export default badges;
