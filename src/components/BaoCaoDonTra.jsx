import { useMemo, useState } from "react";
import "./BaoCaoDonTra.css";

/** ================== MOCK DATA GENERATOR ================== */
// 10 tuyến mẫu (bạn có thể đổi sang 50 nếu muốn)
const ROUTE_NAMES = [
  "Tuyến 1: Quận 1 – Quận 5",
  "Tuyến 2: Quận 7 – TP. Thủ Đức",
  "Tuyến 3: Quận 3 – Bình Thạnh",
  "Tuyến 4: Gò Vấp – Tân Bình",
  "Tuyến 5: Bình Chánh – Quận 10",
  "Tuyến 6: Quận 9 – Quận 2 – Quận 1",
  "Tuyến 7: Quận 11 – Quận 6",
  "Tuyến 8: Quận 4 – Quận 8",
  "Tuyến 9: Quận 12 – Tân Bình",
  "Tuyến 10: Tân Phú – Bình Tân",
];

const DRIVERS = [
  "Trần Ngọc Bảo Hân",
  "Lê Tấn Nhật Minh",
  "Nguyễn Văn An",
  "Phạm Quang Huy",
  "Hoàng Thùy Linh",
  "Đỗ Minh Khoa",
  "Ngô Bá Khánh",
  "Bùi Thanh Tâm",
];

const STOPS = ["Cổng trường", "Cổng sau", "Nhà thiếu nhi", "Chung cư A", "Chung cư B", "UBND phường"];

