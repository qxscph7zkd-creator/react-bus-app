import { useMemo, useState } from "react";
import "./BaoCaoDonTra.css";
import { students, drivers, routeNames, CLASSES } from "../data/seed";

/** ================== MOCK DATA GENERATOR ================== */
const STOPS = ["Cổng trường", "Cổng sau", "Nhà thiếu nhi", "Chung cư A", "Chung cư B", "UBND phường"];
const SAMPLE_PHONES = ["0901234567", "0902345678", "0903456789", "0904567890", "0912345678"];

function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function makeDashboard(dateSeed) {
  // Step 0: Filter active drivers and then assign them to routes
  const activeDrivers = drivers.filter(d => d.status !== "Tạm dừng" && d.status !== "Nghỉ phép");
  const routeDriverMap = routeNames.reduce((map, routeName, idx) => {
    // Now that drivers is an array of objects, we need to get the name
    map[routeName] = activeDrivers[idx % activeDrivers.length].name;
    return map;
  }, {});

  // Step 1: Initialize routeStats with REAL student counts
  const studentCountsByRoute = students.reduce((counts, student) => {
    counts[student.route] = (counts[student.route] || 0) + 1;
    return counts;
  }, {});

  let routeStats = routeNames.map((name, idx) => ({
    id: idx + 1,
    name,
    total: studentCountsByRoute[name] || 0, // Use the real count
    picked: 0, late: 0, absent: 0,
    pending: 0, onTimeRate: 0, avgDelay: 0, totalMinutes: 0,
  }));

  // Step 2: Generate detailed incident lists
  const notPicked = [];
  const lateList = [];

  // Generate "Đi muộn" list
  for (let i = 0; i < 16; i++) {
    const student = students[Math.floor(seededRand(dateSeed + 60 + i) * students.length)];
    const r = routeStats.find(rs => rs.name === student.route);
    if (!r) continue;

    lateList.push({
      id: `LT${String(i + 1).padStart(3, "0")}`,
      student: student.name,
      route: student.route,
      stop: STOPS[(i + 1) % STOPS.length],
      driver: routeDriverMap[student.route],
      minutes: 2 + Math.floor(seededRand(i + dateSeed) * 11), // 2-12 mins
    });
  }

  // Generate "Chưa đón / chưa trả" list with all 4 reasons
  const NOT_PICKED_REASONS = ["Vắng mặt", "Chờ phụ huynh", "Không liên lạc được", "Thay đổi đột xuất"];
  for (let i = 0; i < 14; i++) {
    const student = students[Math.floor(seededRand(dateSeed + 30 + i) * students.length)];
    const r = routeStats.find(rs => rs.name === student.route);
    if (!r) continue;

    notPicked.push({
      id: `NP${String(i + 1).padStart(3, "0")}`,
      student: student.name,
      classRoom: student.class,
      route: student.route,
      stop: STOPS[i % STOPS.length],
      driver: routeDriverMap[student.route],
      phone: SAMPLE_PHONES[i % SAMPLE_PHONES.length],
      reason: NOT_PICKED_REASONS[i % NOT_PICKED_REASONS.length],
    });
  }

  // Step 3: Tally up stats
  lateList.forEach(item => {
    const route = routeStats.find(r => r.name === item.route);
    if (route) {
      route.late++;
      route.totalMinutes += item.minutes;
    }
  });

  notPicked.forEach(item => {
    const route = routeStats.find(r => r.name === item.route);
    if (route) {
      if (item.reason === "Chờ phụ huynh") {
        route.pending++;
      } else {
        route.absent++;
      }
    }
  });

  // Step 4: Finalize route stats
  routeStats = routeStats.map(r => {
    const picked = Math.max(0, r.total - r.absent - r.pending);
    const onTimeRate = picked > 0 ? Math.max(0, (picked - r.late) / picked) : 1;
    const avgDelay = r.late > 0 ? r.totalMinutes / r.late : 0;
    const finalRoute = { ...r, picked, onTimeRate, avgDelay };
    delete finalRoute.totalMinutes;
    return finalRoute;
  });

  // Step 5: Calculate overall KPIs
  const totalStudents = routeStats.reduce((s, r) => s + r.total, 0);
  const totalPicked = routeStats.reduce((s, r) => s + r.picked, 0);
  const totalLate = routeStats.reduce((s, r) => s + r.late, 0);
  const totalAbsent = routeStats.reduce((s, r) => s + r.absent, 0);
  const totalPending = routeStats.reduce((s, r) => s + r.pending, 0);
  const weightedOnTimeSum = routeStats.reduce((s, r) => s + r.onTimeRate * r.picked, 0);
  const avgOnTime = totalPicked > 0 ? (weightedOnTimeSum / totalPicked) * 100 : 100;

  // Step 6: Generate ACCURATE driver performance
  const driverData = activeDrivers.reduce((acc, driver) => {
    acc[driver.name] = { name: driver.name, routes: new Set(), students: 0, late: 0, incidents: 0 };
    return acc;
  }, {});

  routeStats.forEach(r => {
    const driverName = routeDriverMap[r.name];
    if (driverData[driverName]) {
      driverData[driverName].routes.add(r.name);
      driverData[driverName].students += r.picked;
    }
  });

  lateList.forEach(item => {
    if (driverData[item.driver]) driverData[item.driver].late++;
  });

  notPicked.forEach(item => {
    // "Sự cố" (incident) is now more specific - e.g., only when driver cannot contact parent
    if (driverData[item.driver] && item.reason === "Không liên lạc được") {
      driverData[item.driver].incidents++;
    }
  });

  const driverPerf = Object.values(driverData)
    .map(perf => ({
      ...perf,
      routes: Array.from(perf.routes), // Keep as array of strings
      trips: perf.routes.size,
      onTime: perf.students > 0 ? ((perf.students - perf.late) / perf.students) * 100 : 100,
    }))
    .filter(p => p.trips > 0);

  // Step 7: Return all data
  return {
    routeStats, notPicked, lateList, driverPerf,
    kpi: { totalStudents, totalPicked, totalLate, totalAbsent, totalPending, avgOnTime },
  };
}

