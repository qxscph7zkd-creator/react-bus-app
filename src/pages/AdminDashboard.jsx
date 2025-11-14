import { Link } from "react-router-dom";
import "./AdminDashboard.css";

/** Số liệu demo — bạn có thể thay bằng dữ liệu thật lấy từ API */
const DEMO = {
  drivers: 20,
  students: 40,
  routes: 50,
  pickedToday: 346,
  totalToday: 370,
};

export default function AdminDashboard() {
  return (
    <div className="adm">
      {/* HERO với minh hoạ */}
      <section className="adm-hero">
        <div className="hero-copy">
          <span className="eyebrow">SSB 1.0</span>
          <h1>Trung tâm quản trị</h1>
          <p>
            Giám sát xe buýt học sinh theo thời gian thực, quản lý tài xế, học sinh,
            tuyến đường và thống kê báo cáo trong một nơi duy nhất.
          </p>

          <div className="hero-actions">
            <Link className="btn primary" to="/admin/reports">Xem báo cáo hôm nay</Link>
            <Link className="btn ghost" to="/admin/routes">Quản lý tuyến đường</Link>
          </div>

          <div className="chips">
            <span className="chip">Đúng giờ trung bình: <b>94%</b></span>
            <span className="chip">Đã đón hôm nay: <b>{DEMO.pickedToday}/{DEMO.totalToday}</b></span>
          </div>
        </div>

        {/* SVG minh hoạ (không cần ảnh ngoài) */}
        <div className="hero-art" aria-hidden="true">
          <svg viewBox="0 0 520 360" className="art">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2aa6ff" /><stop offset="1" stopColor="#0a3b7a" />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#37b34a" /><stop offset="1" stopColor="#78d96b" />
              </linearGradient>
              <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>

            {/* nền */}
            <rect x="0" y="0" width="520" height="360" fill="url(#g1)" opacity=".18" />
            <ellipse cx="380" cy="300" rx="160" ry="40" fill="#000" opacity=".08" filter="url(#soft)" />

            {/* khối nhà */}
            <g opacity=".35">
              <rect x="40" y="160" width="70" height="120" rx="6" fill="#ffffff" />
              <rect x="120" y="130" width="60" height="150" rx="6" fill="#ffffff" />
              <rect x="190" y="180" width="50" height="100" rx="6" fill="#ffffff" />
            </g>

            {/* xe buýt */}
            <g transform="translate(260,170)">
              <rect x="0" y="20" width="220" height="80" rx="16" fill="#fff" />
              <rect x="8" y="28" width="204" height="48" rx="8" fill="#eaf3ff" />
              <rect x="12" y="32" width="60" height="40" rx="6" fill="#d9ecff" />
              <rect x="78" y="32" width="60" height="40" rx="6" fill="#d9ecff" />
              <rect x="144" y="32" width="60" height="40" rx="6" fill="#d9ecff" />

              <rect x="0" y="74" width="220" height="26" rx="0 0 16 16" fill="url(#g2)" />

              {/* đèn & logo */}
              <circle cx="12" cy="96" r="5" fill="#ffd159" />
              <rect x="188" y="90" width="20" height="6" rx="3" fill="#fff" opacity=".9" />
              <rect x="88" y="90" width="44" height="6" rx="3" fill="#fff" opacity=".9" />

              {/* bánh xe */}
              <g>
                <circle cx="52" cy="114" r="18" fill="#1f2937" />
                <circle cx="52" cy="114" r="8" fill="#9ca3af" />
                <circle cx="170" cy="114" r="18" fill="#1f2937" />
                <circle cx="170" cy="114" r="8" fill="#9ca3af" />
              </g>
            </g>

            {/* cây & đường */}
            <g>
              <rect x="60" y="255" width="420" height="6" fill="#fff" opacity=".8" />
              <rect x="60" y="292" width="420" height="6" fill="#fff" opacity=".5" />
              <rect x="60" y="329" width="420" height="6" fill="#fff" opacity=".3" />
              <rect x="96" y="280" width="10" height="46" rx="3" fill="#37b34a" />
              <circle cx="101" cy="270" r="16" fill="#78d96b" />
            </g>
          </svg>
        </div>
      </section>

      {/* KPI */}
      <section className="adm-kpis">
        <KPI label="Tài xế" value={DEMO.drivers} />
        <KPI label="Học sinh" value={DEMO.students} />
        <KPI label="Tuyến đường" value={DEMO.routes} />
        <KPI label="Đã đón hôm nay" value={`${DEMO.pickedToday}/${DEMO.totalToday}`} />
      </section>

      {/* MODULE CARDS */}
      <section className="adm-mods">
        <Module
          title="Quản lý tài xế"
          desc="Danh sách, trạng thái hoạt động, ca làm việc và số điện thoại liên hệ."
          to="/admin/drivers"
          tag="Quản trị"
        />
        <Module
          title="Quản lý học sinh"
          desc="Hồ sơ học sinh, lớp, tuyến, điểm đón/trả và phụ huynh liên hệ."
          to="/admin/students"
          tag="Hồ sơ"
        />
        <Module
          title="Tuyến đường"
          desc="Xem 50 tuyến, tìm kiếm theo quận/phường, chọn để xem chi tiết & bản đồ."
          to="/admin/routes"
          tag="Lộ trình"
        />
        <Module
          title="Báo cáo đón/trả"
          desc="Dashboard theo ngày/ca/tuyến, ngoại lệ (chưa đón/đi muộn), hiệu suất."
          to="/admin/reports"
          tag="Thống kê"
        />
      </section>

      {/* Notices + Activity */}
      <section className="adm-bottom">
        <div className="card">
          <div className="card-title">Thông báo nhanh</div>
          <ul className="list">
            <li>⏱️ Hệ thống cập nhật vị trí mỗi <b>3 giây</b>.</li>
            <li>🚌 Tuyến <b>9</b> tạm đổi lộ trình do sửa đường (07–10/11).</li>
            <li>📄 Vui lòng hoàn tất danh sách học sinh học kỳ I trước <b>15/11</b>.</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-title">Hoạt động gần đây</div>
          <ul className="timeline">
            <li><span className="dot ok" /> Đã đón 28/28 học sinh — Tuyến 3</li>
            <li><span className="dot warn" /> Trễ 7’ tại trạm “Chung cư A” — Tuyến 5</li>
            <li><span className="dot" /> Tài xế Lê Tấn Nhật Minh đổi ca chiều</li>
            <li><span className="dot" /> Cập nhật biển số xe 51B-123.45</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="kpi">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

function Module({ title, desc, to, tag }) {
  return (
    <div className="mod">
      <div className="mod-tag">{tag}</div>
      <h3 className="mod-title">{title}</h3>
      <p className="mod-desc">{desc}</p>
      <Link className="btn link" to={to}>Vào trang</Link>
    </div>
  );
}
