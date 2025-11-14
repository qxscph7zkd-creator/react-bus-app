import { useEffect, useMemo, useState } from "react";
import "./DriverPortal.css";

/* ===== MOCK DATA ===== */
const SHIFT_START = { h: 6, m: 30 };
const startMs = () => {
    const t = new Date();
    t.setHours(SHIFT_START.h, SHIFT_START.m, 0, 0);
    return t.getTime();
};

const ROUTE = {
    id: "R015",
    name: "Tuyến 15: TP Thủ Đức → Q.1",
    busCode: "51F-123.45",
    driver: "Lê Tấn Nhật Minh",
    assistant: "Trần Ngọc Bảo Hân",
    note: "Đoạn Trường Sa sửa đường, có thể chậm 3–5 phút.",
    stops: [
        { id: "S1", name: "Chung cư Vincity", etaMin: 0 },
        { id: "S2", name: "Nguyễn Văn Linh", etaMin: 8 },
        { id: "S3", name: "Hồ Con Rùa", etaMin: 22 },
        { id: "S4", name: "Trường THCS DEF", etaMin: 35 },
    ],
};

const STUDENTS = [
    { id: "HS001", name: "Nguyễn Minh An", grade: "5A", stopId: "S1", parentId: "P01" },
    { id: "HS002", name: "Trần Gia Bảo", grade: "4B", stopId: "S2", parentId: "P02" },
    { id: "HS003", name: "Phạm Cẩm Tiên", grade: "5C", stopId: "S2", parentId: "P03" },
    { id: "HS004", name: "Lê Quang Huy", grade: "3A", stopId: "S3", parentId: "P04" },
    { id: "HS005", name: "Đỗ Gia Khánh", grade: "4C", stopId: "S4", parentId: "P05" },
    { id: "HS006", name: "Võ Thảo Vy", grade: "5B", stopId: "S3", parentId: "P06" },
    { id: "HS007", name: "Bùi Đức Thiện", grade: "4A", stopId: "S1", parentId: "P07" },
];

const PARENTS = [
    { id: "P01", name: "Nguyễn Hải Nam", phone: "0901 234 111" },
    { id: "P02", name: "Trần Thu Hà", phone: "0901 234 222" },
    { id: "P03", name: "Phạm Quốc Vinh", phone: "0901 234 333" },
    { id: "P04", name: "Lê Thị Hương", phone: "0901 234 444" },
    { id: "P05", name: "Đỗ Minh Đức", phone: "0901 234 555" },
    { id: "P06", name: "Võ Đức Trí", phone: "0901 234 666" },
    { id: "P07", name: "Bùi Thị Thanh", phone: "0901 234 777" },
];

const INCIDENTS = [
    { id: 1, time: "06:48", text: "Kẹt nhẹ tại chân cầu Sài Gòn (+2’)." },
    { id: 2, time: "07:05", text: "Phụ huynh HS003 báo vắng hôm nay." },
];

