import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";

import { UserContextProvider } from "./context/userContext";
import SignUpPage from "./scenes/signupPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;
