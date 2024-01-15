import React from 'react'
import './mistyles.css'
import QuanLyThuoc from './QuanLyKho-QuanLyThuoc';
import QuanLyTrangThietBi from './QuanLyKho-QuanLyTrangThietBi';
import { useLocation, Redirect, Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
const QuanLyKho = (props) => {
  const { pathname } = useLocation();
  return (
    <div>
      <div className="container mt-3">
        <ul className="nav nav-tabs maintab">
          <li className="nav-item">
            <NavLink style={{color: "white"}} className="nav-link" to="/manager/quanlykho/trangthietbi">Quản lý trang thiết bị</NavLink>
          </li>
          <li className="nav-item">
            <NavLink style={{color: "white"}} className="nav-link" to="/manager/quanlykho/thuoc">Quản lý thuốc</NavLink>
          </li>
        </ul>
      </div>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/quanlykho/trangthietbi">
            <QuanLyTrangThietBi />
          </Route>
          <Route path="/manager/quanlykho/thuoc">
            <QuanLyThuoc />
          </Route>
          {pathname === "/manager/quanlykho" ? (
            <Redirect to="/manager/quanlykho/trangthietbi" />
          ) : null}
        </Switch>
      </div>
    </div>
  );
}

export default QuanLyKho;