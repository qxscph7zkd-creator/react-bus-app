import { useMemo, useState } from "react";
import "./HocSinhList.css";

/** ------------------ Mock data demo ------------------
 * Thay bằng dữ liệu thật hoặc import từ src/data/seed.js:
 *   import { students as RAW } from "../data/seed";
 */
const LAST = [
  "Nguyễn", "Trần", "Lê", "Phan", "Phạm", "Võ", "Vũ", "Đỗ", "Bùi", "Dương", "Huỳnh", "Đinh"
];
const MID = [
  "Minh", "Gia", "Hoàng", "Ngọc", "Khánh", "Thanh", "Hải", "Anh", "Tuấn", "Thịnh", "Bảo", "Mai", "Lan", "Huyền"
];
const FIRST = [
  "An", "Bảo", "Khánh", "Hân", "Huy", "Khang", "Trúc", "Tiên", "Tâm", "Tú", "Quân", "Quỳnh", "Tài", "Phong", "Hậu", "Duy", "Hảo", "Vy"
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function makeName() {
  // 50% nam/50% nữ, pha trộn tên lót
  return `${pick(LAST)} ${Math.random() < .5 ? "Văn" : "Thị"} ${pick(MID)} ${pick(FIRST)}`.replace(/\s+/g, " ").trim();
}
const CLASSES = ["1A", "2B", "3C", "4C", "5A", "5B", "5C", "6A", "6B", "7A", "8A", "9C"];
const ROUTES = ["Tuyến 1", "Tuyến 2", "Tuyến 3", "Tuyến 4", "Tuyến 5"];

const RAW = Array.from({ length: 120 }, (_, i) => ({
  id: `HS${String(i + 1).padStart(3, "0")}`,
  name: makeName(),
  class: CLASSES[i % CLASSES.length],
  route: ROUTES[i % ROUTES.length],
}));

/** --------------------------------------------------- */

export default function HocSinhList() {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const [rt, setRt] = useState("all");
  const [sortKey, setSortKey] = useState("id"); // id | name | class | route
  const [sortDir, setSortDir] = useState("asc"); // asc | desc
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Lấy danh sách lớp & tuyến tự động từ data
  const CLASS_OPTIONS = useMemo(() => Array.from(new Set(RAW.map(x => x.class))).sort(), []);
  const ROUTE_OPTIONS = useMemo(() => Array.from(new Set(RAW.map(x => x.route))).sort(), []);

  // Lọc + tìm kiếm + sắp xếp
  const filtered = useMemo(() => {
    let rows = RAW;

    if (q.trim()) {
      const k = q.toLowerCase();
      rows = rows.filter(r =>
        r.id.toLowerCase().includes(k) ||
        r.name.toLowerCase().includes(k) ||
        r.class.toLowerCase().includes(k) ||
        r.route.toLowerCase().includes(k)
      );
    }
    if (cls !== "all") rows = rows.filter(r => r.class === cls);
    if (rt !== "all") rows = rows.filter(r => r.route === rt);

    rows = [...rows].sort((a, b) => {
      const A = String(a[sortKey]).toLowerCase();
      const B = String(b[sortKey]).toLowerCase();
      if (A === B) return 0;
      const s = A > B ? 1 : -1;
      return sortDir === "asc" ? s : -s;
    });

    return rows;
  }, [q, cls, rt, sortKey, sortDir]);

  // Trang
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  function toggleSort(k) {
    if (k === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  }

  function exportCSV() {
    const headers = ["Mã HS", "Tên học sinh", "Lớp", "Tuyến"];
    const rows = filtered.map(r => [r.id, r.name, r.class, r.route]);
    const csv = [headers, ...rows].map(r => r.map(cell =>
      /[,"\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell
    ).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `students_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="students">
      <header className="students__tools">
        <div className="tools-left">
          <h2>Danh sách học sinh</h2>
          <div className="meta">
            Hiển thị <b>{Math.min(total, start + 1)}–{Math.min(total, start + paged.length)}</b> / <b>{total}</b>
          </div>
        </div>

        <div className="tools-right">
          <select value={cls} onChange={e => { setCls(e.target.value); setPage(1); }}>
            <option value="all">Tất cả lớp</option>
            {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={rt} onChange={e => { setRt(e.target.value); setPage(1); }}>
            <option value="all">Tất cả tuyến</option>
            {ROUTE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <input
            className="search"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Tìm theo mã HS, tên…"
            aria-label="Tìm học sinh"
          />

          <button className="ghost" onClick={exportCSV}>Xuất CSV</button>
        </div>
      </header>

      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <Th label="Mã HS" k="id" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
              <Th label="Tên học sinh" k="name" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
              <Th label="Lớp" k="class" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
              <Th label="Tuyến" k="route" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
            </tr>
          </thead>
          <tbody>
            {paged.map(s => (
              <tr key={s.id}>
                <td className="mono">{s.id}</td>
                <td>
                  <div className="cell-name">
                    <Avatar text={s.name} />
                    <div className="nm">{s.name}</div>
                  </div>
                </td>
                <td><span className="chip">{s.class}</span></td>
                <td><span className="chip route">{s.route}</span></td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={4} className="empty">Không có dữ liệu khớp bộ lọc.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="pager">
        <button disabled={currentPage <= 1} onClick={() => setPage(p => p - 1)}>« Trước</button>
        {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              className={n === currentPage ? "active" : ""}
              onClick={() => setPage(n)}
            >{n}</button>
          );
        })}
        {totalPages > 7 && <span className="ellipsis">…</span>}
        <button disabled={currentPage >= totalPages} onClick={() => setPage(p => p + 1)}>Sau »</button>
      </footer>

      <p className="disclaimer">
        Dữ liệu hiện là mẫu để demo. Khi nối API thật, thay mảng <code>RAW</code> bằng dữ liệu trả về từ server.
      </p>
    </section>
  );
}

function Th({ label, k, sortKey, sortDir, onClick }) {
  const active = sortKey === k;
  return (
    <th
      role="button"
      tabIndex={0}
      onClick={() => onClick(k)}
      onKeyDown={(e) => e.key === "Enter" && onClick(k)}
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
    >
      {label}
      <span className={`sort ${active ? sortDir : ""}`} aria-hidden="true">▲</span>
    </th>
  );
}

function Avatar({ text }) {
  const ini = useMemo(() => {
    const parts = text.split(" ").filter(Boolean);
    const last2 = parts.slice(-2).map(s => s[0]).join("").toUpperCase();
    return last2 || "HS";
  }, [text]);
  return <div className="avt">{ini}</div>;
}
