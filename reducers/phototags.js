const phototags = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_PHOTOTAGS':
      return action.phototags;
    default:
      return state;
  }
};

export default phototags;
