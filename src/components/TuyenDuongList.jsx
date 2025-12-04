import React, { useState, useEffect, useCallback } from "react";
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

// Icon trạm xe buýt
const busStopIconSVG = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <defs>
        <filter id="busStopShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
        </filter>
      </defs>
      <g filter="url(#busStopShadow)">
        <rect x="3" y="2" width="18" height="12" rx="2" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/>
        <path fill="#FFFFFF" d="M7 5h10v6H7z"/>
        <path fill="#2563EB" d="M8 6h2v4H8zm3 0h2v4h-2zm3 0h2v4h-2z"/>
        <circle cx="8.5" cy="13" r="1.5" fill="#333"/>
        <circle cx="15.5" cy="13" r="1.5" fill="#333"/>
        <rect x="11" y="14" width="2" height="8" fill="#6B7280" />
        <rect x="9" y="21" width="6" height="1" fill="#6B7280" />
      </g>
    </svg>
  );
const busStopIcon = createDivIcon(busStopIconSVG);


// Icon điểm dừng trung gian
const stopIconSVG = renderToStaticMarkup(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <circle cx="12" cy="12" r="6" fill="#888" stroke="#fff" stroke-width="2" />
  </svg>
);
const stopIcon = L.divIcon({
  html: stopIconSVG,
  className: "bg-transparent border-none",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const tuyenList = [
  { id: 1, ten: "Tuyến 1: Quận 1 – Quận 5", toaDo: [ [10.7769, 106.7009], [10.7547, 106.6663], ], color: "#3b82f6" },
  { id: 2, ten: "Tuyến 2: Quận 7 – TP. Thủ Đức", toaDo: [ [10.738, 106.7216], [10.8493, 106.7539], ], color: "#22c55e" },
  { id: 3, ten: "Tuyến 3: Quận 3 – Bình Thạnh", toaDo: [ [10.784, 106.694], [10.804, 106.712], ], color: "#ef4444" },
  { id: 4, ten: "Tuyến 4: Gò Vấp – Tân Bình", toaDo: [ [10.838, 106.671], [10.801, 106.655], ], color: "#f97316" },
  { id: 5, ten: "Tuyến 5: Bình Chánh – Quận 10", toaDo: [ [10.746, 106.594], [10.772, 106.667], ], color: "#8b5cf6" },
  { id: 6, ten: "Tuyến 6: Quận 9 – Quận 2 – Quận 1", toaDo: [ [10.841, 106.826], [10.787, 106.749], [10.7769, 106.7009], ], color: "#78350f" },
  { id: 7, ten: "Tuyến 7: Quận 11 – Quận 6", toaDo: [ [10.765, 106.641], [10.748, 106.632], ], color: "#ec4899" },
  { id: 8, ten: "Tuyến 8: Quận 4 – Quận 8", toaDo: [ [10.755, 106.703], [10.733, 106.658], ], color: "#14b8a6" },
  { id: 9, ten: "Tuyến 9: Quận 12 – Tân Bình", toaDo: [ [10.868, 106.625], [10.801, 106.655], ], color: "#64748b" },
  { id: 10, ten: "Tuyến 10: Tân Phú – Bình Tân", toaDo: [ [10.789, 106.613], [10.75, 106.602], ], color: "#facc15" },
];

const FitBoundsToRoute = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

const RoutedPolyline = ({ positions, color, weight, opacity }) => {
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const controller = new AbortController();
    if (!positions || positions.length < 2) {
      setRoute([]);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    const waypoints = positions.map(p => `${p[1]},${p[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

    fetch(url, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusText)))
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]));
          setStatus('success');
        } else throw new Error('Không tìm thấy tuyến đường từ OSRM.');
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error("Lỗi khi tìm đường đi:", err);
        setStatus('error');
        setRoute(positions);
      });
    return () => controller.abort();
  }, [positions]);

  const polylinePositions = status === 'loading' ? positions : route;
  const pathOptions = { color, weight: status === 'loading' ? 4 : weight, opacity: status === 'loading' ? 0.6 : opacity, dashArray: status === 'loading' ? '10, 10' : undefined };
  return polylinePositions.length > 0 ? <Polyline positions={polylinePositions} pathOptions={pathOptions} /> : null;
};

const RouteControls = ({ showAll, selected, isDropdownOpen, hoveredId, setShowAll, setSelected, setIsDropdownOpen, setHoveredId, tuyenList }) => (
  <div className="absolute top-4 left-4 z-[1000] w-full max-w-xs bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-blue-700">Tuyến đường</h2>
      <p className="text-sm text-gray-600 mt-1">
        {showAll ? "Đang hiển thị tất cả các tuyến." : selected ? `Đang xem chi tiết: ${selected.ten}` : "Hãy chọn một tuyến để xem."}
      </p>
    </div>
    <div className="relative">
      <button onClick={() => setIsDropdownOpen(p => !p)} className="w-full flex justify-between items-center p-2 rounded border border-gray-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className={selected ? "text-gray-800" : "text-gray-500"}>{selected ? selected.ten : "Chọn một tuyến để xem..."}</span>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isDropdownOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {tuyenList.map(t => (
            <li key={t.id} onClick={() => { setSelected(t); setShowAll(false); setIsDropdownOpen(false); }} onMouseEnter={() => setHoveredId(t.id)} onMouseLeave={() => setHoveredId(null)} className={`p-2 cursor-pointer transition ${selected?.id === t.id ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}>
              {t.ten}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div>
      <button onClick={() => { setShowAll(true); setSelected(null); setIsDropdownOpen(false); }} className="w-full px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition">
        Hiển thị tất cả tuyến
      </button>
    </div>
  </div>
);

const movingBusSVG = (rotation) => renderToStaticMarkup(
  <div style={{ transform: `rotate(${rotation}deg)` }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none">
      <path fill="#FFD159" stroke="#B38600" stroke-width="0.8" d="M4 6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2v1a1 1 0 1 1-2 0v-1H8v1a1 1 0 1 1-2 0v-1a2 2 0 0 1-2-2V6Z"/>
      <path fill="#FFF" d="M6 7h12v5H6z"/>
      <path fill="#60A5FA" d="M7 8h2v3H7zm4 0h2v3h-2zm4 0h2v3h-2z"/>
      <circle cx="7" cy="16" r="2" fill="#334155"/><circle cx="17" cy="16" r="2" fill="#334155"/>
    </svg>
  </div>
);

// 🚌 Component mô phỏng xe buýt di chuyển (đã được đơn giản hóa)
const AnimatedBusMarker = ({ positions, status, onFinish, onProgress, speed = 550 }) => {
  const [currentPosition, setCurrentPosition] = useState(() => positions.length > 0 ? positions[0] : null);
  const [rotation, setRotation] = useState(0);
  const animationRef = React.useRef({ frameId: null, startTime: 0, currentIndex: 0, pauseTime: 0 });

  useEffect(() => {
    if (status === 'playing') {
      animationRef.current.startTime = performance.now();
      const animate = (timestamp) => {
        let { currentIndex, pauseTime } = animationRef.current;
        if (currentIndex >= positions.length - 1) {
          if (onProgress) onProgress(100);
          if (onFinish) onFinish();
          return;
        }
        const p1 = positions[currentIndex];
        const p2 = positions[currentIndex + 1];
        const segmentDistance = L.latLng(p1).distanceTo(L.latLng(p2));
        const segmentDuration = (segmentDistance / speed) * 1000;
        const elapsedTime = (timestamp - animationRef.current.startTime) + pauseTime;
        const progress = Math.min(elapsedTime / segmentDuration, 1);
        setCurrentPosition([p1[0] + (p2[0] - p1[0]) * progress, p1[1] + (p2[1] - p1[1]) * progress]);
        if (progress >= 1) {
          animationRef.current.currentIndex++;
          animationRef.current.startTime = timestamp;
          animationRef.current.pauseTime = 0;
          setRotation(Math.atan2(p2[0] - p1[0], p2[1] - p1[1]) * 180 / Math.PI);
        }
        if (onProgress) onProgress(((currentIndex + progress) / (positions.length - 1)) * 100);
        animationRef.current.frameId = requestAnimationFrame(animate);
      };
      animationRef.current.frameId = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current.frameId) {
          cancelAnimationFrame(animationRef.current.frameId);
          animationRef.current.frameId = null;
          animationRef.current.pauseTime = (performance.now() - animationRef.current.startTime) + animationRef.current.pauseTime;
          animationRef.current.startTime = 0;
        }
      };
    }
  }, [status, positions, onFinish, onProgress, speed]);

  if (!currentPosition) return null;
  const busIcon = L.divIcon({ html: movingBusSVG(rotation), className: 'bg-transparent border-none', iconSize: [32, 32], iconAnchor: [16, 16] });
  return <Marker position={currentPosition} icon={busIcon} />;
};

// ℹ️ Panel thông tin và điều khiển (đã tái cấu trúc)
const RouteInfoPanel = ({ routeInfo, status, animationStatus, setAnimationStatus, animationProgress, handleReplay }) => {
  if (!routeInfo || status === 'loading') {
    return (
      <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 text-center text-gray-600">
        <svg className="animate-spin h-6 w-6 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-sm">Đang tìm lộ trình...</p>
      </div>
    );
  }

  const distanceInKm = (routeInfo.distance / 1000).toFixed(1);
  const durationInMinutes = Math.round(routeInfo.duration / 60);
  const isSimulating = animationStatus === 'playing' || animationStatus === 'paused';
  
  const handleTogglePause = () => setAnimationStatus(p => p === 'playing' ? 'paused' : 'playing');

  return (
    <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col space-y-3">
      <div><h3 className="font-bold text-gray-800">Thông tin lộ trình</h3></div>
      <div className="flex justify-between text-sm border-t border-b border-gray-200 py-2">
        <div className="text-center"><div className="font-semibold text-blue-600">{distanceInKm}</div><div className="text-gray-500">km</div></div>
        <div className="text-center"><div className="font-semibold text-blue-600">{durationInMinutes}</div><div className="text-gray-500">phút</div></div>
        <div className="text-center"><div className="font-semibold text-blue-600">Xe buýt</div><div className="text-gray-500">phù hợp</div></div>
      </div>
      <div className="flex flex-col space-y-2">
        {isSimulating ? (
          <button onClick={handleTogglePause} className={`w-full flex items-center justify-center px-3 py-2 text-sm rounded text-white transition ${animationStatus === 'playing' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
            {animationStatus === 'playing' ? 'Tạm dừng' : 'Tiếp tục'}
          </button>
        ) : (
          <button onClick={handleReplay} disabled={status !== 'success'} className="w-full flex items-center justify-center px-3 py-2 text-sm rounded bg-green-500 text-white hover:bg-green-600 transition disabled:bg-gray-400">
            {animationProgress > 0 ? 'Chạy lại mô phỏng' : 'Bắt đầu mô phỏng'}
          </button>
        )}
      </div>
    </div>
  );
};

const getTrafficAdjustedDuration = (baseDuration) => {
  const currentHour = new Date().getHours();
  let trafficMultiplier = 1.5;
  if (currentHour >= 7 && currentHour < 10) trafficMultiplier = 2.4;
  else if (currentHour >= 16 && currentHour < 19) trafficMultiplier = 3.0;
  return baseDuration * trafficMultiplier;
};

// Component để tìm và hiển thị các trạm xe buýt
const BusStops = ({ routePolyline, isVisible }) => {
    const [busStops, setBusStops] = useState([]);
  
    useEffect(() => {
      if (!isVisible || !routePolyline || routePolyline.length < 2) {
        setBusStops([]);
        return;
      }
  
      const controller = new AbortController();
      const signal = controller.signal;
  
      // Để tránh URL quá dài, ta lấy mẫu một số điểm trên tuyến đường
      const simplifiedPolyline = routePolyline.filter((_, i) => i % 10 === 0);
      if (routePolyline.length > 1 && (routePolyline.length - 1) % 10 !== 0) {
        simplifiedPolyline.push(routePolyline[routePolyline.length-1]);
      }
      const waypoints = simplifiedPolyline.map(p => `${p[0]},${p[1]}`).join(',');
  
      // Query Overpass API để tìm trạm xe buýt gần các điểm đã chọn
      const query = `
        [out:json][timeout:30];
        (
          node(around:50, ${waypoints})["highway"="bus_stop"];
          way(around:50, ${waypoints})["highway"="bus_stop"];
          node(around:50, ${waypoints})["public_transport"="platform"]["bus"="yes"];
          way(around:50, ${waypoints})["public_transport"="platform"]["bus"="yes"];
        );
        out center;
      `;
  
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
      fetch(url, { signal })
        .then(response => response.json())
        .then(data => {
            const stops = data.elements.map(el => {
                const pos = el.type === 'node' ? [el.lat, el.lon] : [el.center.lat, el.center.lon];
                return {
                  id: el.id,
                  position: pos,
                  tags: el.tags,
                };
              });
              // Lọc các trạm trùng lặp
              const uniqueStops = Array.from(new Map(stops.map(s => [s.id, s])).values());
              setBusStops(uniqueStops);
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Lỗi khi fetch trạm xe buýt từ Overpass API:", error);
          }
        });
  
      return () => {
        controller.abort();
      };
    }, [routePolyline, isVisible]);
  
    if (!isVisible) return null;
  
    return (
      <>
        {busStops.map(stop => (
          <Marker key={stop.id} position={stop.position} icon={busStopIcon}>
            <Popup>
              <b>Trạm xe buýt</b><br />
              {stop.tags?.name || 'Không có tên'}
            </Popup>
          </Marker>
        ))}
      </>
    );
  };

const TuyenDuongList = () => {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState('idle');
  const [routeInfo, setRouteInfo] = useState(null);
  const [animationStatus, setAnimationStatus] = useState('idle');

  const [animationProgress, setAnimationProgress] = useState(0);
  const [replayId, setReplayId] = useState(0);

  const allPositions = tuyenList.flatMap((t) => t.toaDo);

  useEffect(() => {
    if (!selected) {
      setRoute([]); setRouteInfo(null); setAnimationProgress(0); setAnimationStatus('idle'); setStatus('idle');
      return;
    }
    const controller = new AbortController();
    setAnimationStatus('idle'); setAnimationProgress(0); setStatus('loading'); setReplayId(id => id + 1);
    const waypoints = selected.toaDo.map(p => `${p[1]},${p[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

    fetch(url, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusText)))
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const routeData = data.routes[0];
          setRoute(routeData.geometry.coordinates.map(c => [c[1], c[0]]));
          setRouteInfo({ distance: routeData.distance, duration: getTrafficAdjustedDuration(routeData.duration) });
          setStatus('success');
        } else throw new Error('Không tìm thấy tuyến đường từ OSRM.');
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error("Lỗi khi tìm đường đi:", err);
        setStatus('error'); setRouteInfo(null); setRoute(selected.toaDo);
      });
    return () => controller.abort();
  }, [selected]);

  const handleAnimationFinish = useCallback(() => { setAnimationStatus('idle'); setAnimationProgress(100); }, []);
  const handleAnimationProgress = useCallback((progress) => setAnimationProgress(progress), []);
  const handleReplay = useCallback(() => { setReplayId(id => id + 1); setAnimationStatus('playing'); }, []);

  return (
    <div className="relative h-[calc(100vh-200px)] rounded-xl shadow-lg overflow-hidden">
      <RouteControls {...{ showAll, selected, isDropdownOpen, hoveredId, setShowAll, setSelected, setIsDropdownOpen, setHoveredId, tuyenList }} />
      {!showAll && selected && (
        <RouteInfoPanel {...{ routeInfo, status, animationStatus, setAnimationStatus, animationProgress, handleReplay }} />
      )}
      <MapContainer center={[10.78, 106.7]} zoom={12} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>' />
        <FitBoundsToRoute positions={showAll ? allPositions : selected?.toaDo || []} />
        {showAll && tuyenList.map(t => (
          <Polyline key={t.id} positions={t.toaDo} pathOptions={{ color: t.color, weight: hoveredId === t.id ? 6 : 3, opacity: hoveredId === t.id ? 1 : 0.7 }} eventHandlers={{ click: () => { setSelected(t); setShowAll(false); }, mouseover: () => setHoveredId(t.id), mouseout: () => setHoveredId(null) }}>
            <Popup>{t.ten}</Popup>
          </Polyline>
        ))}
        {!showAll && selected && (
          <>
            <RoutedPolyline positions={selected.toaDo} color={selected.color} weight={5} opacity={0.9} />
            {(animationStatus === 'playing' || animationStatus === 'paused') && route.length > 0 && (
              <AnimatedBusMarker key={replayId} positions={route} status={animationStatus} onFinish={handleAnimationFinish} onProgress={handleAnimationProgress} />
            )}
            <BusStops routePolyline={route} isVisible={status === 'success'} />
            <Polyline positions={selected.toaDo} opacity={0}><Popup>{selected.ten}</Popup></Polyline>
            {selected.toaDo.map((pos, i) => (
              <Marker key={i} position={pos} icon={i === 0 ? flagIcon : i === selected.toaDo.length - 1 ? mappinIcon : stopIcon}>
                <Popup>{i === 0 ? "🚍 Điểm đón đầu tuyến" : i === selected.toaDo.length - 1 ? "🏁 Điểm trả cuối tuyến" : `Điểm dừng trung gian #${i}`}</Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
      {!showAll && selected && (
        <div className="absolute bottom-2 right-4 z-[1000] bg-white/70 backdrop-blur-sm text-xs text-gray-600 px-2 py-1 rounded-md">Hoạt ảnh chỉ mang tính chất minh họa.</div>
      )}
    </div>
  );
};

export default TuyenDuongList;