import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
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

/**
 * 🚌 Tạo icon SVG tùy chỉnh cho bản đồ.
 * Dùng L.divIcon để render SVG, giúp tùy biến màu sắc và kích thước dễ dàng.
 */
const createDivIcon = (svg) => {
  return L.divIcon({
    html: svg,
    className: "bg-transparent border-none", // Bỏ background và border mặc định của divIcon
    iconSize: [30, 30],
    iconAnchor: [15, 30], // Chân icon ở giữa đáy
    popupAnchor: [0, -30],
  });
};

// Icon xe buýt (điểm bắt đầu)
// Tôi sẽ sử dụng icon bus từ Lucide và đặt màu xanh dương
const flagIconSVG = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
  <defs>
    <filter id="oceanShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <path
    fill="#81ECEC" 
    stroke="#008B8B" 
    stroke-width="0.6" 
    filter="url(#oceanShadow)"
    fill-rule="evenodd"
    d="M3.5 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0v-4.392l1.657-.348a6.449 6.449 0 0 1 4.271.572 7.948 7.948 0 0 0 5.965.524l2.078-.64A.75.75 0 0 0 18 12.25v-8.5a.75.75 0 0 0-.904-.734l-2.38.501a7.25 7.25 0 0 1-4.186-.363l-.502-.2a8.75 8.75 0 0 0-5.053-.439l-1.475.31V2.75Z"
    clip-rule="evenodd" />
</svg>
);
const flagIcon = createDivIcon(flagIconSVG);

// Icon đích đến (cờ)
// Tôi sẽ sử dụng icon map-pin từ path.txt và đặt màu đỏ
const mappinIconSVG = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
  <defs>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <path
    fill="#FF6961"
    stroke="#922B21"
    stroke-width="0.5"
    filter="url(#softShadow)"
    fill-rule="evenodd"
    d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
    clip-rule="evenodd" />
</svg>
);
const mappinIcon = createDivIcon(mappinIconSVG);

const tuyenList = [
  {
    id: 1,
    ten: "Tuyến 1: Quận 1 – Quận 5",
    toaDo: [
      [10.7769, 106.7009],
      [10.7547, 106.6663],
    ],
    color: "#3b82f6", // blue
  },
  {
    id: 2,
    ten: "Tuyến 2: Quận 7 – TP. Thủ Đức",
    toaDo: [
      [10.738, 106.7216],
      [10.8493, 106.7539],
    ],
    color: "#22c55e", // green
  },
  {
    id: 3,
    ten: "Tuyến 3: Quận 3 – Bình Thạnh",
    toaDo: [
      [10.784, 106.694],
      [10.804, 106.712],
    ],
    color: "#ef4444", // red
  },
  {
    id: 4,
    ten: "Tuyến 4: Gò Vấp – Tân Bình",
    toaDo: [
      [10.838, 106.671],
      [10.801, 106.655],
    ],
    color: "#f97316", // orange
  },
  {
    id: 5,
    ten: "Tuyến 5: Bình Chánh – Quận 10",
    toaDo: [
      [10.746, 106.594],
      [10.772, 106.667],
    ],
    color: "#8b5cf6", // purple
  },
  {
    id: 6,
    ten: "Tuyến 6: Quận 9 – Quận 2 – Quận 1",
    toaDo: [
      [10.841, 106.826],
      [10.787, 106.749],
      [10.7769, 106.7009],
    ],
    color: "#78350f", // brown
  },
  {
    id: 7,
    ten: "Tuyến 7: Quận 11 – Quận 6",
    toaDo: [
      [10.765, 106.641],
      [10.748, 106.632],
    ],
    color: "#ec4899", // pink
  },
  {
    id: 8,
    ten: "Tuyến 8: Quận 4 – Quận 8",
    toaDo: [
      [10.755, 106.703],
      [10.733, 106.658],
    ],
    color: "#14b8a6", // teal
  },
  {
    id: 9,
    ten: "Tuyến 9: Quận 12 – Tân Bình",
    toaDo: [
      [10.868, 106.625],
      [10.801, 106.655],
    ],
    color: "#64748b", // slate
  },
  {
    id: 10,
    ten: "Tuyến 10: Tân Phú – Bình Tân",
    toaDo: [
      [10.789, 106.613],
      [10.75, 106.602],
    ],
    color: "#facc15", // yellow
  },
];

// 🗺️ Component phụ: tự zoom map đến tuyến hoặc toàn bộ tuyến
const FitBoundsToRoute = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

