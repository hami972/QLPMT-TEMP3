import React from 'react'
import './mistyles.css'
import { NavLink } from "react-router-dom";
import { useLocation, Redirect, Route, Switch } from 'react-router';
import XemBaoCaoTheoBacSiTheoThang from './BaoCao-BacSi-Detail1';
import XemBaoCaoTheoBacSiTheoNam from './BaoCao-BacSi-Detail2';
const XemBaoCaoTheoBacSi = (props) => {
  const { pathname } = useLocation();
  return (
    <div>
      <ul className="nav subtab">
        <li className="nav-item">
          <NavLink style={{color: "white"}} className="nav-link " to="/manager/baocao/baocaotheobacsi/xemtheothang">Xem theo tháng</NavLink>
        </li>
        <li className="nav-item">
          <NavLink style={{color: "white"}} className="nav-link action" to="/manager/baocao/baocaotheobacsi/xemtheonam">Xem theo năm</NavLink>
        </li>
      </ul>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/baocao/baocaotheobacsi/xemtheothang">
            <XemBaoCaoTheoBacSiTheoThang />
          </Route>
          <Route path="/manager/baocao/baocaotheobacsi/xemtheonam">
            <XemBaoCaoTheoBacSiTheoNam />
          </Route>
          {pathname === "/manager/baocao/baocaotheobacsi" ? (
            <Redirect to="/manager/baocao/baocaotheobacsi/xemtheothang" />
          ) : null}
        </Switch>
      </div>
    </div>
  );
}

export default XemBaoCaoTheoBacSi;