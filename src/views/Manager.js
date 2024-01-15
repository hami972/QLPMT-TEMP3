import React, { useState, useEffect, useContext } from 'react';
import './style.css'
import { NavLink, useLocation, Switch, Route, Redirect } from "react-router-dom";
import BaoCao from './BaoCao';
import QuanLyNhanVien from './QuanLyNhanVien';
import QuanLyMaGiamGia from './QuanLyMaGiamGia';
import QuanLyDichVu from './QuanLyDichVu';
import QuanLyChiNhanh from './QuanLyChiNhanh';
import QuanLyKho from './QuanLyKho';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import QuanLyDanhGia from './QuanLyDanhGia';
import ScheduleManagement from './ScheduleManagement';
import PatientManagement from './PatientManagement';
import BillManagement from './BillManagement';
import MaterialUsed from './MaterialUsed';
import { AuthContext } from '../hook/AuthProvider'
const Manager = (props) => {
  const { pathname } = useLocation();
  const { scopeQL } = useContext(AuthContext);
  return (
    <div style={{ backgroundColor: 'black' }} >
      <TopNav />
      <nav className="container" >
        <div className="row flex-nowrap" >
          <div className="col py-3" style={{ overflowX: "auto", minHeight: "350px" }}>
            <Route>
              <Switch />
              <Route path="/manager/schedule">
                <ScheduleManagement />
              </Route>
              <Route path="/manager/patient">
                <PatientManagement />
              </Route>
              <Route path="/manager/quanlynhanvien">
                <QuanLyNhanVien />
              </Route>
              <Route path="/manager/baocao">
                <BaoCao />
              </Route>
              <Route path="/manager/quanlykho">
                <QuanLyKho />
              </Route>
              <Route path="/manager/bill">
                <BillManagement />
              </Route>
              <Route path="/manager/quanlydichvu">
                <QuanLyDichVu />
              </Route>
              <Route path="/manager/quanlychinhanh">
                <QuanLyChiNhanh />
              </Route>
              <Route path="/manager/quanlymagiamgia">
                <QuanLyMaGiamGia />
              </Route>
              <Route path="/manager/quanlydanhgia">
                <QuanLyDanhGia />
              </Route>
              <Route path="/manager/deviceUsed">
                <MaterialUsed />
              </Route>

              {pathname === "/manager" ? (
                <Redirect to={scopeQL[0].path} />
              ) : null}
              <Switch />
            </Route>
          </div>
        </div>
      </nav>
      <footer className='footer' style={{ color: "white" }}>
        <div className="container pt-4 pb-5">
          <div className="row">

            <div className="col-lg-4 col-md-5">
              <img alt="" src="/images/logo2.png" />
              <p className="mt-3" style={{ fontSize: "20px" }}>Giới thiệu</p>
              <p>Phòng khám LOGOIPSUM đã được thành lập hơn 7 năm. Với kinh nghiệm và đội ngũ nha sĩ chuyện nghiệp chúng tôi tự tin sẽ đem đến nhưng dịch vụ tốt nhất.</p>
            </div>

            <div className="col-lg-8 col-md-7 row mt-3">
              <div className="mt-lg-3 col-lg-4">
                <span style={{ fontSize: "19px" }}>Giờ mở cửa toàn chi nhánh</span>
                <br />
                <ul>
                  <li>Sáng: 08:30 - 11:30</li>
                  <li>Chiều: 13:30 - 17:00</li>
                  <li>Tối: 17:00 - 20:00</li>
                </ul>
              </div>
              <div className="mt-lg-3 col-lg-4">
                <span style={{ fontSize: "19px" }}>Địa chỉ</span>
                <ul>
                  <li>Thủ Đức, thành phố Hồ Chí Minh</li>
                  <li>Quận 7, thành phố Hồ Chí Minh</li>
                  <li>Quận 8, thành phố Hồ Chí Minh</li>
                  <li>Bình Thạnh, thành phố Hồ Chí Minh</li>
                </ul>
              </div>
              <div className="mt-lg-3 col-lg-4" style={{ fontSize: "19px" }}>
                Email: LOGOIPSUM@gmail.com
                <br />
                Phone: 0843593598
              </div>
            </div>


          </div>
        </div>

      </footer>
    </div>
  );
}
export default Manager;