// 🚗 Component mới: Tự động tìm và vẽ đường đi thực tế
const RoutedPolyline = ({ positions, color, weight, opacity }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!positions || positions.length < 2) {
      setRoute([]);
      return;
    }

    // Chuyển đổi tọa độ [lat, lng] của Leaflet thành chuỗi "lng,lat;lng,lat;..." cho OSRM
    const waypoints = positions.map(p => `${p[1]},${p[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          // OSRM trả về tọa độ dạng [lng, lat], cần đổi lại thành [lat, lng] cho Leaflet
          const coordinates = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRoute(coordinates);
        }
      })
      .catch(error => {
        console.error("Lỗi khi tìm đường đi:", error);
        // Nếu lỗi, tạm thời vẫn vẽ đường thẳng
        setRoute(positions);
      });

  }, [positions]);

  if (route.length === 0) {
    return null; // Không vẽ gì nếu chưa có đường đi
  }

  return (
    <Polyline positions={route} color={color} weight={weight} opacity={opacity} />
  );
};

// ️ Component con: Panel điều khiển
const RouteControls = ({
  showAll,
  selected,
  isDropdownOpen,
  hoveredId,
  setShowAll,
  setSelected,
  setIsDropdownOpen,
  setHoveredId,
  tuyenList,
}) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] w-full max-w-xs bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-blue-700">Tuyến đường</h2>
        <p className="text-sm text-gray-600 mt-1">
          {showAll
            ? "Đang hiển thị tất cả các tuyến."
            : selected
              ? `Đang xem chi tiết: ${selected.ten}`
              : "Hãy chọn một tuyến để xem."}
        </p>
      </div>

      {/* Dropdown chọn tuyến */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="w-full flex justify-between items-center p-2 rounded border border-gray-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className={selected ? "text-gray-800" : "text-gray-500"}>
            {selected ? selected.ten : "Chọn một tuyến để xem..."}
          </span>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

        {isDropdownOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {tuyenList.map((t) => (
              <li key={t.id} onClick={() => { setSelected(t); setShowAll(false); setIsDropdownOpen(false); }} onMouseEnter={() => setHoveredId(t.id)} onMouseLeave={() => setHoveredId(null)} className={`p-2 cursor-pointer transition ${selected?.id === t.id ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}>
                {t.ten}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Nút hiển thị tất cả tuyến */}
      <div>
        <button
          onClick={() => {
            setShowAll(true);
            setSelected(null);
            setIsDropdownOpen(false);
          }}
          className="w-full px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Hiển thị tất cả tuyến
        </button>
      </div>
    </div>
  );
};

const TuyenDuongList = () => {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Nếu hiển thị tất cả tuyến → gom toàn bộ toạ độ lại
  const allPositions = tuyenList.flatMap((t) => t.toaDo);

  return (
    <div className="relative h-[calc(100vh-200px)] rounded-xl shadow-lg overflow-hidden">
      <RouteControls
        showAll={showAll}
        selected={selected}
        isDropdownOpen={isDropdownOpen}
        hoveredId={hoveredId}
        setShowAll={setShowAll}
        setSelected={setSelected}
        setIsDropdownOpen={setIsDropdownOpen}
        setHoveredId={setHoveredId}
        tuyenList={tuyenList}
      />

      {/* === BẢN ĐỒ NỀN === */}
      <MapContainer
        center={[10.78, 106.7]}
        zoom={12}
        className="h-full w-full"
        zoomControl={false} // Tắt zoom control mặc định để tránh bị che
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
            <Polyline key={t.id} positions={t.toaDo} pathOptions={{
              color: t.color,
              weight: hoveredId === t.id ? 6 : 3,
              opacity: hoveredId === t.id ? 1 : 0.7
            }}
              eventHandlers={{
                click: () => {
                  setSelected(t);
                  setShowAll(false);
                },
                mouseover: () => setHoveredId(t.id),
                mouseout: () => setHoveredId(null),
              }}
            >
              <Popup>{t.ten}</Popup>
            </Polyline>
          ))}

        {/* Nếu chọn tuyến → chỉ vẽ tuyến đó */}
        {!showAll && selected && (
          <>
            <RoutedPolyline
              positions={selected.toaDo}
              color={selected.color}
              weight={5}
              opacity={0.9}
            />
            {/* Popup vẫn được gắn vào một Polyline ẩn để giữ chức năng click */}
            <Polyline positions={selected.toaDo} opacity={0}><Popup>{selected.ten}</Popup></Polyline>

            {selected.toaDo.map((pos, i) => {
              // Chỉ hiển thị marker cho điểm đầu và điểm cuối
              if (i === 0 || i === selected.toaDo.length - 1) {
                return (
                  <Marker key={i} position={pos} icon={i === 0 ? flagIcon : mappinIcon}>
                    <Popup>
                      {i === 0 ? "🚍 Điểm đón đầu tuyến" : "🏁 Điểm trả cuối tuyến"}
                    </Popup>
                  </Marker>
                );
              }
              return null; // Không render marker cho các điểm trung gian
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default TuyenDuongList;
