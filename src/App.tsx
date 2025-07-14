
import MainLayout from "@core/layouts/MainLayout";
import { routes } from "@core/router/routes";
import React from "react";
import { Route, Routes } from "react-router-dom";

const App: React.FC = () => {

console.log('AUTH Endpoint:', import.meta.env.VITE_AUTH_API_ENDPOINT);
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default App;