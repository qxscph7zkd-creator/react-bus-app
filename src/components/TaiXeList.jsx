import { useMemo, useState } from "react";
import "./TaiXeList.css";
import { drivers as DRIVERS } from "../data/seed";

const STATUS = ["Tất cả", "Đang hoạt động", "Đang trên tuyến", "Nghỉ phép", "Tạm dừng"];

export default function TaiXeList() {
  const [q, setQ] = useState("");
  const [st, setSt] = useState("Tất cả");

  const data = useMemo(() => {
    return DRIVERS.filter(d => {
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
      const matchSt = st === "Tất cả" || d.status === st;
      return matchQ && matchSt;
    });
  }, [q, st]);

  return (
    <div className="drivers">
      <div className="drivers__head">
        <h2>Danh sách tài xế</h2>

        <div className="drivers__tools">
          <select value={st} onChange={e => setSt(e.target.value)} aria-label="Lọc trạng thái">
            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <input
            className="search"
            placeholder="Tìm theo tên hoặc số điện thoại…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Biển số</th>
              <th>Tuyến</th>
              <th>Ca làm việc</th>
              <th>Trạng thái</th>
              <th>Check-in</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td><a href={`tel:${d.phone.replace(/\s/g, "")}`} className="tel">{d.phone}</a></td>
                <td>{d.plate}</td>
                <td>{d.route}</td>
                <td>{d.shift}</td>
                <td>
                  <span className={`badge ${cls(d.status)}`}>{d.status}</span>
                </td>
                <td>{d.lastCheckin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="hint">
        Dữ liệu trên là mẫu để demo giao diện. Kết nối API thực tế: thay mảng <code>DRIVERS</code> bằng dữ liệu từ server (fetch/axios) hoặc React Query.
      </p>
    </div>
  );
}

function cls(status) {
  switch (status) {
    case "Đang hoạt động": return "is-active";
    case "Đang trên tuyến": return "is-onroute";
    case "Nghỉ phép": return "is-leave";
    case "Tạm dừng": return "is-paused";
    default: return "";
  }
}
