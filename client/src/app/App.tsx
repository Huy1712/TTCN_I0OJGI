import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthProvider";
import { AppRouter } from "./router";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
