import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div >
      {/* Navbar */}
      <Navbar />
      <main className="mt-[50px]">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
