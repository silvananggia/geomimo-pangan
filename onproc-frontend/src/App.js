import React from "react";
import SessionManager from "./components/SessionManager.js";
import MyRouter from "./router/index.js";

function App() {
  return (
    <div className="app">
    {/*   <SessionManager /> */}
      <MyRouter />
    </div>
  );
}

export default App;
