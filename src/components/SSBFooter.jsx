import { Link } from "react-router-dom";
import { useState } from "react";
import "./SSBFooter.css";

export default function SSBFooter() {
    const [contact, setContact] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!contact.trim()) return;
        alert(`Cảm ơn bạn! Thông tin phản hồi đã được ghi nhận: ${contact}`);
        setContact("");
    };

    return (
        <footer className="ssb-footer">
            <div className="wrap">
                {/* Cột 1: Brand + Thông tin đồ án */}
                <div className="col">
                    <div className="brand">
                        <BusIcon />
                        <div>
                            <div className="brand-name">SSB 1.0</div>
                            <div className="brand-sub">Smart School Bus Tracking • Đồ án Web Front-end (React + Vite)</div>
                        </div>
                    </div>

                    <div className="project">
                        <div className="proj-title">Thông tin đồ án</div>
                        <ul>
                            <li><b>GVHD:</b> ThS. Từ Lãng Phiêu (ĐH Sài Gòn)</li>
                            <li><b>SVTH:</b> Lê Tấn Nhật Minh – Khoa Toán Ứng Dụng</li>
                            <li><b>SVTH:</b> Võ Văn Truyền Vũ - Khoa Toán Ứng Dụng</li>
                            <li><b>SVTH:</b> Trần Thanh Trúc Hân - Khoa Toán Ứng Dụng</li>
                            <li><b>SVTH:</b> Phạm Thanh Trúc - Khoa Toán Ứng Dụng</li>
                            <li><b>Học kỳ:</b> 2025–2026 (demo học thuật)</li>
                        </ul>
                    </div>
                </div>

                {/* Cột 2: Liên hệ học thuật */}
                <div className="col">
                    <div className="col-title">Liên hệ học thuật</div>
                    <ul className="links">
                        <li>📞 0708850254</li>
                        <li>✉️  letannhatminh@gmail.com</li>
                        <li>🌐  https://thongtindaotao.sgu.edu.vn/#/home </li>
                    </ul>

                    <div className="col-title" style={{ marginTop: 10 }}>Liên kết nhanh</div>
                    <ul className="links">
                        <li><Link to="/admin">Tổng quan</Link></li>
                        <li><Link to="/admin/drivers">Tài xế</Link></li>
                        <li><Link to="/admin/students">Học sinh</Link></li>
                        <li><Link to="/admin/routes">Tuyến đường</Link></li>
                        <li><Link to="/admin/reports">Báo cáo</Link></li>
                    </ul>
                </div>

                {/* Cột 3: Góp ý / phản hồi */}
                <div className="col">
                    <div className="col-title accent">GÓP Ý CHO ĐỒ ÁN</div>
                    <p className="muted">Nhập email hoặc số điện thoại để nhận bản cập nhật / góp ý cải tiến.</p>
                    <form className="cta" onSubmit={submit}>
                        <input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Email hoặc số điện thoại"
                            aria-label="Thông tin liên hệ"
                        />
                        <button type="submit">GỬI</button>
                    </form>

                    <div className="socials">
                        <a href="#" aria-label="Facebook">🟦</a>
                        <a href="#" aria-label="YouTube">🟥</a>
                        <a href="#" aria-label="Zalo">🟦</a>
                        <a href="#" aria-label="TikTok">⚫️</a>
                    </div>
                </div>
            </div>

            <hr className="divider" />

            <div className="bottom">
                <div>© 2025 SSB 1.0 • Đồ án học tập. <b>Không dùng cho mục đích thương mại.</b></div>
                <div className="muted">Miễn trừ trách nhiệm: Dữ liệu trong hệ thống là mô phỏng để trình bày giao diện và chức năng.</div>
            </div>
        </footer>
    );
}

function BusIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...props} aria-hidden="true">
            <path fill="#ffd159" d="M4 6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2v1a1 1 0 1 1-2 0v-1H8v1a1 1 0 1 1-2 0v-1a2 2 0 0 1-2-2V6zm2 1h12v6H6V7zm1 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
    );
}
