import { NavLink, Link, useHistory } from "react-router-dom"
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../hook/AuthProvider'
import nav from '../hook/PhanQuyen'
const TopNav = () => {
  const { logout, user, scope } = useContext(AuthContext);
  const handleSignout = () => {
    logout()
  }
  return (
    <nav className="navbar navbar-expand-md bg-light navbar-light headdd" >
      <div className="container"  id="topNav" >
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
          Menu
          <i className="fa-solid fa-caret-down"></i>
        </button>

        <div className="mx-3"></div>

        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav d-flex row col-12">

            {scope?.map((val, idx) => {
              return (
                <li className="nav-item col-lg-auto col-md-4 m-lg-auto">
                  {(val.path !== "/manager") ? <NavLink className="nav-link" to={val.path} exact>
                    {val.name}
                  </NavLink> : <NavLink className="nav-link" to={val.path}>{val.name}</NavLink>}
                </li>
              );
            })}
            {(user === null || user?.Loai === 'KhachHang') && <div className="dropdown mb-2 col-auto">
              <button
                className="d-flex align-items-center justify-content-center link-dark text-decoration-none dropdown-toggle mt-2 ps-md-2 p-0"
                style={{ border: "none", backgroundColor: "transparent", fontWeight: "bold", fontSize: "16px" }}
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >Đặt lịch
              </button>
              <ul
                className="dropdown-menu dropdown-menu-dark text-small shadow"
                style={{ backgroundColor: "#007cd4" }}
                aria-labelledby="dropdownUser1"
              >
                <li>
                  <Link className="dropdown-item" to="/booking">
                    Nhân viên liên hệ
                  </Link>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <Link className="dropdown-item" to="/bookingOnline">
                    Đặt online
                  </Link>
                </li>
              </ul>
            </div>}
            <div className="d-md-flex col-auto">
              {user == null && (
                <div className="nav-item me-sm-4">
                  <NavLink className="nav-link" to="/sign_in">
                    Đăng nhập
                  </NavLink>
                </div>
              )}


              {user !== null && <div className="dropdown me-sm-4">

                <button
                  className="d-flex align-items-center justify-content-center link-dark text-decoration-none dropdown-toggle p-0"
                  style={{ border: "none", backgroundColor: "transparent" }}
                  id="dropdownUser1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user != null && <text className="nav-link">{user.ten}</text>}
                  <img
                    src="/images/ava.png"
                    alt="hugenerd"
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%" }}
                  />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-dark text-small shadow"
                  style={{ backgroundColor: "#FF8BD2" }}
                  aria-labelledby="dropdownUser1"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Hồ sơ cá nhân
                    </Link>
                  </li>
                  <hr className="dropdown-divider" />
                  {/* <li>
              <Link className="dropdown-item" to="/profile">
                Hồ sơ điều trị
              </Link>
            </li> */}
                  {/* <hr className="dropdown-divider" /> */}
                  <li>
                    <button className="dropdown-item" onClick={handleSignout}>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>}
              {user === null && <div className="nav-item col-auto">
                <NavLink className="nav-link" to="/sign_up">
                  Đăng ký
                </NavLink>
              </div>}
            </div>
          </ul>
        </div>

      </div>
    </nav>
  );
}
export default TopNav;