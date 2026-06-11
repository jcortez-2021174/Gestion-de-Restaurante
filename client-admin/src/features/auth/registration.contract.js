export const createRegistrationFormData = (userData) => {
  const formData = new FormData();

  formData.append("name", userData.name);
  formData.append("surname", userData.surname);
  formData.append("username", userData.username);
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  formData.append("phone", userData.phone);

  if (userData.profilePicture) {
    formData.append("profilePicture", userData.profilePicture);
  }

  return formData;
};
