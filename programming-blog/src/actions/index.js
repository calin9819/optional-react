export const registerUser = obj => {
  return {
    type: "REGISTER",
    name: obj.name,
    email: obj.email,
    password: obj.password,
    id: new Date().getTime()
  };
};

export const login = obj => {
  return {
    type: "LOGIN",
    email: obj.email,
    password: obj.password
  };
};
