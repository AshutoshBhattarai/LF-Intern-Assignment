/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import { HttpStatusCode } from "axios";
import "../../assets/scss/style.scss";
import User from "../../interfaces/User";
import createPostRequest from "../../service/PostRequest";
import TokenService from "../../service/TokenService";
/* -------------------------------------------------------------------------- */
/*                          Getting elements from DOM                         */
/* -------------------------------------------------------------------------- */
// Login form
const loginForm = document.getElementById("form-login") as HTMLFormElement;
// Error message container
const validationError = document.getElementById("error-message") as HTMLElement;
// Email address input
const emailInput = document.getElementById("login-email") as HTMLInputElement;
// Password input
const passwordInput = document.getElementById(
  "login-password"
) as HTMLInputElement;

// Login form submit handler
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Clear previous error messages
  emailInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");
  if (!validationError.classList.contains("d-none")) {
    validationError.classList.add("d-none");
  }
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!validateInput(email.trim(), password.trim())) {
    validationError.classList.remove("d-none");
  }
  
  else {
    await sendAuthRequest(email, password);
  }
});

const validateInput = (email: string, password: string): boolean => {
  if (email === "") {
    validationError.innerHTML = "Please enter your email";
    emailInput.classList.add("is-invalid");
    return false;
  }
  if (password === "") {
    validationError.innerHTML = "Please enter your password";
    passwordInput.classList.add("is-invalid");
    return false;
  }
  if (!email.match(/\S+@\S+\.\S+/)) {
    validationError.innerHTML = "Please enter valid email";
    emailInput.classList.add("is-invalid");
    return false;
  }
  return true;
};

const sendAuthRequest = async (email: string, password: string) => {
  // Send request
  try {
    const user: User = { email, password };
    const response = await createPostRequest("/login", user);
    // if response is ok then save tokens and redirect to dashboard
    if (response.status === HttpStatusCode.Accepted) {
      TokenService.setAccessToken(response.data.tokens.accessToken);
      TokenService.setRefreshToken(response.data.tokens.refreshToken);
      window.location.href = "/views/Dashboard/";
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
  
    if (
      error.response.status == HttpStatusCode.BadRequest ||
      error.response.status == HttpStatusCode.NotFound ||
      error.response.status == HttpStatusCode.Forbidden
    ) {
      validationError.classList.remove("d-none");
      validationError.innerHTML = error.response.data.message;
    }
  }
};
