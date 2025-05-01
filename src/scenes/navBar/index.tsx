import { Button, DarkThemeToggle, Navbar } from "flowbite-react";

import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

import "../../styles/scenes/navBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Navbar fluid className="nav-bar">
      <div></div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <DarkThemeToggle />
        <Button onClick={handleLogout}>Logout</Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
