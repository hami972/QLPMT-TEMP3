import React from 'react'
import './mistyles.css'
import { NavLink } from "react-router-dom";
import { useLocation, Redirect, Route, Switch } from 'react-router';
import XemBaoCaoTheoThang from './BaoCao-ThoiGian-Detail1'
import XemBaoCaoTheoNam from './BaoCao-ThoiGian-Detail2'
const XemBaoCaoTheoThoiGian = (props) => {
  const { pathname } = useLocation();
  return (
    <div style={{color: '#fff'}}>
      <ul className="nav subtab">
        <li className="nav-item">
          <NavLink style={{color: "white"}} className="nav-link " to="/manager/baocao/baocaotheothoigian/xemtheothang">Xem theo tháng</NavLink>
        </li>
        <li className="nav-item">
          <NavLink style={{color: "white"}}  className="nav-link action" to="/manager/baocao/baocaotheothoigian/xemtheonam">Xem theo năm</NavLink>
        </li>
      </ul>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/baocao/baocaotheothoigian/xemtheothang">
            <XemBaoCaoTheoThang />
          </Route>
          <Route path="/manager/baocao/baocaotheothoigian/xemtheonam">
            <XemBaoCaoTheoNam />
          </Route>
          {pathname === "/manager/baocao/baocaotheothoigian" ? (
            <Redirect to="/manager/baocao/baocaotheothoigian/xemtheothang" />
          ) : null}
        </Switch>
      </div>
    </div>
  );
}

export default XemBaoCaoTheoThoiGian;