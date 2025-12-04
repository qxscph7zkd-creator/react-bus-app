/**
 * Mock data generator.
 * In a real app, this would be replaced by API calls.
 * To keep the demo consistent, we export the same generated data to all components that need it.
 */

// --- Helpers ---
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeName() {
  const lastName = pick(LAST);
  const isMale = Math.random() < 0.5;

  if (isMale) {
    const middleName = pick(MALE_MID);
    const firstName = pick(MALE_FIRST);
    return `${lastName} ${middleName} ${firstName}`;
  } else {
    const middleName = pick(FEMALE_MID);
    const firstName = pick(FEMALE_FIRST);
    return `${lastName} ${middleName} ${firstName}`;
  }
}

// --- Source data ---
const LAST = [
  "Nguyễn", "Trần", "Lê", "Phan", "Phạm", "Võ", "Vũ", "Đỗ", "Bùi", "Dương", "Huỳnh", "Đinh", "Hoàng", "Phan", "Đặng"
];

// Tên lót và tên cho Nam
const MALE_MID = ["Văn", "Minh", "Quốc", "Hữu", "Công", "Đức", "Tấn", "Hoàng", "Gia", "Bảo"];
const MALE_FIRST = ["An", "Anh", "Bình", "Bảo", "Dũng", "Duy", "Hải", "Hiếu", "Huy", "Khang", "Khoa", "Kiên", "Long", "Minh", "Nam", "Nhật", "Phúc", "Quân", "Sơn", "Tài", "Thắng", "Thành", "Toàn", "Tuấn", "Việt"];

// Tên lót và tên cho Nữ
const FEMALE_MID = ["Thị", "Ngọc", "Mỹ", "Thùy", "Phương", "Khánh", "Gia", "Bảo", "Mai", "Thanh"];
const FEMALE_FIRST = ["An", "Anh", "Bình", "Châu", "Chi", "Dung", "Giang", "Hà", "Hân", "Hương", "Lam", "Linh", "Ly", "Mai", "My", "Nga", "Ngân", "Ngọc", "Nhi", "Như", "Phương", "Quỳnh", "Thảo", "Trang", "Vy"];


export const CLASSES = ["1A", "2B", "3C", "4C", "5A", "5B", "5C", "6A", "6B", "7A", "8A", "9C"];

export const drivers = [
  { id: 1, name: "Trần Ngọc Bảo Hân", phone: "0901 234 567", plate: "51B-123.45", route: "Tuyến 1: Quận 1 – Quận 5", shift: "Sáng (05:30–11:30)", status: "Đang hoạt động", lastCheckin: "06:05" },
  { id: 2, name: "Lê Tấn Nhật Minh", phone: "0909 876 543", plate: "51B-234.56", route: "Tuyến 2: Quận 7 – TP. Thủ Đức", shift: "Chiều (13:00–19:00)", status: "Đang trên tuyến", lastCheckin: "13:07" },
  { id: 3, name: "Nguyễn Văn An", phone: "0902 111 333", plate: "50B-010.22", route: "Tuyến 3: Quận 3 – Bình Thạnh", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "05:58" },
  { id: 4, name: "Phạm Quang Huy", phone: "0903 222 444", plate: "51B-777.88", route: "Tuyến 4: Gò Vấp – Tân Bình", shift: "Cả ngày (xoay ca)", status: "Đang trên tuyến", lastCheckin: "15:21" },
  { id: 5, name: "Hoàng Thùy Linh", phone: "0904 555 666", plate: "51B-345.67", route: "Tuyến 5: Bình Chánh – Quận 10", shift: "Chiều", status: "Nghỉ phép", lastCheckin: "—" },
  { id: 6, name: "Đỗ Minh Khoa", phone: "0905 777 999", plate: "51B-456.78", route: "Tuyến 6: Quận 9 – Quận 2 – Quận 1", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:12" },
  { id: 7, name: "Ngô Bá Khánh", phone: "0906 123 888", plate: "59B-012.34", route: "Tuyến 7: Quận 11 – Quận 6", shift: "Chiều", status: "Tạm dừng", lastCheckin: "—" },
  { id: 8, name: "Bùi Thanh Tâm", phone: "0907 444 222", plate: "51B-567.89", route: "Tuyến 8: Quận 4 – Quận 8", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:03" },
  { id: 9, name: "Võ Ngọc Trâm", phone: "0908 333 111", plate: "60B-678.90", route: "Tuyến 9: Quận 12 – Tân Bình", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "14:42" },
  { id: 10, name: "Phan Trung Hiếu", phone: "0911 222 333", plate: "51B-901.23", route: "Tuyến 10: Tân Phú – Bình Tân", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:18" },
  { id: 11, name: "Đinh Hữu Nhân", phone: "0912 888 000", plate: "51B-678.01", route: "Tuyến 1: Quận 1 – Quận 5", shift: "Cả ngày", status: "Đang trên tuyến", lastCheckin: "12:05" },
  { id: 12, name: "Huỳnh Mỹ Duyên", phone: "0913 999 111", plate: "51B-222.55", route: "Tuyến 2: Quận 7 – TP. Thủ Đức", shift: "Chiều", status: "Nghỉ phép", lastCheckin: "—" },
  { id: 13, name: "Tạ Minh Quân", phone: "0914 456 789", plate: "51B-333.44", route: "Tuyến 3: Quận 3 – Bình Thạnh", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "05:49" },
  { id: 14, name: "Vũ Đức Thịnh", phone: "0915 234 567", plate: "50B-567.77", route: "Tuyến 4: Gò Vấp – Tân Bình", shift: "Chiều", status: "Tạm dừng", lastCheckin: "—" },
  { id: 15, name: "Lý Bảo Trân", phone: "0916 678 999", plate: "51B-888.66", route: "Tuyến 5: Bình Chánh – Quận 10", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:09" },
  { id: 16, name: "Trương Quốc Tuấn", phone: "0917 700 800", plate: "51B-909.10", route: "Tuyến 6: Quận 9 – Quận 2 – Quận 1", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "15:02" },
  { id: 17, name: "Nguyễn Thị Mai", phone: "0918 345 456", plate: "59B-345.12", route: "Tuyến 7: Quận 11 – Quận 6", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:21" },
  { id: 18, name: "Phạm Anh Dũng", phone: "0919 111 222", plate: "51B-112.23", route: "Tuyến 8: Quận 4 – Quận 8", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "13:58" },
  { id: 19, name: "Hồ Bảo Long", phone: "0920 999 777", plate: "51B-777.22", route: "Tuyến 9: Quận 12 – Tân Bình", shift: "Sáng", status: "Đang hoạt động", lastCheckin: "06:00" },
  { id: 20, name: "Châu Khánh Vy", phone: "0921 222 999", plate: "51B-221.19", route: "Tuyến 10: Tân Phú – Bình Tân", shift: "Chiều", status: "Đang trên tuyến", lastCheckin: "14:11" },
];

export const routeNames = [
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

// --- Generated Data ---
export const students = Array.from({ length: 120 }, (_, i) => ({
  id: `HS${String(i + 1).padStart(3, "0")}`,
  name: makeName(),
  class: CLASSES[i % CLASSES.length],
  route: routeNames[i % routeNames.length],
}));

