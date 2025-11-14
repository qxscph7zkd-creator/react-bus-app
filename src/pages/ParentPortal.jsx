import { useMemo, useState } from "react";
import "./ParentPortal.css";

/* ===== MOCK ===== */
const PARENT_PROFILE = {
    name: "Nguyễn Hải Nam",
    email: "nam.nguyen@example.com",
    phone: "079 767 1460",
    };

const CHILDREN = [
    { id: "HS001", name: "Nguyễn Minh An", grade: "5A", routeId: "R015", stop: "Chung cư Vincity" },
    { id: "HS010", name: "Ngô Minh Tâm", grade: "5D", routeId: "R008", stop: "Hồ Con Rùa" },
];

const ROUTE_SUMMARY = {
    R015: { name: "Tuyến 15: TP Thủ Đức → Q.1", lastPos: "Qua cầu Sài Gòn", etaMin: 12, busCode: "51F-123.45", ontime: true },
    R008: { name: "Tuyến 8: Gò Vấp → Tân Bình", lastPos: "Ngã sáu Gò Vấp", etaMin: 18, busCode: "51B-888.88", ontime: false },
};

const NOTIFS = [
    { id: 1, time: "06:55", text: "Xe sắp đến điểm đón (còn ~5’)." },
    { id: 2, time: "07:40", text: "Đã đến trường an toàn." },
    { id: 3, time: "16:10", text: "Xe xuất phát chiều – ETA 16:40." },
];

const HISTORY = [
    { d: "12/11", pick: "Đúng giờ", drop: "Đúng giờ" },
    { d: "11/11", pick: "Đúng giờ", drop: "Chậm 3’" },
    { d: "10/11", pick: "Đúng giờ", drop: "Đúng giờ" },
    { d: "09/11", pick: "Vắng (phụ huynh báo)", drop: "—" },
    { d: "08/11", pick: "Chậm 2’", drop: "Đúng giờ" },
];

/* ===== PAGE ===== */
export default function ParentPortal() {
    const [childId, setChildId] = useState(CHILDREN[0].id);
    const child = useMemo(() => CHILDREN.find(c => c.id === childId), [childId]);
    const route = ROUTE_SUMMARY[child.routeId];

    return (
        <main className="prt2">
            {/* HERO */}
            <section className="prt2-hero">
                <div className="hero-copy">
                    <div className="eyebrow">Parent Portal</div>
                    <h1>Theo dõi xe buýt của con</h1>
                    <p className="muted">Chọn học sinh để xem tuyến, ETA dự kiến và vị trí gần nhất.</p>

                    <div className="row">
                        <label>Học sinh</label>
                        <select value={childId} onChange={e => setChildId(e.target.value)}>
                            {CHILDREN.map(c => (
                                <option key={c.id} value={c.id}>{c.name} – {c.grade}</option>
                            ))}
                        </select>
                    </div>

                    <div className="stats">
                        <Info label="Tuyến" value={route.name} />
                        <Info label="Điểm đón" value={child.stop} />
                        <Info label="Mã xe" value={route.busCode} />
                        <Info label="ETA" value={`${route.etaMin} phút`} ok={route.ontime} />
                    </div>

                    <div className={`status ${route.ontime ? "ok" : "warn"}`}>
                        {route.ontime ? "Trạng thái: Đúng giờ" : "Trạng thái: Có thể trễ nhẹ"}
                    </div>

                    <div className="actions">
                        <button className="btn primary">Nhận thông báo</button>
                        <button className="btn ghost">Xem lịch sử</button>
                    </div>
                </div>

                <div className="hero-side">
                    <div className="card">
                        <div className="card-title">Vị trí gần nhất</div>
                        <p className="muted">{route.lastPos}</p>
                        <div className="mini-map">
                            <iframe
                                title="map"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=106.68,10.77,106.72,10.80&layer=mapnik"
                            />
                        </div>
                        <div className="note">* Bản đồ minh hoạ; bản thật sẽ hiển thị marker xe & tuyến.</div>
                    </div>
                </div>
            </section>

            {/* GRID: Thông báo – Lịch sử – Thông tin phụ huynh – Danh sách con */}
            <section className="prt2-grid">
                <div className="card">
                    <div className="card-title">Thông báo gần đây</div>
                    <ul className="feed">
                        {NOTIFS.map(n => (
                            <li key={n.id}>
                                <span className="time">{n.time}</span>
                                <span className="text">{n.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <div className="card-title">Lịch sử đón/trả (5 ngày)</div>
                    <table className="table">
                        <thead><tr><th>Ngày</th><th>Buổi sáng</th><th>Buổi chiều</th></tr></thead>
                        <tbody>
                            {HISTORY.map(h => (
                                <tr key={h.d}>
                                    <td>{h.d}</td><td>{h.pick}</td><td>{h.drop}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="tips"><b>Mẹo:</b> Nên ra điểm đón trước 5′ và theo dõi ETA trong app.</div>
                </div>

                <div className="card">
                    <div className="card-title">Thông tin phụ huynh</div>
                    <ul className="contacts">
                        <li><b>Họ tên</b><span>{PARENT_PROFILE.name}</span></li>
                        <li><b>Email</b><span>{PARENT_PROFILE.email}</span></li>
                        <li><b>Điện thoại</b>
                            <span><a className="call" href={`tel:${PARENT_PROFILE.phone.replace(/\s/g, '')}`}>{PARENT_PROFILE.phone}</a></span>
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <div className="card-title">Danh sách con</div>
                    <table className="table">
                        <thead><tr><th>Mã HS</th><th>Họ tên</th><th>Lớp</th><th>Tuyến</th><th>Điểm đón</th></tr></thead>
                        <tbody>
                            {CHILDREN.map(c => (
                                <tr key={c.id}>
                                    <td>{c.id}</td><td>{c.name}</td><td>{c.grade}</td>
                                    <td>{ROUTE_SUMMARY[c.routeId].name}</td><td>{c.stop}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

function Info({ label, value, ok }) {
    return (
        <div className={`stat ${ok ? "ok" : ""}`}>
            <div className="s-label">{label}</div>
            <div className="s-value">{value}</div>
        </div>
    );
}
