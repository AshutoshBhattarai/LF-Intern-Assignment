/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import { HttpStatusCode } from "axios";
import * as bootstrap from "bootstrap";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import Category from "../../interfaces/Category";
import createDeleteRequest from "../../service/DeleteRequest";
import createGetRequest from "../../service/GetRequest";
import createPostRequest from "../../service/PostRequest";
import createPutRequest from "../../service/PutRequest";
import { showToast } from "../../components/Toast";
import showErrorResponse from "../../service/ErrorResponse";
import User from "../../interfaces/User";
/* -------------------------------------------------------------------------- */
/*                          Getting elements from DOM                         */
/* -------------------------------------------------------------------------- */
// Navbar placeholder
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
// Category container to render all categories
const categoryContainer = document.getElementById(
  "category-container"
) as HTMLElement;
// Add category button to open dialog
const addCategoryBtn = document.getElementById(
  "btn-add-category"
) as HTMLElement;
// Close dialog button to close category dialog
const btnCloseCategoryDialog = document.getElementById(
  "btn-close-category-dialog"
) as HTMLElement;
// Add category dialog box button to add new category
const btnSaveCategory = document.getElementById(
  "btn-save-category"
) as HTMLElement;
// Add category dialog box title input
const categoryTitleInput = document.getElementById(
  "add-category-title"
) as HTMLInputElement;
// Add category dialog box description input
const categoryDescriptionInput = document.getElementById(
  "add-category-description"
) as HTMLInputElement;
// Profile Card username display
const displayUsername = document.getElementById(
  "display-username"
) as HTMLElement;
// Profile Card email display
const displayEmail = document.getElementById("display-email") as HTMLElement;
// Profile Card created at display
const displayCreatedAt = document.getElementById(
  "display-created-at"
) as HTMLElement;
// Profile Card updated at display
const displayUpdatedAt = document.getElementById(
  "display-updated-at"
) as HTMLElement;
// Edit profile button
const btnEditProfile = document.getElementById(
  "btn-edit-profile"
) as HTMLInputElement;
// Button to update profile with new data
const btnSaveProfile = document.getElementById(
  "btn-save-profile"
) as HTMLElement;
// Close dialog button to close profile dialog
const btnCloseProfileDialog = document.getElementById(
  "btn-close-profile-dialog"
) as HTMLElement;
// Update username input
const updateUsernameInput = document.getElementById(
  "update-profile-username"
) as HTMLInputElement;
// Update email input
const updateEmailInput = document.getElementById(
  "update-profile-email"
) as HTMLInputElement;
// Update password button to open dialog box to update password
const btnUpdatePassword = document.getElementById(
  "btn-change-password"
) as HTMLElement;
// Update password dialog box button to update password
const btnSaveNewPassword = document.getElementById(
  "btn-save-password"
) as HTMLElement;
// Update password input
const updatePasswordInput = document.getElementById(
  "update-user-password"
) as HTMLInputElement;
// Update confirm password input
const updateConfirmPasswordInput = document.getElementById(
  "update-user-repassword"
) as HTMLInputElement;
// Close dialog button to close password dialog
const btnClosePasswordDialog = document.getElementById(
  "btn-close-password-dialog"
) as HTMLElement;
// Toast container
const toastContainer = document.getElementById("toast-message") as HTMLElement;
// --------------------- Initializing Modals -----------------------

let categoryModal: bootstrap.Modal;

let categoryId: string = "";

let updateProfileModal: bootstrap.Modal;

let updatePasswordModal: bootstrap.Modal;
/* -------------------------------------------------------------------------- */
/*                            Initital onload tasks                           */
/* -------------------------------------------------------------------------- */
window.onload = async () => {
  renderNavBar(navBar, "nav-profile");

  categoryModal = new bootstrap.Modal(
    document.getElementById("add-category-dialog") as HTMLElement
  );

  updateProfileModal = new bootstrap.Modal(
    document.getElementById("update-user-dialog") as HTMLElement
  );

  updatePasswordModal = new bootstrap.Modal(
    document.getElementById("update-password-dialog") as HTMLElement
  );

  const userCategories = await getUserCategories();

  renderUserCategories(userCategories);

  await renderUserDetails();
};

/* -------------------------------------------------------------------------- */
/*                           Button Event Listeners                           */
/* -------------------------------------------------------------------------- */
// Edit profile button
btnEditProfile.addEventListener("click", () => {
  
  updateUsernameInput.value = displayUsername.textContent!;
  
  updateEmailInput.value = displayEmail.textContent!;
  
  updateProfileModal.show();
});


addCategoryBtn.addEventListener("click", () => {
  categoryModal.show();
});


btnCloseCategoryDialog.addEventListener("click", () => {
  closeCategoryDialog();
});

btnCloseProfileDialog.addEventListener("click", () => {
  closeUpdateProfileDialog();
});

btnClosePasswordDialog.addEventListener("click", () => {
  closeUpdatePasswordDialog();
});


btnSaveCategory.addEventListener("click", async () => {
  const title = categoryTitleInput.value;
  const description = categoryDescriptionInput.value;

  const category: Category = {
    title: title,
    description: description,
  };

  if (category.title === "") {
    showToast("Title cannot be empty", toastContainer, "error");
    return;
  }
  if (category.description === "") {
    showToast("Description cannot be empty", toastContainer, "error");
    return;
  }
  
  if (categoryId === "") {
    await saveCategory(category);
  }
  // Update category if id is not empty
  if (categoryId !== "") {
    category.id = categoryId;
    await updateCategory(category);
  
    categoryId = "";
  }
  
  renderUserCategories(await getUserCategories());
  
  closeCategoryDialog();
});


const closeCategoryDialog = () => {
  categoryTitleInput.value = "";
  categoryDescriptionInput.value = "";
  categoryModal.hide();
  categoryId = "";
};

