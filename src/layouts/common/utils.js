export const getUserSession = () => {
  const user = sessionStorage.getItem('user');
  if (user) {
    return {
      user: JSON.parse(user) 
    };
  }
  else {
    return {
      user: {}
    };
  }
}