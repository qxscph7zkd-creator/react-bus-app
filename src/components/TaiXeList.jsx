import { useMemo, useState } from "react";
import "./TaiXeList.css";

const STATUS = ["Tất cả", "Đang hoạt động", "Đang trên tuyến", "Nghỉ phép", "Tạm dừng"];

// Dữ liệu mẫu (tên Việt Nam, có dấu)
const DRIVERS = [
  { id: 1, name: "Trần Ngọc Bảo Hân", phone: "0901 234 567", plate: "51B-123.45", route: "Tuyến 01 • Thủ Đức ↔ Q1", shift: "Sáng (05:30–11:30)", status: "Đang hoạt động", lastCheckin: "06:05" },
  { id: 2, name: "Lê Tấn Nhật Minh", phone: "0909 876 543", plate: "51B-234.56", route: "Tuyến 09 • Linh Trung ↔ Bến Thành", shift: "Chiều (13:00–19:00)", status: "Đang trên tuyến", lastCheckin: "13:07" },
  { id: 3, name: "Nguyễn Văn An", phone: "0902 111 333", plate: "50B-010.22", route: "Tuyến 06 • Bến xe Củ Chi ↔ An Sương", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "05:58" },
  { id: 4, name: "Phạm Quang Huy", phone: "0903 222 444", plate: "51B-777.88", route: "Tuyến 33 • An Sương ↔ Suối Tiên", shift: "Cả ngày (xoay ca)", status: "Đang trên tuyến", lastCheckin: "15:21" },
  { id: 5, name: "Hoàng Thùy Linh", phone: "0904 555 666", plate: "51B-345.67", route: "Tuyến 65 • Bến Thành ↔ Bến xe An Sương", shift: "Chiều", status: "Nghỉ phép", lastCheckin: "—" },
  { id: 6, name: "Đỗ Minh Khoa", phone: "0905 777 999", plate: "51B-456.78", route: "Tuyến 08 • Bến xe Q8 ↔ Bến xe Q12", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:12" },
  { id: 7, name: "Ngô Bá Khánh", phone: "0906 123 888", plate: "59B-012.34", route: "Tuyến 27 • Bến xe Buýt Sài Gòn ↔ Củ Chi", shift: "Chiều", status: "Tạm dừng", lastCheckin: "—" },
  { id: 8, name: "Bùi Thanh Tâm", phone: "0907 444 222", plate: "51B-567.89", route: "Tuyến 150 • Bến xe Miền Đông mới ↔ KDL Đại Nam", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:03" },
  { id: 9, name: "Võ Ngọc Trâm", phone: "0908 333 111", plate: "60B-678.90", route: "Tuyến 19 • Bến Thành ↔ KĐT Hiệp Phú", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "14:42" },
  { id: 10, name: "Phan Trung Hiếu", phone: "0911 222 333", plate: "51B-901.23", route: "Tuyến 52 • Q8 ↔ ĐH Quốc Gia", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:18" },
  { id: 11, name: "Đinh Hữu Nhân", phone: "0912 888 000", plate: "51B-678.01", route: "Tuyến 04 • Bến Thành ↔ Bến xe Miền Đông", shift: "Cả ngày", status: "Đang trên tuyến", lastCheckin: "12:05" },
  { id: 12, name: "Huỳnh Mỹ Duyên", phone: "0913 999 111", plate: "51B-222.55", route: "Tuyến 45 • Bến xe Miền Đông ↔ Làng ĐH", shift: "Chiều", status: "Nghỉ phép", lastCheckin: "—" },
  { id: 13, name: "Tạ Minh Quân", phone: "0914 456 789", plate: "51B-333.44", route: "Tuyến 103 • Bến xe Củ Chi ↔ Bến xe Chợ Lớn", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "05:49" },
  { id: 14, name: "Vũ Đức Thịnh", phone: "0915 234 567", plate: "50B-567.77", route: "Tuyến 60-3 • Bến xe An Sương ↔ KCN Nhị Xuân", shift: "Chiều", status: "Tạm dừng", lastCheckin: "—" },
  { id: 15, name: "Lý Bảo Trân", phone: "0916 678 999", plate: "51B-888.66", route: "Tuyến 72 • BV Nhi Đồng TP ↔ KDL Đầm Sen", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:09" },
  { id: 16, name: "Trương Quốc Tuấn", phone: "0917 700 800", plate: "51B-909.10", route: "Tuyến 93 • Chợ Bình Điền ↔ Thảo Điền", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "15:02" },
  { id: 17, name: "Nguyễn Thị Mai", phone: "0918 345 456", plate: "59B-345.12", route: "Tuyến 88 • Bến xe An Sương ↔ Đầm Sen", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:21" },
  { id: 18, name: "Phạm Anh Dũng", phone: "0919 111 222", plate: "51B-112.23", route: "Tuyến 20 • Bến Thành ↔ Nhà Bè", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "13:58" },
  { id: 19, name: "Hồ Bảo Long", phone: "0920 999 777", plate: "51B-777.22", route: "Tuyến 141 • BX Miền Đông mới ↔ Trạm metro Thủ Đức", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:00" },
  { id: 20, name: "Châu Khánh Vy", phone: "0921 222 999", plate: "51B-221.19", route: "Tuyến 31 • Bến xe Chợ Lớn ↔ Suối Tiên", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "14:11" },
];

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