// Render user categories
const renderUserCategories = (categories: Category[]) => {
  // If there are no categories display message
  categoryContainer.innerHTML = "";
  if (categories.length === 0) {
    categoryContainer.innerHTML =
      "<h5 class='text-center text-primary'>No Categories found</h5>";
    return;
  }
  
  categories.forEach((category: Category) => {
    categoryContainer.appendChild(createCategoryCard(category));
  });
};

// Create category card/row for table
const createCategoryCard = (category: Category) => {
  const row = document.createElement("tr");

  const title = document.createElement("td");
  title.textContent = category.title;

  const description = document.createElement("td");
  description.textContent = category.description;

  const actions = document.createElement("td");
  actions.setAttribute("colspan", "2");
  const editButton = document.createElement("button");
  editButton.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
  editButton.classList.add("btn", "btn-outline-primary", "col");
  editButton.addEventListener("click", () => {
    categoryId = category.id!;
    categoryModal.show();
    categoryTitleInput.value = category.title;
    categoryDescriptionInput.value = category.description;
  });
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
  deleteButton.classList.add(
    "btn",
    "btn-outline-danger",
    "col",
    "mt-3",
    "mt-lg-0",
    "mt-md-0",
    "mt-sm-0",
    "ms-0",
    "ms-lg-3",
    "ms-md-5",
    "ms-sm-5"
  );
  deleteButton.addEventListener("click", () => {
    deleteCategory(category.id!);
  });
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  row.appendChild(title);
  row.appendChild(description);
  row.appendChild(actions);
  return row;
};

/* -------------------------------------------------------------------------- */
/*                                  API Calls                                 */
/* -------------------------------------------------------------------------- */

/* ------------------------- Getting user categories ------------------------ */
const getUserCategories = async () => {
  try {
    const categories = await createGetRequest("/categories/");
    return categories!.data;
  } catch (error) {
    showErrorResponse(error);
  }
};

/* --------------------------- Adding new category -------------------------- */
const saveCategory = async (category: Category) => {
  try {
    const response = await createPostRequest("/categories/", category);
    if (response.status == HttpStatusCode.Accepted) {
      renderUserCategories(await getUserCategories());
      showToast(response.data.message, toastContainer, "success");
      closeCategoryDialog();
    }
  } catch (error) {
    showErrorToast(error);
  }
};

/* --------------------------- Deleting a category -------------------------- */
const deleteCategory = async (id: string) => {
  try {
    const response = await createDeleteRequest(`/categories/${id}`);
    if (response.status === HttpStatusCode.Ok) {
      renderUserCategories(await getUserCategories());
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};
/* ----------------------------- Update category ---------------------------- */
const updateCategory = async (category: Category) => {
  try {
    const response = await createPutRequest("/categories/", category);
    if (response.status == HttpStatusCode.Accepted) {
      renderUserCategories(await getUserCategories());
      showToast(response.data.message, toastContainer, "success");
      closeCategoryDialog();
    }
  } catch (error) {
    showErrorToast(error);
  }
};
/* ---------------------------- Show error toast ---------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showErrorToast = (error: any) => {
  const message =
    showErrorResponse(error) || error.response.data.message || error;
  showToast(message, toastContainer, "error");
};

const renderUserDetails = async () => {
  const userDetails = await createGetRequest("/users/");
  
  if (userDetails) {
    const { username, email, updatedAt, createdAt } = userDetails.data;
  
    displayUsername.textContent = username;
  
    displayEmail.textContent = email;
  
    displayUpdatedAt.textContent = new Date(updatedAt)
      .toUTCString()
      .substring(0, 16);
  
    displayCreatedAt.textContent = new Date(createdAt)
      .toUTCString()
      .substring(0, 16);
  }
};


const closeUpdateProfileDialog = () => {
  updateProfileModal.hide();
  updateUsernameInput.value = "";
  updateEmailInput.value = "";
};

const closeUpdatePasswordDialog = () => {
  updatePasswordModal.hide();
  updatePasswordInput.value = "";
  updateConfirmPasswordInput.value = "";
};


btnSaveProfile.addEventListener("click", async () => {
  const newUsername = updateUsernameInput.value;
  const newEmail = updateEmailInput.value;

  const user: User = {};
  user.email = newEmail;
  user.username = newUsername;

  await updateProfile(user);
});

btnUpdatePassword.addEventListener("click", () => {

  closeUpdateProfileDialog();

  updatePasswordModal.show();
});


btnSaveNewPassword.addEventListener("click", () => {
 
  const newPassword = updatePasswordInput.value;
  const newConfirmPassword = updateConfirmPasswordInput.value;
 
  if (newPassword !== newConfirmPassword) {
    showToast("Passwords do not match", toastContainer, "error");
    return;
  }
  
  if (newPassword === "") {
    showToast("Password cannot be empty", toastContainer, "error");
    return;
  }
  
  const user: User = {};
  user.password = newPassword;
  
  updatePassword(user);
});


const updateProfile = async (user: User) => {
  try {
    if (user.username === "") {
      showToast("Username cannot be empty", toastContainer, "error");
      return;
    }
    if (user.email === "") {
      showToast("Email cannot be empty", toastContainer, "error");
      return;
    }
    const response = await createPutRequest("/users/", user);
    if (response.status === HttpStatusCode.Accepted) {
      renderUserDetails();
      closeUpdateProfileDialog();
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};

// Update password
const updatePassword = async (user: User) => {
  try {
    const response = await createPutRequest("/users/", user);
    if (response.status === HttpStatusCode.Accepted) {
      showToast(response.data.message, toastContainer, "success");
      closeUpdatePasswordDialog();
    }
  } catch (error) {
    showErrorToast(error);
  }
};
