import { Link } from "react-router-dom";
import "./Introduce.css";

export default function Introduce() {
  const quickLinks = [
    { to: "/", label: "Tổng quan" },
    { to: "/admin/drivers", label: "Tài xế" },
    { to: "/admin/students", label: "Học sinh" },
    { to: "/admin/routes", label: "Tuyến đường" },
    { to: "/admin/reports", label: "Báo cáo" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = new FormData(e.currentTarget).get("contact");
    if (!val) return;
    alert(`Cảm ơn bạn! Hệ thống đã ghi nhận: ${val}`);
    e.currentTarget.reset();
  };

  return (
    <main className="intro">
      {/* Hero nhỏ */}
      <section className="intro-hero">
        <div className="eyebrow">SSB 1.0 • Smart School Bus Tracking</div>
        <h1>Giới thiệu hệ thống</h1>
        <p>
          Đây là trang giới thiệu tóm tắt, gom lại các thông tin giống phần footer:
          giảng viên hướng dẫn, sinh viên thực hiện, liên hệ học thuật, liên kết nhanh,
          và form góp ý để cải tiến đồ án.
        </p>
      </section>

      {/* Dải “lợi ích” (tùy chọn) */}
      <section className="intro-feats">
        <Feat title="Theo dõi thời gian thực" desc="Vị trí xe cập nhật mỗi 3 giây, kiểm soát lộ trình, điểm đón/trả rõ ràng." />
        <Feat title="Cảnh báo an toàn" desc="Thông báo trễ, vắng, hoặc lệch tuyến. Hỗ trợ liên hệ phụ huynh tức thời." />
        <Feat title="Đa vai trò – một giao diện" desc="Admin, tài xế, phụ huynh truy cập thống nhất; dữ liệu đồng bộ, bảo mật." />
        <Feat title="Thiết kế cho Việt Nam" desc="Ngôn ngữ & trải nghiệm quen thuộc, tối ưu cho bối cảnh địa phương." flag />
      </section>

      {/* Khối giống footer */}
      <section className="intro-panel">
        <div className="panel-left">
          <div className="brand">
            <BusIcon /> <div><b>SSB 1.0</b><span>Smart School Bus Tracking</span></div>
          </div>

          <h3>Thông tin đồ án</h3>
          <ul className="list">
            <li><b>GVHD:</b> ThS. Từ Lăng Phiêu (ĐH Sài Gòn)</li>
            <li><b>SVTH:</b> Lê Tấn Nhật Minh – Khoa Toán Ứng Dụng</li>
            <li><b>SVTH:</b> Võ Văn Truyền Vũ – Khoa Toán Ứng Dụng</li>
            <li><b>SVTH:</b> Trần Thanh Trúc Hân – Khoa Toán Ứng Dụng</li>
            <li><b>SVTH:</b> Phạm Nguyễn Thanh Trúc – Khoa Toán Ứng Dụng</li>
            <li><b>Học kỳ:</b> 2025–2026 (demo học thuật)</li>
          </ul>
        </div>

        <div className="panel-mid">
          <h3>Liên hệ học thuật</h3>
          <ul className="list">
            <li>📞 0708 850 254</li>
            <li>✉️ <a href="mailto:letannhatminh@gmail.com">letannhatminh@gmail.com</a></li>
            <li>🔗 <a href="https://thongtindaotao.sgu.edu.vn/#/home" target="_blank" rel="noreferrer">
              thongtindaotao.sgu.edu.vn/#/home
            </a></li>
          </ul>

          <h3>Liên kết nhanh</h3>
          <ul className="links">
            {quickLinks.map(x => (
              <li key={x.to}><Link to={x.to}>{x.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="panel-right">
          <h3>Góp ý cho đồ án</h3>
          <form className="feedback" onSubmit={handleSubmit}>
            <input
              name="contact"
              placeholder="Email hoặc số điện thoại"
              aria-label="Góp ý: thông tin liên hệ"
            />
            <button type="submit">Gửi</button>
          </form>

          <div className="dots">
            <span className="dot d1" />
            <span className="dot d2" />
            <span className="dot d3" />
            <span className="dot d4" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feat({ title, desc, flag }) {
  return (
    <div className="feat">
      <div className="feat-icon">{flag ? "🇻🇳" : "🚌"}</div>
      <div>
        <div className="feat-title">{title}</div>
        <div className="feat-desc">{desc}</div>
      </div>
    </div>
  );
}

function BusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...props} aria-hidden="true">
      <path fill="currentColor" d="M4 6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2v1a1 1 0 1 1-2 0v-1H8v1a1 1 0 1 1-2 0v-1a2 2 0 0 1-2-2V6zm2 1h12v6H6V7zm1 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  );
}
