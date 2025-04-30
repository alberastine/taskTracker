import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
