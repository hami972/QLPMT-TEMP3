import { NavLink, Link, useHistory, useLocation } from "react-router-dom"
import React, { useState, useEffect, useContext } from 'react';
import { matchPath } from "react-router";
import { AuthContext } from '../hook/AuthProvider'
import nav from '../hook/PhanQuyen'
const TopNav = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { Logout, user, scope, scopeQL } = useContext(AuthContext);
  const handleSignout = () => {
    Logout(history)
  }

  //hide header when scroll down and show header when scroll up
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true)

  const handleScroll = () => {
    const currentScrollPos = window.scrollY

    if (currentScrollPos > prevScrollPos) {
      setVisible(false)
    } else {
      setVisible(true)
    }

    setPrevScrollPos(currentScrollPos)
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll)
  })
  return (
    <nav className={`navbar navbar-expand-md bg-dark headerTopNav navbar-light sticky-${visible ? 'top' : ''} `}>
      <div className="container" id="topNav" >
        <div>
          <img
            src="/images/logo2.png"
            alt="Avatar Logo"
            style={{ minWidth: "100%" }}
          />
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          Bảng chọn
          <i className="fa-solid fa-caret-down"></i>
        </button>

        <div className="mx-3"></div>

        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav d-flex row col-12">
            {scope?.map((val, idx) => {
              return (
                <li className="nav-item col-sm-auto">
                  {val.path !== "/manager" ? (
                    <NavLink className="nav-link" to={val.path} exact>
                      {val.name}
                    </NavLink>
                  ) : (
                    <div className="dropdown mb-2 col-sm-auto">
                      <button
                        className={`d-flex align-items-center justify-content-center link-light text-decoration-none dropdown-toggle mt-2 ps-md-2 p-0 ${matchPath(pathname, { path: "/manager", exact: false }) ? "textGradient" : null}`}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          fontWeight: matchPath(pathname, { path: "/manager", exact: false }) ? 800 : "bold",
                          fontSize: "16px",
                        }}
                        id="dropdownUser1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Quản lý
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-dark text-small shadow headerPage"
                        style={{ width: "fit-content" }}
                        aria-labelledby="dropdownUser1"
                      >
                        {scopeQL?.map((val, idx) => {
                          return (
                            <div>
                              <li>
                                <NavLink className="dropdown-item" to={val.path}>
                                  {val.name}
                                </NavLink>
                              </li>
                              {(idx === scopeQL.length - 1) ? null : <hr className="dropdown-divider" />}
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
            {(user === null || user?.Loai === "KhachHang") && (
              <div className="dropdown mb-2 col-sm-auto">
                <button
                  className="d-flex align-items-center justify-content-center link-light text-decoration-none dropdown-toggle mt-2 ps-md-2 p-0"
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                  id="dropdownUser1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Đặt lịch
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-dark text-small shadow headerPage"
                  style={{ width: "fit-content" }}
                  aria-labelledby="dropdownUser1"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/booking">
                      Nhân viên liên hệ
                    </NavLink>
                  </li>
                  <hr className="dropdown-divider" />
                  <li>
                    <NavLink className="dropdown-item" to="/bookingOnline">
                      Đặt online
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
            <div className="d-sm-flex col-sm-auto ms-lg-auto">
              {user == null && (
                <div className="nav-item me-sm-4">
                  <NavLink className="nav-link" to="/sign_in">
                    Đăng nhập
                  </NavLink>
                </div>
              )}

              {user !== null && (
                <div className="dropdown me-sm-4">
                  <button
                    className="d-flex align-items-center justify-content-center link-light text-decoration-none dropdown-toggle p-0"
                    style={{ border: "none", backgroundColor: "transparent" }}
                    id="dropdownUser1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user != null && (
                      <text className="nav-link me-2" style={{ color: "#FFF" }}><b>{user.ten}</b></text>
                    )}
                    <img
                      src="/images/ava.png"
                      alt="hugenerd"
                      width="40"
                      height="40"
                      style={{ borderRadius: "50%" }}
                    />
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-dark text-small shadow headerPage"
                    style={{ width: "fit-content" }}
                    aria-labelledby="dropdownUser1"
                  >
                    <li>
                      <NavLink className="dropdown-item" to="/profile">
                        Hồ sơ cá nhân
                      </NavLink>
                    </li>
                    <hr className="dropdown-divider" />
                    <li>
                      <button className="dropdown-item" onClick={handleSignout}>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              {user === null && (
                <div className="nav-item col-auto">
                  <NavLink className="nav-link" to="/sign_up">
                    Đăng ký
                  </NavLink>
                </div>
              )}
            </div>
          </ul>
        </div>

      </div>
    </nav>
  );
}
export default TopNav;