import { useEffect, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import "./SSBHeader.css";

export default function SSBHeader() {
    const [role, setRole] = useState(() => localStorage.getItem("ssb_role") || "admin");
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => { setOpen(false); }, [location.pathname]);
    useEffect(() => { localStorage.setItem("ssb_role", role); }, [role]);

    const nav = [
        { to: "/", label: "Tổng quan" },
        { to: "/admin/drivers", label: "Tài xế" },
        { to: "/admin/students", label: "Học sinh" },
        { to: "/admin/routes", label: "Tuyến đường" },
        { to: "/admin/reports", label: "Báo cáo" },
    ];

    return (
        <header className="ssbh">
            {/* dải promo mảnh phía trên */}
            <div className="ssbh-top">
                <div className="inner">
                    <span>SSB 1.0 • Theo dõi xe buýt học sinh theo thời gian thực.</span>
                    <a href="#" className="more">Tìm hiểu thêm</a>
                </div>
            </div>

            {/* thanh điều hướng chính */}
            <div className="ssbh-bar">
                <div className="inner">
                    <button className="hamburger" onClick={() => setOpen(v => !v)} aria-label="Mở menu">
                        <span></span><span></span><span></span>
                    </button>

                    <Link to="/" className="brand" aria-label="SSB Home">
                        {/* icon bus nhỏ */}
                        <svg viewBox="0 0 64 48" width="26" height="20" aria-hidden="true">
                            <rect x="6" y="10" rx="6" ry="6" width="52" height="22" fill="#fff" />
                            <rect x="6" y="26" width="52" height="6" fill="#22c55e" />
                            <rect x="10" y="14" width="26" height="8" rx="2" fill="#dbeafe" />
                            <rect x="38" y="14" width="8" height="8" rx="2" fill="#dbeafe" />
                            <rect x="48" y="14" width="6" height="8" rx="1.5" fill="#dbeafe" />
                            <circle cx="20" cy="34" r="4.5" fill="#0f172a" />
                            <circle cx="46" cy="34" r="4.5" fill="#0f172a" />
                        </svg>
                        <span className="brand-text">SSB</span>
                    </Link>

                    <nav className="nav">
                        {nav.map(it => (
                            <NavLink key={it.to} to={it.to} end
                                className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                                {it.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="tools">
                        <div className="search">
                            <SearchIcon />
                            <input placeholder="Tìm kiếm..." aria-label="Tìm kiếm" />
                        </div>

                        <button className="icon-btn" aria-label="Thông báo"><BellIcon /></button>

                        <select
                            aria-label="Chọn vai trò"
                            className="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="driver">Driver</option>
                            <option value="parent">Parent</option>
                        </select>

                        <div className="avatar" title="Bạn">ML</div>
                    </div>
                </div>
            </div>

            {/* panel mobile */}
            <div className={`panel ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
                <div className="sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="panel-search">
                        <SearchIcon /><input placeholder="Tìm kiếm..." />
                    </div>
                    <div className="panel-links">
                        {nav.map(it => (
                            <NavLink key={it.to} to={it.to} className="panel-link">{it.label}</NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}

/* icons */
function SearchIcon(props) {
    return <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28.79.79L20 21.5 21.5 20l-6-6zM6.5 11A4.5 4.5 0 1 1 11 15.5 4.5 4.5 0 0 1 6.5 11z" />
    </svg>;
}
function BellIcon(props) {
    return <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
        <path fill="currentColor" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2z" />
    </svg>;
}
