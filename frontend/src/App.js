import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Confirm from "./components/Confirm";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import GroupSelect from "./pages/GroupSelect";
import DashboardForGroup from "./pages/DashboardForGroup";
import Emails from "./pages/Emails";
import CreateEmail from "./pages/CreateEmail";
import EditEmail from "./pages/EditEmail";

function App() {
  return (
    <div className="appContainer">
      <Router>
        <Header />
        <main className="body-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<GroupSelect />} />
            <Route path="/emails" element={<Emails />} />
            <Route path="/emails/:emailID" element={<EditEmail />} />
            <Route path="/create-email" element={<CreateEmail />} />
            <Route path="/confirm/:emailID" element={<Confirm />} />
            <Route path="/:groupID" element={<DashboardForGroup />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
