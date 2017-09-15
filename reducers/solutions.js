const solutions = (state = [], action) => {
  switch (action.type) {
    case 'SET_SOLUTIONS':
      return action.payload;
    default:
      return state;
  }
}

export default solutions;
