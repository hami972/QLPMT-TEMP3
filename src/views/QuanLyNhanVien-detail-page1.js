import React, { useState, useEffect, useRef, useContext } from "react";
import moment from "moment";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Api from "../api/Api";
import LuongThuong from "./QuanLyNhanVien-LuongThuong";
import { AuthContext } from "../hook/AuthProvider";

const XemBangLuong = (props) => {
  const { user } = useContext(AuthContext);
  const [table, setTable] = useState([]);
  const [branches, setBranches] = useState(user?.chinhanh || []);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const [targetBranch, setTargetBranch] = useState("Tất cả");
  const CHAMCONG = useRef();
  useEffect(() => {
    getWorkTimes();
    getBranches();
  }, []);
  const getBranches = async () => {
    if (user?.Loai === "ChuHeThong") {
      const branches = await Api.getAllBranchs();
      setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
    }
  };

  const getWorkTimes = async () => {
    const endpoint = "/StaffManagement/getAll/ChamCong";
    const worktimes = await Api.getDocs(endpoint);
    CHAMCONG.current = worktimes;
    calSalary();
  };

  const calSalary = async () => {
    const parsedDate = moment(selectedMonth, "YYYY-MM");
    const selectedyear = parsedDate.format("YYYY");
    const selectedmonth = parsedDate.format("M");

    const currentWorkTimesTable = CHAMCONG.current.find(
      (item) => item.Thang == selectedmonth && item.Nam == selectedyear
    );
    console.log(currentWorkTimesTable);
    if (currentWorkTimesTable) {
      const totalHoursPerEmployee = [];
      Object.keys(currentWorkTimesTable)
        .filter(
          (key) =>
            key !== "Thang" && key !== "Nam" && key != "Id" && key != "ChiNhanh"
        )
        .forEach((date) => {
          currentWorkTimesTable[date].forEach((employee) => {
            const { MaNV, TenNV, SoGioLam } = employee;

            const existingEmployee = totalHoursPerEmployee.find(
              (item) => item.MaNV === MaNV
            );

            if (!existingEmployee) {
              totalHoursPerEmployee.push({
                MaNV,
                TenNV,
                SoGioLam: parseInt(SoGioLam),
              });
            } else {
              existingEmployee.SoGioLam += parseInt(SoGioLam);
            }
          });
        });

      const staffstemp = await Api.getAllStaffs();
      let staffs = [];
      if (targetBranch == "Tất cả") {
        staffs = staffstemp;
      } else {
        staffs = staffstemp.filter(
          (item, idx) => item.chiNhanh === targetBranch
        );
      }
      const bonuses = await Api.getDocs("/StaffManagement/getAll/LuongThuong");
      bonuses.filter(
        (item) => item.Thang == selectedmonth && item.Nam == selectedyear
      );
      const result = totalHoursPerEmployee
        .map((employee) => {
          const { MaNV, TenNV, SoGioLam } = employee;
          const employeeInfo = staffs.find((e) => e.maNhanVien === MaNV);

          if (employeeInfo) {
            const bonus = bonuses.filter(
              (item) =>
                item.LoaiNhanVien === "Tất cả" ||
                item.LoaiNhanVien === employeeInfo.chucVu ||
                item.MaNV === MaNV
            );
            const totalBonus = bonus.reduce(
              (sum, bonus) => sum + parseInt(bonus.Tien),
              0
            );
            return {
              ...employee,
              LuongGio: employeeInfo.luongCoBan,
              LuongThuong: totalBonus,
              TongLuong:
                parseInt(employeeInfo.luongCoBan) * parseInt(SoGioLam) +
                parseInt(totalBonus),
            };
          }
          return null;
        })
        .filter(Boolean);
      console.log(result);
      setTable(result);
    } else setTable([]);
  };
  return (
    <div >
      {/* <form name="xemBangLuong" action="/action_page.php"> */}
      <div class="row" style={{color: '#fff'}}>
        <div className="col-lg-4 col-md-4">
          <div className="mb-2"><b>Chọn tháng, năm</b></div>
          <input
            type="month"
            className="form-control pb-2 pt-2 mb-2"
            name="nameNhanVien"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
        <div className="col-lg-6 col-md-8">
          <div className="mb-2"><b>Chi nhánh</b></div>
          <select
            className="form-select pb-2 pt-2"
            id="type"
            name="chiNhanh"
            value={targetBranch}
            onChange={(e) => setTargetBranch(e.target.value)}
          >
            {user?.Loai === "ChuHeThong" ? (
              branches.map((item, index) => (
                <option key={index} value={item.tenChiNhanh}>
                  {item.tenChiNhanh}
                </option>
              ))
            ) : (
              <option value={user?.chinhanh}>{user?.chinhanh}</option>
            )}
          </select>
          <div className="text-end mb-3 mt-3">
            <button
              type="submit"
              className="btn pb-2 pt-2"
              style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}
              // class="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              onClick={calSalary}
            >
              Xem
            </button>
          </div>
        </div>
      </div>
      <div className="text-end">
        <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      </div>
      <table class="table">
        <thead style={{ verticalAlign: "middle" }}>
          <tr class="table-secondary">
            <th>Mã nhân viên</th>
            <th>Tên nhân viên</th>
            <th>Lương cơ bản/giờ</th>
            <th>Số giờ làm</th>
            <th>Lương thưởng</th>
            <th>Tổng lương</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.MaNV}</td>
              <td>{item.TenNV}</td>
              <td>{new Intl.NumberFormat("en-DE").format(item.LuongGio)}</td>
              <td>{item.SoGioLam}</td>
              <td>{new Intl.NumberFormat("en-DE").format(item.LuongThuong)}</td>
              <td>{new Intl.NumberFormat("en-DE").format(item.TongLuong)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default XemBangLuong;