/* ===== PAGE ===== */
export default function DriverPortal() {
    const [now, setNow] = useState(Date.now());
    const [picked, setPicked] = useState(() =>
        Object.fromEntries(STUDENTS.map(s => [s.id, false]))
    );
    const [query, setQuery] = useState("");

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const nextStop = useMemo(() => {
        const mins = (now - startMs()) / 60000;
        return ROUTE.stops.find(s => s.etaMin > mins) || ROUTE.stops.at(-1);
    }, [now]);

    const progress = useMemo(() => {
        const total = STUDENTS.length;
        const done = Object.values(picked).filter(Boolean).length;
        const pct = Math.round((done / total) * 100);
        return { total, done, pct };
    }, [picked]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return STUDENTS;
        return STUDENTS.filter(s =>
            s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
        );
    }, [query]);

    const toggle = (id) => setPicked(p => ({ ...p, [id]: !p[id] }));

    return (
        <main className="drv2">
            {/* HERO */}
            <section className="drv2-hero">
                <div className="hero-copy">
                    <div className="eyebrow">Driver Portal</div>
                    <h1>{ROUTE.name}</h1>
                    <p className="muted">
                        Mã xe <b>{ROUTE.busCode}</b> • Tài xế <b>{ROUTE.driver}</b> • Phụ xe <b>{ROUTE.assistant}</b>
                    </p>

                    <div className="ribbon">
                        <span className="chip good">Đã đón: {progress.done}/{progress.total}</span>
                        <span className="chip">Giờ hệ thống: {new Date(now).toLocaleTimeString()}</span>
                        <span className="chip accent">Điểm kế tiếp: {nextStop.name}</span>
                    </div>

                    <div className="bar"><div className="bar-inner" style={{ width: `${progress.pct}%` }} /></div>
                    <div className="bar-caption">Tiến độ {progress.pct}%</div>

                    <div className="actions">
                        <button className="btn primary">Bắt đầu ca</button>
                        <button className="btn ghost">Báo sự cố</button>
                        <button className="btn ghost">Kết thúc ca</button>
                    </div>

                    <div className="note"><b>Ghi chú tuyến:</b> {ROUTE.note}</div>
                </div>

                <div className="hero-map">
                    <div className="map-card">
                        <div className="card-title">Bản đồ (minh họa)</div>
                        <iframe title="map"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=106.66,10.76,106.74,10.80&layer=mapnik" />
                        <div className="map-legend">
                            <span className="dot next" /> Điểm kế tiếp
                            <span className="dot stop" /> Điểm dừng
                        </div>
                    </div>
                </div>
            </section>

            {/* GRID 1: Học sinh + Điểm dừng */}
            <section className="drv2-grid">
                <div className="card">
                    <div className="card-head">
                        <div className="card-title">Danh sách đón (check-in)</div>
                        <input className="search" placeholder="Tìm HS theo tên hoặc mã…"
                            value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <table className="table">
                        <thead><tr><th>Mã HS</th><th>Họ tên</th><th>Lớp</th><th>Điểm đón</th><th>Đã đón</th></tr></thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>{s.grade}</td>
                                    <td>{ROUTE.stops.find(x => x.id === s.stopId)?.name}</td>
                                    <td>
                                        <label className="sw">
                                            <input type="checkbox" checked={picked[s.id]} onChange={() => toggle(s.id)} />
                                            <span />
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="hint">* Toggle “Đã đón” chỉ là minh họa UI.</div>
                </div>

                <div className="card">
                    <div className="card-title">Điểm dừng & ETA</div>
                    <ul className="stops">
                        {ROUTE.stops.map(st => (
                            <li key={st.id} className={st.id === nextStop.id ? "active" : ""}>
                                <div>
                                    <b>{st.name}</b>
                                    <div className="sub">ETA +{st.etaMin}′</div>
                                </div>
                                {st.id === nextStop.id ? <span className="badge">Kế tiếp</span>
                                    : <span className="badge ghost">Chờ</span>}
                            </li>
                        ))}
                    </ul>

                    <div className="divider" />
                    <div className="card-title">Sự cố gần đây</div>
                    <ul className="timeline">
                        {INCIDENTS.map(i => (<li key={i.id}><span className="tt">{i.time}</span> {i.text}</li>))}
                    </ul>
                </div>
            </section>

            {/* GRID 2: Phụ huynh liên hệ */}
            <section className="drv2-grid single">
                <div className="card">
                    <div className="card-title">Phụ huynh liên hệ</div>
                    <table className="table">
                        <thead><tr><th>Học sinh</th><th>Phụ huynh</th><th>Số điện thoại</th><th>Gọi</th></tr></thead>
                        <tbody>
                            {STUDENTS.map(s => {
                                const p = PARENTS.find(x => x.id === s.parentId);
                                return (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>{p?.name}</td>
                                        <td>{p?.phone}</td>
                                        <td><a className="call" href={`tel:${(p?.phone || '').replace(/\s/g, '')}`}>Gọi</a></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="hint">* Bấm “Gọi” sẽ mở ứng dụng gọi điện (trên mobile).</div>
                </div>
            </section>
        </main>
    );
}
