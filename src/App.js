import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <div className="bg-slate-950 text-slate-100 min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
