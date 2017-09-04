const userFavs = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_FAVS':
      return action.payload;
    default:
      return state;
  }
};

export default userFavs;
