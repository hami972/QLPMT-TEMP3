import React from "react";
import "./mistyles.css";
import { NavLink } from "react-router-dom";
import { useLocation, Redirect, Route, Switch } from 'react-router';
import XemBaoCaoChiNhanhTheoThang from "./BaoCao-ChiNhanh-Detail1";
import XemBaoCaoChiNhanhTheoNam from "./BaoCao-ChiNhanh-Detail2";
const XemBaoCaoTheoChiNhanh = (props) => {
  const { pathname } = useLocation();
  return (
    <div>
      <ul className="nav subtab">
        <li className="nav-item">
          <NavLink style={{color: "white"}}
            className="nav-link "
            to="/manager/baocao/baocaotheochinhanh/xemtheothang"
          >
            Xem theo tháng
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink style={{color: "white"}}
            className="nav-link action"
            to="/manager/baocao/baocaotheochinhanh/xemtheonam"
          >
            Xem theo năm
          </NavLink>
        </li>
      </ul>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/baocao/baocaotheochinhanh/xemtheothang">
            <XemBaoCaoChiNhanhTheoThang />
          </Route>
          <Route path="/manager/baocao/baocaotheochinhanh/xemtheonam">
            <XemBaoCaoChiNhanhTheoNam />
          </Route>
          {pathname === "/manager/baocao/baocaotheochinhanh" ? (
            <Redirect to="/manager/baocao/baocaotheochinhanh/xemtheothang" />
          ) : null}
        </Switch>
      </div>
    </div>
  );
};

export default XemBaoCaoTheoChiNhanh;
