import React, { useState, useEffect, useRef, useContext } from "react";
import "./mistyles.css";
import Api from "../api/Api";
import { AuthContext } from "../hook/AuthProvider";

const XemBaoCaoTheoNam = (props) => {
  const { user } = useContext(AuthContext);
  const [table, setTable] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const bills = useRef();
  const tcDetails = useRef();
  const treatmentRecords = useRef();
  const [totalRevenue, setTotalRevenue] = useState();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(
    user?.Loai === "ChuHeThong" ? "Tất cả" : user?.chinhanh
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.Loai === "ChuHeThong") await getBranches();
        await getBills();
        await getTreatmentRecordDetails();
        await getTreatmentRecords();
        updateTable();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getBills = async () => {
    if (user?.Loai === "ChuHeThong" && selectedBranch === "Tất cả")
      bills.current = await Api.getDocs(`/StatisticalReport/getAll/HoaDon`);
    else
      bills.current = await Api.getDocs(
        `/StatisticalReport/getByField/HoaDon/tenChiNhanh?fieldValue=${selectedBranch}`
      );
  };
  const getTreatmentRecordDetails = async () => {
    tcDetails.current = await Api.getDocs(
      "/StatisticalReport/getAll/ChiTietHSDT"
    );
  };

  const getTreatmentRecords = async () => {
    treatmentRecords.current = await Api.getDocs(
      "/StatisticalReport/getAll/HoSoDieuTri"
    );
  };

  const getBranches = async () => {
    const branches = await Api.getAllBranchs();
    setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
  };

  const updateTable = async () => {
    if (user?.Loai === "ChuHeThong") await getBills();

    const revenueTable = [];
    if (bills.current.length !== 0) {
      bills.current.forEach(async (bill) => {
        if (Array.isArray(bill.dsThanhToan))
          bill.dsThanhToan?.forEach((item, index) => {
            if (item.ngayThanhToan?.startsWith(selectedYear)) {
              let CTHSDT = tcDetails.current.find(
                (item) => item.Id === bill.maCTHSDT
              );
              let HSDT = treatmentRecords.current.find(
                (item) => item.Id === CTHSDT.IDhsdt
              );
              revenueTable.push({
                thang: new Date(item.ngayThanhToan).getMonth() + 1,
                soLuongCaThucHien: index === 0 ? 1 : 0,
                soDichVuThucHien: index === 0 ? CTHSDT.DichVu.length : 0,
                maBN: index === 0 ? HSDT.IDBenhNhan : null,
                tienTT: parseInt(item.tienThanhToan),
              });
            }
          });

        const revenueSummary = {};

        const tongDoanhThu = revenueTable.reduce(
          (total, row) => total + row.tienTT,
          0
        );
        revenueTable.forEach((item) => {
          const { thang, soLuongCaThucHien, soDichVuThucHien, maBN, tienTT } =
            item;

          // Kiểm tra xem tháng đã được thêm vào bảng thống kê chưa
          if (!revenueSummary[thang]) {
            revenueSummary[thang] = {
              thang: thang,
              soLuongCaThucHien: 0,
              soDichVuThucHien: 0,
              soBenhNhan: 0,
              doanhThu: 0,
              tyLe: 0,
            };
          }

          revenueSummary[thang].soLuongCaThucHien += soLuongCaThucHien;
          revenueSummary[thang].soDichVuThucHien += soDichVuThucHien;

          // Kiểm tra xem bệnh nhân đã được tính vào bảng thống kê chưa
          if (maBN !== null) {
            if (!revenueSummary[thang][maBN]) {
              revenueSummary[thang].soBenhNhan += 1;
              revenueSummary[thang][maBN] = true;
            }
          }

          revenueSummary[thang].doanhThu += tienTT;
          revenueSummary[thang].tyLe =
            (revenueSummary[thang].doanhThu * 100) / tongDoanhThu;
          revenueSummary[thang].tyLe = parseFloat(
            revenueSummary[thang].tyLe.toFixed(1)
          );
        });

        // Chuyển đối tượng thành mảng
        const result = Object.values(revenueSummary);

        setTable(result);
        setTotalRevenue(tongDoanhThu);
      });
    } else {
      setTable([]);
      setTotalRevenue(0);
    }
  };

  return (
    <div>
      <div class="row">
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
            <b>Chọn năm</b>
          </div>
          <input
            type="number"
            min="2010"
            max="2024"
            step="1"
            value={selectedYear}
            id="year"
            placeholder="Chọn năm bắt đầu"
            name="year"
            onChange={(e) => setSelectedYear(e.target.value)}
            className="form-control pb-2 pt-2 mb-3"
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
            <th>Tháng</th>
            <th>Số ca thực hiện</th>
            <th>Số dịch vụ thực hiện</th>
            <th>Số bệnh nhân</th>
            <th>Tổng doanh thu</th>
            <th>Tỷ lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.thang}</td>
              <td>{item.soLuongCaThucHien}</td>
              <td>{item.soDichVuThucHien}</td>
              <td>{item.soBenhNhan}</td>
              <td>{new Intl.NumberFormat("en-DE").format(
                item.doanhThu
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
          Tổng doanh thu: {totalRevenue ? new Intl.NumberFormat("en-DE").format(totalRevenue) : null}
        </h1>
      </div>
    </div>
  );
};

export default XemBaoCaoTheoNam;
