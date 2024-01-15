import React, { useContext } from "react";
import "./mistyles.css";
import { useLocation, Redirect, Route, Switch } from 'react-router';
import XemBaoCaoTheoThoiGian from "./BaoCao-ThoiGian";
import { NavLink } from "react-router-dom";
import XemBaoCaoTheoDichVu from "./BaoCao-DichVu";
import XemBaoCaoTheoBacSi from "./BaoCao-Bacsi";
import XemBaoCaoTheoCPPK from "./BaoCao-ChiPhiPK";
import XemBaoCaoTheoChiNhanh from "./BaoCao-ChiNhanh";
import { AuthContext } from "../hook/AuthProvider";

const BaoCao = (props) => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  return (
    <div>
      <div className="container mt-3">
        <p>
          <b style={{color: '#fff'}}>Xem báo cáo theo:</b>
        </p>
        <ul className="nav nav-tabs maintab" >
          <li className="nav-item">
            <NavLink style={{color: "white"}}
              className="nav-link"
              to="/manager/baocao/baocaotheothoigian"
            >
              Thời gian
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/manager/baocao/baocaotheodichvu" style={{color: "white"}}>
              Dịch vụ
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/manager/baocao/baocaotheobacsi" style={{color: "white"}}>
              Bác sĩ
            </NavLink>
          </li>
          {user?.Loai === "ChuHeThong" && (
            <li className="nav-item">
              <NavLink style={{color: "white"}}
                className="nav-link"
                to="/manager/baocao/baocaotheochinhanh"
              >
                Chi nhánh
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <NavLink style={{color: "white"}}
              className="nav-link"
              to="/manager/baocao/baocaotheochiphiphongkham"
            >
              Chi phí phòng khám
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/baocao/baocaotheothoigian">
            <XemBaoCaoTheoThoiGian />
          </Route>
          <Route path="/manager/baocao/baocaotheodichvu">
            <XemBaoCaoTheoDichVu />
          </Route>
          <Route path="/manager/baocao/baocaotheobacsi">
            <XemBaoCaoTheoBacSi />
          </Route>
          <Route path="/manager/baocao/baocaotheochinhanh">
            <XemBaoCaoTheoChiNhanh />
          </Route>
          <Route path="/manager/baocao/baocaotheochiphiphongkham">
            <XemBaoCaoTheoCPPK />
          </Route>
          {pathname === "/manager/baocao" ? (
            <Redirect to="/manager/baocao/baocaotheothoigian" />
          ) : null}
        </Switch>
      </div>
    </div>
  );
};

export default BaoCao;
