import { DarkThemeToggle, Navbar } from "flowbite-react";

import "../../styles/scenes/navBar.css";

const NavBar = () => {
  return (
    <Navbar fluid className="nav-bar">
      <div></div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <DarkThemeToggle />
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
