const user = (state, action) => {
// console.log('reducer running --> state is:', state, ' && action is:', action);
switch (action.type) {
  case 'SET_USER':
  return Object.assign({}, state, { user: action.payload });

  case 'IS_LOGGED_IN':
    return Object.assign({}, state, { isLoggedIn: action.payload });

  default:
    return state;
}

export default user;