import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🧭 Fix lỗi icon mặc định Leaflet không hiển thị trong React build
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// 📍 Dữ liệu tuyến đường mẫu
const tuyenList = [
  {
    id: 1,
    ten: "Tuyến 1: Quận 1 - Quận 5",
    toaDo: [
      [10.7769, 106.7009],
      [10.7547, 106.6663],
    ],
    color: "blue",
  },
  {
    id: 2,
    ten: "Tuyến 2: Quận 7 - Thủ Đức",
    toaDo: [
      [10.738, 106.7216],
      [10.8493, 106.7539],
    ],
    color: "green",
  },
  {
    id: 3,
    ten: "Tuyến 3: Quận 3 - Bình Thạnh",
    toaDo: [
      [10.784, 106.694],
      [10.804, 106.712],
    ],
    color: "red",
  },
  {
    id: 4,
    ten: "Tuyến 4: Gò Vấp - Tân Bình",
    toaDo: [
      [10.838, 106.671],
      [10.801, 106.655],
    ],
    color: "orange",
  },
  {
    id: 5,
    ten: "Tuyến 5: Bình Chánh - Quận 10",
    toaDo: [
      [10.746, 106.594],
      [10.772, 106.667],
    ],
    color: "purple",
  },
  {
    id: 6,
    ten: "Tuyến 6: Quận 9 - Quận 2 - Quận 1",
    toaDo: [
      [10.841, 106.826],
      [10.787, 106.749],
      [10.7769, 106.7009],
    ],
    color: "brown",
  },
];

// 🗺️ Component phụ: tự zoom map đến tuyến hoặc toàn bộ tuyến
const FitBoundsToRoute = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

const TuyenDuongList = () => {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Nếu hiển thị tất cả tuyến → gom toàn bộ toạ độ lại
  const allPositions = tuyenList.flatMap((t) => t.toaDo);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-blue-700">Tuyến đường</h2>

      {/* Nút hiển thị tất cả tuyến */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-600">
          {showAll
            ? "Đang hiển thị tất cả tuyến"
            : selected
              ? `Đang xem: ${selected.ten}`
              : "Chọn tuyến để xem chi tiết"}
        </p>
        <button
          onClick={() => {
            setShowAll(true);
            setSelected(null);
          }}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Hiển thị tất cả tuyến
        </button>
      </div>

      {/* Danh sách tuyến */}
      <ul className="space-y-2 mb-4">
        {tuyenList.map((t) => (
          <li
            key={t.id}
            onClick={() => {
              setSelected(t);
              setShowAll(false);
            }}
            className={`p-2 rounded cursor-pointer transition ${selected?.id === t.id
              ? "bg-blue-600 text-white"
              : "bg-blue-50 hover:bg-blue-100"
              }`}
          >
            {t.ten}
          </li>
        ))}
      </ul>

      {/* Bản đồ */}
      <div className="h-96 rounded-xl overflow-hidden shadow-inner">
        <MapContainer
          center={[10.78, 106.7]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {/* Zoom đến tuyến được chọn hoặc toàn bộ */}
          <FitBoundsToRoute
            positions={showAll ? allPositions : selected?.toaDo || []}
          />

          {/* Nếu hiển thị tất cả → vẽ hết */}
          {showAll &&
            tuyenList.map((t) => (
              <Polyline
                key={t.id}
                positions={t.toaDo}
                color={t.color}
                weight={3}
                opacity={0.7}
              />
            ))}

          {/* Nếu chọn tuyến → chỉ vẽ tuyến đó */}
          {!showAll && selected && (
            <>
              <Polyline
                positions={selected.toaDo}
                color={selected.color}
                weight={5}
                opacity={0.9}
              />
              {selected.toaDo.map((pos, i) => (
                <Marker key={i} position={pos}>
                  <Popup>
                    {i === 0
                      ? "🚍 Điểm đón đầu tuyến"
                      : i === selected.toaDo.length - 1
                        ? "🏁 Điểm trả cuối tuyến"
                        : "🛣️ Điểm trung gian"}
                    <br />
                    {selected.ten}
                  </Popup>
                </Marker>
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default TuyenDuongList;
