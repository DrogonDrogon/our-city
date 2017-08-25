const reducer = (state, action) => {
  console.log('reducer running --> state is:', state, ' && action is:', action);
  switch (action.type) {
    case 'RECEIVE_PHOTOTAGS':
      return Object.assign({}, state, { phototags: action.phototags });
    default:
      return state;
  }
};

export default reducer;
