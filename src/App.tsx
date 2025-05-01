import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import UserProfile from "./component/UserProfile";

import { UserContextProvider } from "./context/userContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;
