import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return (
        <main className="home">
            {/* HERO */}
            <section className="home-hero">
                <div className="home-hero__copy">
                    <span className="eyebrow">SSB 1.0 • Smart School Bus Tracking</span>
                    <h1>Theo dõi xe buýt học sinh<br />thời gian thực tại Việt Nam</h1>
                    <p>
                        Quản lý tài xế – học sinh – tuyến đường trong một hệ thống duy nhất.
                        Cảnh báo an toàn, thống kê chính xác, giao diện hiện đại, tối ưu cho trường học Việt Nam.
                    </p>
                    <div className="home-hero__actions">
                        <Link className="btn primary" to="/admin">Vào Admin</Link>
                        <Link className="btn ghost" to="/introduce">Giới thiệu hệ thống</Link>
                    </div>

                    <ul className="home-hero__stats">
                        <li><b>300+</b><span>xe hoạt động đồng thời</span></li>
                        <li><b>98%</b><span>tỉ lệ đúng giờ</span></li>
                        <li><b>3s</b><span>chu kỳ cập nhật vị trí</span></li>
                    </ul>
                </div>

                {/* Minh hoạ: Bản đồ VN + xe buýt */}
                <div className="home-hero__art" aria-hidden="true">
                    <svg viewBox="0 0 680 520" className="art">
                        <defs>
                            <linearGradient id="hG1" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#0b3b7a" /><stop offset="1" stopColor="#042345" />
                            </linearGradient>
                            <linearGradient id="hG2" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="#37b34a" /><stop offset="1" stopColor="#78d96b" />
                            </linearGradient>
                            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="18" />
                            </filter>
                        </defs>

                        {/* nền gradient + vệt sáng */}
                        <rect x="0" y="0" width="680" height="520" fill="url(#hG1)" rx="18" />
                        <ellipse cx="520" cy="430" rx="220" ry="56" fill="#000" opacity=".18" filter="url(#blur)" />

                        {/* bản đồ VN (silhouette) */}
                        <path fill="#ffffff" opacity=".13" d="
              M349 70 l12 18 -8 22 16 22 -10 20 22 20 -8 24 14 20 -10 18 8 18
              -12 16 16 16 -8 18 12 18 -20 10 -22 2 -22 -14 -20 -2 -16 12 -22 -4 -18 -8
              -6 -20 12 -20 -16 -18 10 -16 -10 -16 6 -20 -8 -18 12 -14 -6 -18 8 -14 18 -10
              18 -2 10 -16 20 -10 z" transform="translate(220,40) scale(1.3)" />

                        {/* xe buýt */}
                        <g transform="translate(240,250)">
                            <rect x="0" y="30" width="360" height="120" rx="22" fill="#fff" />
                            <rect x="14" y="44" width="332" height="62" rx="10" fill="#eaf3ff" />
                            <rect x="24" y="52" width="94" height="46" rx="8" fill="#d9ecff" />
                            <rect x="126" y="52" width="94" height="46" rx="8" fill="#d9ecff" />
                            <rect x="228" y="52" width="94" height="46" rx="8" fill="#d9ecff" />
                            <rect x="0" y="118" width="360" height="32" rx="0 0 22 22" fill="url(#hG2)" />
                            <circle cx="96" cy="164" r="26" fill="#1f2937" /><circle cx="96" cy="164" r="10" fill="#9ca3af" />
                            <circle cx="264" cy="164" r="26" fill="#1f2937" /><circle cx="264" cy="164" r="10" fill="#9ca3af" />
                            <rect x="150" y="126" width="60" height="10" rx="5" fill="#fff" opacity=".9" />
                            <circle cx="18" cy="134" r="8" fill="#ffd159" />
                        </g>

                        {/* dải đỏ/xanh gợi cảm hứng màu Việt Nam + an toàn */}
                        <rect x="32" y="420" width="300" height="8" rx="4" fill="#e11d48" opacity=".9" />
                        <rect x="350" y="420" width="300" height="8" rx="4" fill="#16a34a" opacity=".9" />
                    </svg>
                </div>
            </section>

            {/* FINDER */}
            <section className="home-finder">
                <div className="finder">
                    <div className="finder-row">
                        <div className="field">
                            <label>Chọn vùng</label>
                            <select defaultValue="TP Hồ Chí Minh">
                                <option>TP Hồ Chí Minh</option>
                                <option>Hà Nội</option>
                                <option>Đà Nẵng</option>
                                <option>Cần Thơ</option>
                            </select>
                        </div>
                        <div className="field">
                            <label>Điểm đi</label>
                            <input placeholder="Nhập địa chỉ" />
                        </div>
                        <div className="field">
                            <label>Điểm đến</label>
                            <input placeholder="Nhập địa chỉ" />
                        </div>
                        <button className="btn primary wide">Tìm đường</button>
                    </div>
                    <p className="finder-hint">* Tính năng minh họa cho đồ án. Bản triển khai thật sẽ gợi ý lộ trình tối ưu và thời gian đến dự kiến (ETA).</p>
                </div>
            </section>

            {/* FEATURES */}
            <section className="home-features">
                <h2>Tại sao chọn SSB 1.0?</h2>
                <div className="grid">
                    <Feature
                        title="Theo dõi thời gian thực"
                        desc="Vị trí xe cập nhật mỗi 3 giây, kiểm soát lộ trình, bến đón/trả rõ ràng."
                        icon="🛰️"
                    />
                    <Feature
                        title="Cảnh báo an toàn"
                        desc="Thông báo trễ, vắng, hoặc lệch tuyến. Hỗ trợ liên hệ phụ huynh tức thời."
                        icon="🔔"
                    />
                    <Feature
                        title="Đa vai trò – một giao diện"
                        desc="Admin, tài xế, phụ huynh truy cập thống nhất; dữ liệu đồng bộ, bảo mật."
                        icon="👨‍👩‍👧‍👦"
                    />
                    <Feature
                        title="Thiết kế cho Việt Nam"
                        desc="Ngôn ngữ, địa danh, và thói quen sử dụng được tối ưu cho bối cảnh địa phương."
                        icon="🇻🇳"
                    />
                </div>
            </section>

            {/* CTA cuối */}
            <section className="home-cta">
                <div className="cta-card">
                    <h3>Sẵn sàng trải nghiệm SSB 1.0?</h3>
                    <p>Vào trang quản trị để xem dữ liệu giả lập của đồ án hoặc mở trang giới thiệu để đọc mô tả chi tiết.</p>
                    <div className="cta-actions">
                        <Link className="btn primary" to="/admin">Vào trang Admin</Link>
                        <Link className="btn ghost" to="/introduce">Xem giới thiệu</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

function Feature({ title, desc, icon }) {
    return (
        <div className="feature">
            <div className="feature-icon">{icon}</div>
            <div className="feature-title">{title}</div>
            <div className="feature-desc">{desc}</div>
        </div>
    );
}
