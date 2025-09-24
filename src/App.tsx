import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/Login";
import { PublicOnly, RequireAuth } from "./components/RequireAuth";
import InventoryManagement from "./components/InventoryManagement";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route
            path="/inventory-management"
            element={<RequireAuth><InventoryManagement /></RequireAuth>}
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