function seededRand(seed) {
  // pseudo random stable theo seed (để giao diện nhất quán mỗi lần chọn ngày)
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function makeDashboard(dateSeed, selectedShift) {
  // Tạo số liệu tổng hợp cho 10 tuyến
  const routeStats = ROUTE_NAMES.map((name, idx) => {
    const base = Math.floor(20 + seededRand(dateSeed + idx) * 16); // 20..35 HS
    const absent = Math.floor(seededRand(dateSeed * (idx + 2)) * 3); // 0..2
    const late = Math.floor(seededRand(dateSeed + idx * 7) * 4); // 0..3
    const pending = selectedShift === "all" ? Math.floor(seededRand(dateSeed + idx * 11) * 2) : 0; // ca all có thể còn pending
    const picked = Math.max(0, base - absent - pending);
    const onTimeRate = Math.max(0, Math.min(1, 0.82 + seededRand(idx + dateSeed) * 0.16)); // 82%..98%
    const avgDelay = Math.floor(seededRand(dateSeed - idx) * 7); // 0..6 phút
    return {
      id: idx + 1,
      name,
      total: base,
      picked,
      late,
      absent,
      pending,
      onTimeRate,
      avgDelay,
    };
  });

  // Tạo danh sách incident (chưa đón/chưa trả + đi muộn)
  const notPicked = [];
  const lateList = [];
  for (let i = 0; i < 14; i++) {
    const rIndex = Math.floor(seededRand(dateSeed + 30 + i) * routeStats.length);
    const r = routeStats[rIndex];
    const driver = DRIVERS[rIndex % DRIVERS.length];
    const name = SAMPLE_STUDENTS[(i * 3) % SAMPLE_STUDENTS.length];
    notPicked.push({
      id: `NP${String(i + 1).padStart(3, "0")}`,
      student: name,
      classRoom: SAMPLE_CLASSES[i % SAMPLE_CLASSES.length],
      route: r.name,
      stop: STOPS[i % STOPS.length],
      driver,
      phone: SAMPLE_PHONES[i % SAMPLE_PHONES.length],
      reason: ["Vắng mặt", "Thay đổi đột xuất", "Không liên lạc được", "Chờ phụ huynh"][i % 4],
    });
  }
  for (let i = 0; i < 16; i++) {
    const rIndex = Math.floor(seededRand(dateSeed + 60 + i) * routeStats.length);
    const r = routeStats[rIndex];
    const driver = DRIVERS[(rIndex + 2) % DRIVERS.length];
    const name = SAMPLE_STUDENTS[(i * 4 + 1) % SAMPLE_STUDENTS.length];
    lateList.push({
      id: `LT${String(i + 1).padStart(3, "0")}`,
      student: name,
      route: r.name,
      stop: STOPS[(i + 1) % STOPS.length],
      driver,
      minutes: 2 + Math.floor(seededRand(i + dateSeed) * 11), // 2..12
    });
  }

  // Tổng hợp KPI
  const totalStudents = routeStats.reduce((s, r) => s + r.total, 0);
  const totalPicked = routeStats.reduce((s, r) => s + r.picked, 0);
  const totalLate = routeStats.reduce((s, r) => s + r.late, 0);
  const totalAbsent = routeStats.reduce((s, r) => s + r.absent, 0);
  const avgOnTime = Math.round(
    (routeStats.reduce((s, r) => s + r.onTimeRate, 0) / routeStats.length) * 100
  );

  // Hiệu suất tài xế
  const driverPerf = DRIVERS.map((name, i) => {
    const trips = 2 + Math.floor(seededRand(dateSeed * (i + 1)) * 4); // 2..5
    const students = 25 + Math.floor(seededRand(dateSeed + i) * 30); // 25..55
    const late = Math.floor(seededRand(dateSeed - i) * 6); // 0..5
    const incidents = Math.floor(seededRand(dateSeed + 9 * i) * 3); // 0..2
    const onTime = Math.max(80, 98 - late * 3); // 80..98%
    return { name, trips, students, late, incidents, onTime };
  });

  return {
    routeStats,
    notPicked,
    lateList,
    kpi: {
      totalStudents,
      totalPicked,
      totalLate,
      totalAbsent,
      avgOnTime,
    },
    driverPerf,
  };
}

// Một ít dữ liệu tên/điện thoại/lớp để random hiển thị
const SAMPLE_STUDENTS = [
  "Nguyễn Minh An", "Trần Gia Bảo", "Phạm Thị Cẩm Tiên", "Lê Quang Huy", "Đỗ Gia Khánh",
  "Nguyễn Hoàng Lan", "Trương Minh Khang", "Võ Thanh Trúc", "Phan Bảo Anh", "Ngô Minh Tâm",
  "Bùi Thu Hà", "Đặng Hoàng Phúc", "Huỳnh Kim Ngân", "Mai Thành Đạt", "Dương Bảo Trân",
  "Nguyễn Phương Uyên", "Võ Hoàng Nam", "Lê Khánh Linh", "Trần Ngọc Bảo Hân", "Vũ Minh Trí",
  "Phạm Tuấn Kiệt", "Đoàn Gia Hân", "Lê Thành Long", "Nguyễn Quỳnh Như", "Hồ Bích Phương",
  "Phan Hoàng Phúc", "Đỗ Minh Châu", "Trương Gia Bảo", "Nguyễn Tuấn Minh", "Lý Khánh Vy",
  "Tạ Thanh Thảo", "Nguyễn Bảo Ngọc", "Phạm Đức Thịnh", "Võ Nhật Huy", "Trần Thành Tùng",
  "Nguyễn Khánh An", "Bùi Hoàng Anh", "Phạm Mai Phương", "Lê Tuấn Kiệt", "Nguyễn Thảo My",
];
const SAMPLE_CLASSES = ["1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C", "4A", "4B", "4C", "5A", "5B", "5C", "5D"];
const SAMPLE_PHONES = ["0901234567", "0902345678", "0903456789", "0904567890", "0912345678", "0913456789", "0938123456", "0978123456"];

/** ================== COMPONENT ================== */

export default function BaoCaoDonTra() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState("morning"); // morning | afternoon | all
  const [routeFilter, setRouteFilter] = useState("Tất cả");
  const [q, setQ] = useState("");

  const seed = useMemo(() => {
    // seed theo yyyy-mm-dd + shift
    const s = Number(date.replaceAll("-", "")) + (shift === "morning" ? 1 : shift === "afternoon" ? 2 : 3);
    return s;
  }, [date, shift]);

  const data = useMemo(() => makeDashboard(seed, shift), [seed, shift]);

  const routeOptions = useMemo(() => ["Tất cả", ...data.routeStats.map(r => r.name)], [data.routeStats]);

  const filteredNotPicked = useMemo(() => {
    return data.notPicked.filter(row => {
      const okR = routeFilter === "Tất cả" || row.route === routeFilter;
      const s = q.trim().toLowerCase();
      const okQ = !s || row.student.toLowerCase().includes(s) || row.driver.toLowerCase().includes(s);
      return okR && okQ;
    });
  }, [data.notPicked, routeFilter, q]);

  const filteredLate = useMemo(() => {
    return data.lateList.filter(row => {
      const okR = routeFilter === "Tất cả" || row.route === routeFilter;
      const s = q.trim().toLowerCase();
      const okQ = !s || row.student.toLowerCase().includes(s) || row.driver.toLowerCase().includes(s);
      return okR && okQ;
    });
  }, [data.lateList, routeFilter, q]);

  const exportCSV = () => {
    const head1 = "ID,Student,Class,Route,Stop,Driver,Phone,Reason";
    const body1 = filteredNotPicked
      .map(r => [r.id, r.student, r.classRoom, r.route, r.stop, r.driver, r.phone, r.reason].join(","))
      .join("\n");

    const head2 = "ID,Student,Route,Stop,Driver,MinutesLate";
    const body2 = filteredLate
      .map(r => [r.id, r.student, r.route, r.stop, r.driver, r.minutes].join(","))
      .join("\n");

    const csv = `Chua don/tra\n${head1}\n${body1}\n\nDi muon\n${head2}\n${body2}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bao_cao_${date}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const totalRoutesShown = routeFilter === "Tất cả" ? data.routeStats.length : 1;

  return (
    <div className="report">
      {/* Filters */}
      <div className="toolbar">
        <div className="group">
          <label>Ngày</label>
          <input type="date" value={date} onChange={e => (setQ(""), setRouteFilter("Tất cả"), setDate(e.target.value))} />
        </div>
        <div className="group">
          <label>Ca</label>
          <select value={shift} onChange={e => setShift(e.target.value)}>
            <option value="morning">Sáng</option>
            <option value="afternoon">Chiều</option>
            <option value="all">Cả ngày</option>
          </select>
        </div>
        <div className="group">
          <label>Tuyến</label>
          <select value={routeFilter} onChange={e => setRouteFilter(e.target.value)}>
            {routeOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="grow" />
        <input
          className="search"
          placeholder="Tìm theo học sinh/tài xế…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button className="btn" onClick={() => window.print()}>In báo cáo</button>
        <button className="btn primary" onClick={exportCSV}>Xuất CSV</button>
      </div>

      {/* KPI CARDS */}
      <div className="kpis">
        <KPI title="Tổng số học sinh" value={data.kpi.totalStudents} />
        <KPI title={`Đã đón (${Math.round(data.kpi.totalPicked / data.kpi.totalStudents * 100)}%)`} value={`${data.kpi.totalPicked}/${data.kpi.totalStudents}`} />
        <KPI title="Đi muộn (lượt)" value={data.kpi.totalLate} />
        <KPI title="Vắng / Hủy" value={data.kpi.totalAbsent} />
        <KPI title="Đúng giờ (TB %)" value={`${data.kpi.avgOnTime}%`} />
      </div>

      {/* ROUTE SUMMARY */}
      <div className="section">
        <div className="section-title">Tổng hợp theo tuyến ({totalRoutesShown})</div>
        <div className="routes-summary">
          {data.routeStats
            .filter(r => routeFilter === "Tất cả" || r.name === routeFilter)
            .map(r => {
              const pct = Math.round((r.picked / r.total) * 100);
              const warn = r.onTimeRate < 0.85 || r.pending > 0;
              return (
                <div key={r.id} className={`route-card ${warn ? "warn" : ""}`}>
                  <div className="route-title">{r.name}</div>
                  <div className="row">
                    <div className="progress">
                      <div className="bar" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="stat">{r.picked}/{r.total}</div>
                  </div>
                  <div className="meta">
                    <span>Đúng giờ: <b>{Math.round(r.onTimeRate * 100)}%</b></span>
                    <span>Muộn: <b>{r.late}</b></span>
                    <span>Còn chờ: <b>{r.pending}</b></span>
                    <span>Vắng: <b>{r.absent}</b></span>
                    <span>Trễ TB: <b>{r.avgDelay}’</b></span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* EXCEPTIONS */}
      <div className="section grid2">
        <div>
          <div className="section-title">Chưa đón / chưa trả</div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Học sinh</th>
                  <th>Lớp</th>
                  <th>Tuyến</th>
                  <th>Điểm đón</th>
                  <th>Tài xế</th>
                  <th>Liên hệ</th>
                  <th>Lý do</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotPicked.map(r => (
                  <tr key={r.id} className="row-warn">
                    <td>{r.id}</td>
                    <td>{r.student}</td>
                    <td>{r.classRoom}</td>
                    <td>{r.route}</td>
                    <td>{r.stop}</td>
                    <td>{r.driver}</td>
                    <td><a className="tel" href={`tel:${r.phone}`}>{r.phone}</a></td>
                    <td>{r.reason}</td>
                  </tr>
                ))}
                {filteredNotPicked.length === 0 && (
                  <tr><td colSpan={8} className="empty">Không có dữ liệu phù hợp</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="section-title">Đi muộn</div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Học sinh</th>
                  <th>Tuyến</th>
                  <th>Điểm đón</th>
                  <th>Tài xế</th>
                  <th>Phút trễ</th>
                </tr>
              </thead>
              <tbody>
                {filteredLate.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.student}</td>
                    <td>{r.route}</td>
                    <td>{r.stop}</td>
                    <td>{r.driver}</td>
                    <td><b>{r.minutes}’</b></td>
                  </tr>
                ))}
                {filteredLate.length === 0 && (
                  <tr><td colSpan={6} className="empty">Không có dữ liệu phù hợp</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DRIVER PERFORMANCE */}
      <div className="section">
        <div className="section-title">Hiệu suất tài xế</div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Tài xế</th>
                <th>Chuyến</th>
                <th>Học sinh</th>
                <th>Muộn</th>
                <th>Sự cố</th>
                <th>Đúng giờ</th>
              </tr>
            </thead>
            <tbody>
              {data.driverPerf.map(d => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td>{d.trips}</td>
                  <td>{d.students}</td>
                  <td>{d.late}</td>
                  <td>{d.incidents}</td>
                  <td>
                    <span className={`badge ${d.onTime >= 95 ? "ok" : d.onTime >= 88 ? "mid" : "low"}`}>
                      {d.onTime}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hint">* Dữ liệu hiện là mô phỏng để trình bày giao diện. Khi nối API thật, thay khối sinh dữ liệu bằng dữ liệu server.</p>
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="kpi">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
