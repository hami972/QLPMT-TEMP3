import React from 'react'
import './mistyles.css'
import { NavLink } from "react-router-dom";
import { useLocation, Redirect, Route, Switch } from 'react-router';
import XemBaoCaoCPPKTheoThang from './BaoCao-ChiPhiPK-Detail1'
import XemBaoCaoCPPKTheoNam from './BaoCao-ChiPhiPK-Detail2';
const XemBaoCaoTheoCPPK = (props) => {
  const { pathname } = useLocation();
  return (
    <div>
      <ul className="nav subtab">
        <li className="nav-item">
          <NavLink style={{color: "white"}} className="nav-link " to="/manager/baocao/baocaotheochiphiphongkham/xemtheothang">Xem theo tháng</NavLink>
        </li>
        <li className="nav-item">
          <NavLink style={{color: "white"}} className="nav-link action" to="/manager/baocao/baocaotheochiphiphongkham/xemtheonam">Xem theo năm</NavLink>
        </li>
      </ul>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/baocao/baocaotheochiphiphongkham/xemtheothang">
            <XemBaoCaoCPPKTheoThang />
          </Route>
          <Route path="/manager/baocao/baocaotheochiphiphongkham/xemtheonam">
            <XemBaoCaoCPPKTheoNam />
          </Route>
          {pathname === "/manager/baocao/baocaotheochiphiphongkham" ? (
            <Redirect to="/manager/baocao/baocaotheochiphiphongkham/xemtheothang" />
          ) : null}
        </Switch>
      </div>
    </div>
  );
}

export default XemBaoCaoTheoCPPK;