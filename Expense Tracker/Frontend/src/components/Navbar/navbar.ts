/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import * as bootstrap from "bootstrap";
import UserService from "../../service/UserService";

// Render navbar in placeholder and set active class
const renderNavBar = (placeholder: HTMLElement, active: string) => {
  fetch("../../components/Navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      
      placeholder.innerHTML = data;
      
      const navLinks = document.querySelectorAll(".nav-link");
      
      const logout = document.getElementById("btn-logout");
      
      new bootstrap.Dropdown(
        document.getElementById("nav-dropdown") as HTMLElement
      );

      
      logout?.addEventListener("click", async () => {
        
        await UserService.logout();
        
        window.location.href = "/views/login/";
      });
      
      for (const navLink of navLinks) {
        navLink.classList.remove("active");
      }
      // Add active class to current page
      const currentPage = document.getElementById(active);
      currentPage!.classList.add("active");
    });
};
export default renderNavBar;