/** ================== COMPONENT ================== */

export default function BaoCaoDonTra() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(() => today);
  const [shift, setShift] = useState("morning");
  const [routeFilter, setRouteFilter] = useState("Tất cả");
  const [q, setQ] = useState("");

  const seed = useMemo(() => {
    // Re-seed based on date and shift to ensure data changes on selection
    const s = Number(date.replaceAll("-", "")) + (shift === "morning" ? 1 : shift === "afternoon" ? 2 : 3);
    return s;
  }, [date, shift]);

  const data = useMemo(() => makeDashboard(seed), [seed]);
  
  // Prevent rendering data for future dates
  const isFuture = date > today;

  const routeOptions = useMemo(() => ["Tất cả", ...data.routeStats.map(r => r.name)], [data.routeStats]);

  const filteredNotPicked = useMemo(() => {
    if (!data.notPicked) return [];
    return data.notPicked.filter(row => {
      const okR = routeFilter === "Tất cả" || row.route === routeFilter;
      const s = q.trim().toLowerCase();
      const okQ = !s || row.student.toLowerCase().includes(s) || row.driver.toLowerCase().includes(s);
      return okR && okQ;
    });
  }, [data.notPicked, routeFilter, q]);

  const filteredLate = useMemo(() => {
    if (!data.lateList) return [];
    return data.lateList.filter(row => {
      const okR = routeFilter === "Tất cả" || row.route === routeFilter;
      const s = q.trim().toLowerCase();
      const okQ = !s || row.student.toLowerCase().includes(s) || row.driver.toLowerCase().includes(s);
      return okR && okQ;
    });
  }, [data.lateList, routeFilter, q]);

  const exportCSV = () => {
    const universalBOM = "\uFEFF";
    const head1 = "ID,Student,Class,Route,Stop,Driver,Phone,Reason";
    const body1 = filteredNotPicked.map(r => [r.id, r.student, r.classRoom, r.route, r.stop, r.driver, r.phone, r.reason].join(",")).join("\n");
    
    const head2 = "ID,Student,Route,Stop,Driver,MinutesLate";
    const body2 = filteredLate.map(r => [r.id, r.student, r.route, r.stop, r.driver, r.minutes].join(",")).join("\n");

    const title1 = "Báo cáo học sinh chưa đón / chưa trả";
    const title2 = "Báo cáo học sinh đi muộn";

    const csv = `${title1}\n${head1}\n${body1}\n\n${title2}\n${head2}\n${body2}`;
    
    const blob = new Blob([universalBOM + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao_cao_don_tra_${date}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const totalRoutesShown = routeFilter === "Tất cả" ? data.routeStats.length : 1;

  return (
    <div className="report" data-date={date}>
      {/* Filters */}
      <div className="toolbar">
        <div className="group">
          <label>Ngày</label>
          <input type="date" value={date} max={today} onChange={e => (setQ(""), setRouteFilter("Tất cả"), setDate(e.target.value))} />
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
        <input className="search" placeholder="Tìm theo học sinh/tài xế…" value={q} onChange={e => setQ(e.target.value)} />
        <button className="btn" onClick={() => window.print()}>In báo cáo</button>
        <button className="btn primary" onClick={exportCSV}>Xuất CSV</button>
      </div>
      
      {isFuture ? (
        <div className="section empty">Không có dữ liệu cho ngày tương lai. Vui lòng chọn ngày hiện tại hoặc quá khứ.</div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="kpis">
            <KPI title="Tổng số học sinh" value={data.kpi.totalStudents} />
            <KPI title={`Đã đón (${(data.kpi.totalPicked / data.kpi.totalStudents * 100).toFixed(0)}%)`} value={`${data.kpi.totalPicked}/${data.kpi.totalStudents}`} />
            <KPI title="Đi muộn (lượt)" value={data.kpi.totalLate} />
            <KPI title="Vắng / Hủy" value={data.kpi.totalAbsent} />
            <KPI title="Còn chờ" value={data.kpi.totalPending} />
            <KPI title="Đúng giờ (TB %)" value={`${data.kpi.avgOnTime.toFixed(1)}%`} />
          </div>

          {/* ROUTE SUMMARY */}
          <div className="section">
            <div className="section-title">Tổng hợp theo tuyến ({totalRoutesShown})</div>
            <div className="routes-summary">
              {data.routeStats
                .filter(r => routeFilter === "Tất cả" || r.name === routeFilter)
                .map(r => {
                  const pct = r.total > 0 ? (r.picked / r.total) * 100 : 0;
                  // The orange warning color indicates a low on-time rate or if students are waiting
                  const warn = r.onTimeRate < 0.85 || r.pending > 0;
                  return (
                    <div key={r.id} className={`route-card ${warn ? "warn" : ""}`}>
                      <div className="route-title">{r.name}</div>
                      <div className="row">
                        <div className="progress"><div className="bar" style={{ width: `${pct}%` }} /></div>
                        <div className="stat">{r.picked}/{r.total}</div>
                      </div>
                      <div className="meta">
                        <span>Đúng giờ: <b>{(r.onTimeRate * 100).toFixed(1)}%</b></span>
                        <span>Muộn: <b>{r.late}</b></span>
                        <span>Còn chờ: <b>{r.pending}</b></span>
                        <span>Vắng/Hủy: <b>{r.absent}</b></span>
                        <span>Trễ TB: <b>{r.avgDelay.toFixed(1)}’</b></span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* EXCEPTIONS */}
          <div className="section grid2">
            <div>
              <div className="section-title">Chưa đón / chưa trả ({filteredNotPicked.length})</div>
              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Mã</th><th>Học sinh</th><th>Lớp</th><th>Tuyến</th>
                      <th>Điểm đón</th><th>Tài xế</th><th>Liên hệ</th><th>Lý do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotPicked.map(r => (
                      <tr key={r.id} className="row-warn">
                        <td>{r.id}</td><td>{r.student}</td><td>{r.classRoom}</td>
                        <td>{r.route}</td><td>{r.stop}</td><td>{r.driver}</td>
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
              <div className="section-title">Đi muộn ({filteredLate.length})</div>
              <div className="table-wrap">
                <table className="tbl">
                  <thead><tr><th>Mã</th><th>Học sinh</th><th>Tuyến</th><th>Điểm đón</th><th>Tài xế</th><th>Phút trễ</th></tr></thead>
                  <tbody>
                    {filteredLate.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td><td>{r.student}</td><td>{r.route}</td>
                        <td>{r.stop}</td><td>{r.driver}</td><td><b>{r.minutes}’</b></td>
                      </tr>
                    ))}
                    {filteredLate.length === 0 && <tr><td colSpan={6} className="empty">Không có dữ liệu phù hợp</td></tr>}
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
                    <th>Tài xế</th><th>Số tuyến</th><th>Các tuyến</th><th>Học sinh</th>
                    <th>Muộn</th><th>Sự cố</th><th>Đúng giờ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.driverPerf.map(d => (
                    <tr key={d.name}>
                      <td>{d.name}</td><td>{d.trips}</td>
                      <td>{d.routes.map(r => r.split(':')[0]).join(', ')}</td>
                      <td>{d.students}</td><td>{d.late}</td><td>{d.incidents}</td>
                      <td>
                        <span className={`badge ${d.onTime >= 95 ? "ok" : d.onTime >= 88 ? "mid" : "low"}`}>
                          {d.onTime.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hint">* Dữ liệu được mô phỏng để trình bày giao diện. Khi nối API, các tính toán này sẽ được thực hiện ở backend.</p>
          </div>
        </>
      )}
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
