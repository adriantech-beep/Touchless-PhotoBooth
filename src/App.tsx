import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import QRPage from "./pages/QRPage";
import PayPage from "./pages/PayPage";
import ChooseControlPage from "./pages/ChooseControlPage";
import CameraCapture from "./presentational/CameraCapture";
import TemplatePicker from "./test/TemplatePicker";
import ChooseTemplatePage from "./pages/ChooseTemplatePage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/booth" element={<QRPage />} />
        <Route path="/pay/:id" element={<PayPage />} />
        <Route path="/choose-control/:id" element={<ChooseControlPage />} />
        <Route path="/live/:id" element={<CameraCapture />} />
        <Route path="/template-picker" element={<TemplatePicker />} />
        <Route path="/choosing-template" element={<ChooseTemplatePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
