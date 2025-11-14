// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SSBHeader from "./components/SSBHeader";
import SSBFooter from "./components/SSBFooter";   // ← thêm dòng này

// modules...
import TaiXeList from "./components/TaiXeList";
import HocSinhList from "./components/HocSinhList";
import TuyenDuongList from "./components/TuyenDuongList";
import BaoCaoDonTra from "./components/BaoCaoDonTra";

// pages...
import Home from "./pages/Home";
import Introduce from "./pages/Introduce";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <SSBHeader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/drivers" element={<TaiXeList />} />
        <Route path="/admin/students" element={<HocSinhList />} />
        <Route path="/admin/routes" element={<TuyenDuongList />} />
        <Route path="/admin/reports" element={<BaoCaoDonTra />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SSBFooter />   {/* ← đặt footer ở cuối */}
    </BrowserRouter>
  );
}
