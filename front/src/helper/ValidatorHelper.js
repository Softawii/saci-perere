const requiredField = 'Campo obrigatório';
const atLeastCharacters = minLength => `Precisa conter pelo menos ${minLength} caracteres`;

const username = () => ({
  validators: [
    {
      name: 'required',
      message: requiredField,
    },
    {
      name: 'minLength',
      value: 10,
      message: atLeastCharacters(10),
    },
  ],
});

const password = () => ({
  validators: [
    {
      name: 'required',
      message: requiredField,
    },
    {
      name: 'minLength',
      value: 10,
      message: atLeastCharacters(10),
    },
  ],
});

const name = () => ({
  validators: [
    {
      name: 'required',
      message: requiredField,
    },
    {
      name: 'minLength',
      value: 10,
      message: atLeastCharacters(10),
    },
  ],
});

const email = () => ({
  validators: [
    {
      name: 'required',
      message: requiredField,
    },
    {
      name: 'email',
    },
  ],
});

const userSchema = () => ({
  username: username(),
  password: password(),
  name: name(),
  email: email(),
});

const loginSchema = () => ({
  username: username(),
  password: password(),
});

export default {
  userSchema,
  loginSchema,
};
