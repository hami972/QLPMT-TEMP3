import React from 'react'
import './mistyles.css'
import { NavLink } from "react-router-dom";
import { useLocation, Redirect, Route, Switch } from 'react-router';
import XemBaoCaoTheoDichVuTheoNam from './BaoCao-DichVu-Detail2';
import XemBaoCaoTheoDichVuTheoThang from './BaoCao-DichVu-Detail1';
const XemBaoCaoTheoDichVu = (props) => {
  const { pathname } = useLocation();
  return (
    <div>
      <ul className="nav subtab">
        <li className="nav-item">
          <NavLink style={{color: "white"}} className="nav-link action" to="/manager/baocao/baocaotheodichvu/xemtheothang">Xem theo tháng</NavLink>
        </li>
        <li className="nav-item action">
          <NavLink style={{color: "white"}} className="nav-link " to="/manager/baocao/baocaotheodichvu/xemtheonam">Xem theo năm</NavLink>
        </li>
      </ul>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/baocao/baocaotheodichvu/xemtheothang">
            <XemBaoCaoTheoDichVuTheoThang />
          </Route>
          <Route path="/manager/baocao/baocaotheodichvu/xemtheonam">
            <XemBaoCaoTheoDichVuTheoNam />
          </Route>
          {pathname === "/manager/baocao/baocaotheodichvu" ? (
            <Redirect to="/manager/baocao/baocaotheodichvu/xemtheothang" />
          ) : null}
        </Switch>
      </div>
    </div>
  );
}

export default XemBaoCaoTheoDichVu;