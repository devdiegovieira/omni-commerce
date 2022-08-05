

export const required = value => (value === null ? 'Required' : undefined);

export const validateEmail = (email) => {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const passwordsMatch = (password, confirmPassword) => {
  return confirmPassword == password;
};

