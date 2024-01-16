import React, { useState, useEffect, useRef, useContext } from "react";
import "./mistyles.css";
import Api from "../api/Api";
import moment from "moment";
import { AuthContext } from "../hook/AuthProvider";

const XemBaoCaoCPPKTheoThang = (props) => {
  const { user } = useContext(AuthContext);
  const [table, setTable] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const drugs = useRef();
  const materials = useRef();
  const [totalExpenses, setTotalExpenses] = useState();

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(
    user?.Loai === "ChuHeThong" ? "Tất cả" : user?.chinhanh
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.Loai === "ChuHeThong") await getBranches();
        await getDrugs();
        await getMaterials();
        CHAMCONG.current = await Api.getDocs(
          "/StaffManagement/getAll/ChamCong"
        );
        updateTable();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getBranches = async () => {
    const branches = await Api.getAllBranchs();
    setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
  };

  const getDrugs = async () => {
    if (user?.Loai === "ChuHeThong" && selectedBranch === "Tất cả")
      drugs.current = await Api.getDocs("/StatisticalReport/getAll/Thuoc");
    else
      drugs.current = await Api.getDocs(
        `/StatisticalReport/getByField/Thuoc/chiNhanh?fieldValue=${selectedBranch}`
      );
  };

  const getMaterials = async () => {
    if (user?.Loai === "ChuHeThong" && selectedBranch === "Tất cả")
      materials.current = await Api.getDocs("/StatisticalReport/getAll/VatTu");
    else
      materials.current = await Api.getDocs(
        `/StatisticalReport/getByField/VatTu/chiNhanh?fieldValue=${selectedBranch}`
      );
  };

  const updateTable = async () => {
    if (user?.Loai === "ChuHeThong") {
      await getDrugs();
      await getMaterials();
    }

    const salaries = await calSalary();
    const totalSalaryExpense = salaries.reduce((sum, salary) => {
      return sum + parseInt(salary.TongLuong);
    }, 0);

    const totalDrugExpense = drugs.current.reduce((sum, drug) => {
      if (drug.ngayNhap.startsWith(selectedMonth)) {
        return sum + parseInt(drug.donGiaNhap) * parseInt(drug.soLuongNhap);
      }
      return sum;
    }, 0);

    const totalMaterialExpense = materials.current.reduce((sum, material) => {
      if (material.ngayNhap.startsWith(selectedMonth)) {
        return (
          sum + parseInt(material.donGiaNhap) * parseInt(material.soLuongNhap)
        );
      }
      return sum;
    }, 0);

    const totalExpenses =
      totalDrugExpense + totalMaterialExpense + totalSalaryExpense;
    const expenseTable = [
      {
        tenChiPhi: "Tiền vật tư thiết bị",
        soTien: totalMaterialExpense,
        tyLe: parseFloat(
          ((totalMaterialExpense * 100) / totalExpenses).toFixed(1)
        ),
      },
      {
        tenChiPhi: "Tiền thuốc",
        soTien: totalDrugExpense,
        tyLe: parseFloat(((totalDrugExpense * 100) / totalExpenses).toFixed(1)),
      },
      {
        tenChiPhi: "Tiền lương nhân viên",
        soTien: totalSalaryExpense,
        tyLe: parseFloat(
          ((totalSalaryExpense * 100) / totalExpenses).toFixed(1)
        ),
      },
    ];
    setTable(expenseTable);
    setTotalExpenses(totalExpenses);
  };

  const CHAMCONG = useRef();

  const calSalary = async () => {
    const parsedDate = moment(selectedMonth, "YYYY-MM");
    const selectedyear = parsedDate.format("YYYY");
    const selectedmonth = parsedDate.format("M");

    const isFilterBranch =
      user?.Loai === "ChuHeThong" && selectedBranch === "Tất cả";

    const currentWorkTimesTable = CHAMCONG.current.find(
      (item) =>
        item.Thang == selectedmonth &&
        item.Nam == selectedyear &&
        (!isFilterBranch ? item.ChiNhanh === selectedBranch : 1)
    );
    //console.log(currentWorkTimesTable);
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

      const staffs = await Api.getAllStaffs();
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
      return result;
    } else return [];
  };

  return (
    <div style={{ color: "#FFF" }}>
      <div className="row">
        <div className="col-lg-5 col-md-8">
          <div className="mb-2">
            <b>Chi nhánh</b>
          </div>
          <select
            className="form-select pb-2 pt-2 mb-3"
            id="type"
            name="chiNhanh"
            onChange={(e) => setSelectedBranch(e.target.value)}
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
        </div>
        <div className="col-md-4">
          <div className="mb-2">
            <b>Chọn tháng, năm</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            type="month"
            id="month"
            placeholder="Chọn tháng năm"
            name="month"
            max={moment().format("YYYY-MM")}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <div className="text-end">
            <button
              type="submit"
              className="btn pb-2 pt-2 mb-3 btnGradient"
              onClick={updateTable}
            >
              Xem
            </button>
          </div>
        </div>
      </div>
      <div className="text-end">
        <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      </div>
      <table class="table table-dark">
        <thead style={{ verticalAlign: "middle" }}>
          <tr>
            <th>Tên chi phí</th>
            <th>Số tiền đã chi trả</th>
            <th>Tỷ lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.tenChiPhi}</td>
              <td>{new Intl.NumberFormat("en-DE").format(
                item.soTien
              )}</td>
              <td>{new Intl.NumberFormat("en-DE").format(
                item.tyLe
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <h1 class="noteVND" style={{ fontWeight: "bold", fontSize: "17px" }}>
          Tổng doanh thu: {totalExpenses ? new Intl.NumberFormat("en-DE").format(totalExpenses) : null}
        </h1>
      </div>
    </div>
  );
};

export default XemBaoCaoCPPKTheoThang;
