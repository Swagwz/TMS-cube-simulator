import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import GlobalDeleteDialog from "./components/GlobalDeleteDialog";

import Home from "./routes/Home";
import ProbabilitySearch from "./routes/ProbabilitySearch";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/probability-search" element={<ProbabilitySearch />} />
      </Routes>
      <GlobalDeleteDialog />
      <Footer />
    </Router>
  );
}
