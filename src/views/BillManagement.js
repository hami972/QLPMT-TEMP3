import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import moment, { min } from "moment";
import api from "../api/Api";
import Select from "react-select";
import { AuthContext } from "../hook/AuthProvider";

const BillManagement = (props) => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [CTHSDT, setCTHSDT] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [maGiamGia, setMaGiamGia] = useState([]);
  const [recentDiscount, setRecentDiscount] = useState("");
  const [ThanhTienSauGiamGia, setTTSGG] = useState(0);
  const [SoTienGiam, setSoTienGiam] = useState(0);
  const [conNo, setConNo] = useState(0);
  const [noSauThanhToan, setNoSauThanhToan] = useState(0);
  const [disableDiscount, setDisaleDiscount] = useState(true);
  const [patient, setPatient] = useState();
  const [traGop, setTraGop] = useState(false);
  const [minimum, setMinimum] = useState(0);
  const [recentStaff, setRecentStaff] = useState({
    maNhanVien: "",
    tenNhanVien: "",
  });
  const [searchCriteria, setSearchCriteria] = useState({
    maHoaDon: "",
    maBenhNhan: "",
    tenBenhNhan: "",
    ngayLap: "",
    tinhTrang: "",
  });

  var TongTienDT = 0;
  var TongTienThuoc = 0;
  var TongTienDV = 0;

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const setSelectedRowById = async (id, cthsdtId) => {
    setSelectedRow(id);
    await getCTHSDT(id, cthsdtId);
    setPage(2);
  };
  const [page, setPage] = useState(1);
  const nextPage = () => {
    setPage(page + 1);
    window.scrollTo(0, 0);
  };
  const prevPage = () => {
    // // alert("presv");
    // if (!disableDiscount) {
    //   // document.getElementById("maGiamGia").value = "";
    //   // setSoTienGiam(0);
    //   setRecentDiscount(null);
    // }

    setPage(page - 1);
    window.scrollTo(0, 0);
  };

  const getBills = async () => {
    const bills = await api.getAllBills();
    const fil = bills.filter(
      (item, idx) => item.tenChiNhanh === user?.chinhanh
    );
    setBills(fil);
  };

  const getStaffs = async () => {
    const staffs = await api.getAllStaffs();
    const fil = staffs.filter(
      (item, idx) => item.tenChiNhanh === user?.chinhanh
    );
    setStaffs(fil);
  };

  const getDiscounts = async () => {
    const discounts = await api.getAllDiscounts();
    const discountsFilter = discounts.filter((discount) => {
      const dateBD = new Date(discount.TGBatDau);
      let dateKT = new Date(discount.TGKetThuc);
      dateKT.setHours(23);
      dateKT.setMinutes(59);

      const matchDateBD = !(dateBD > new Date());
      const matchDateKT = !(dateKT < new Date());
      return matchDateBD && matchDateKT;
    });
    setMaGiamGia(discountsFilter);
  };

  const getCTHSDT = async (id, cthsdtId) => {
    console.log(bills[selectedRow]?.dsThanhToan);
    let minimumTemp = 0;
    let traGop1 = false;
    let CTHSDT = await api.getTreatmentRecordDetailById(cthsdtId);
    let pt = await api.getPatientData(bills[id].IdBenhNhan);
    setPatient(pt);
    const status = bills[id].tinhTrang;
    const Id = bills[id].Id;
    TongTienDT = 0;
    CTHSDT.DichVu.map((item, index) => {
      if (!item.taiKham) TongTienDV += parseInt(item.DonGia * item.SL);
      if (item.coTraGop == "Có") {
        traGop1 = true;
      } else {
        minimumTemp += item.DonGia * item.SL;
      }
      return 0;
    });
    setTraGop(traGop1);
    CTHSDT.Thuoc.map((item, index) => {
      TongTienThuoc += parseInt(item.donGia * item.SL);
      minimumTemp += item.donGia * item.SL;
      return 0;
    });
    TongTienDT = TongTienDV + TongTienThuoc;
    setMinimum(minimumTemp);

    if (status == "Chưa thanh toán") {
      setConNo(pt.congNo);
      setTTSGG(TongTienDT);
      if (!traGop1) {
        setNoSauThanhToan(pt.congNo);
      } else {
        setNoSauThanhToan(pt.congNo + TongTienDV + TongTienThuoc);
      }
      setSoTienGiam((TongTienDV * recentDiscount.phanTram) / 100);
      setDisaleDiscount(false);
    } else {
      let newBill = bills[id];
      setConNo(pt.congNo);
      setTTSGG(TongTienDT - (TongTienDV * newBill.phanTram) / 100);
      setSoTienGiam((TongTienDV * newBill.phanTram) / 100);
      if (!traGop1) {
        setNoSauThanhToan(pt.congNo);
      } else {
        setNoSauThanhToan(pt.congNo);
      }

      setDisaleDiscount(true);
      setRecentDiscount({
        maGiamGia: newBill.maGiamGia,
        phanTram: newBill.phanTram,
      });
      setRecentStaff({
        maNhanVien: newBill.maNhanVien,
        tenNhanVien: newBill.tenNhanVien,
      });
    }
    setCTHSDT(CTHSDT);
  };

  const validSubmitData = () => {
    if (bills[selectedRow]?.tinhTrang === "Đã thanh toán") {
      if (traGop) {
        const soTienThanhToan =
          document.getElementById("soTienDaThanhToan").value;
        const matchSoTienThanhToan =
          soTienThanhToan != "" &&
          soTienThanhToan <= patient.congNo &&
          soTienThanhToan > 0;
        if (!matchSoTienThanhToan)
          alert(
            "Vui lòng nhập số tiền thanh toán lớn hơn " +
            0 +
            " và không vượt quá " +
            patient.congNo
          );
        return matchSoTienThanhToan;
      } else return true;
    }
    if (traGop) {
      const soTienThanhToan =
        document.getElementById("soTienDaThanhToan").value;
      const matchSoTienThanhToan =
        soTienThanhToan != "" &&
        soTienThanhToan >= minimum &&
        soTienThanhToan <= TongTienDV + TongTienThuoc - SoTienGiam;
      if (!matchSoTienThanhToan)
        alert(
          "Vui lòng nhập số tiền thanh toán ít nhất " +
          minimum +
          " và không vượt quá " +
          (TongTienDV + TongTienThuoc - SoTienGiam)
        );
      return matchSoTienThanhToan;
    } else return true;
  };

  const handleSubmit = async () => {
    const choice = window.confirm("Xác nhận thanh toán?");
    if (choice) {
      if (validSubmitData()) {
        const newBill = bills[selectedRow] || null;
        const Id = newBill.Id;
        if (traGop) {
          newBill.daThanhToan =
            parseInt(newBill.daThanhToan) +
            parseInt(document.getElementById("soTienDaThanhToan").value);
          const thanhtoan = {
            ngayThanhToan: moment().format("YYYY-MM-DD"),
            tienThanhToan: parseInt(
              document.getElementById("soTienDaThanhToan").value
            ),
          };
          let dsThanhToan = newBill.dsThanhToan || [];
          if (
            dsThanhToan == undefined ||
            dsThanhToan == null ||
            dsThanhToan.length == 0
          ) {
            dsThanhToan = [];
          }
          dsThanhToan.push(thanhtoan);
          newBill.dsThanhToan = dsThanhToan;
          newBill.ngayLap = thanhtoan.ngayThanhToan;
          let pt = patient;
          pt.congNo = noSauThanhToan;
          setPatient(pt);
          await api.updatePatient(pt, newBill.IdBenhNhan);
        } else {
          newBill.daThanhToan = ThanhTienSauGiamGia;
          const thanhtoan = {
            // ngayThanhToan: new Date(
            //   new Date().getFullYear(),
            //   new Date().getMonth() + 1,
            //   new Date().getDay()
            // )
            //   .toISOString()
            //   .slice(0, 10),
            ngayThanhToan: moment().format("YYYY-MM-DD"),
            tienThanhToan: ThanhTienSauGiamGia,
          };

          console.log(thanhtoan.ngayThanhToan + ' 2')

          let dsThanhToan = newBill.dsThanhToan;
          if (
            dsThanhToan == undefined ||
            dsThanhToan == null ||
            dsThanhToan.length == 0
          ) {
            dsThanhToan = [];
          }
          dsThanhToan.push(thanhtoan);
          newBill.dsThanhToan = dsThanhToan;
          newBill.ngayLap = thanhtoan.ngayThanhToan;
        }

        if (!disableDiscount) {
          newBill.maGiamGia = recentDiscount.maGiamGia || "";
          newBill.phanTram = recentDiscount.phanTram || 0;
          newBill.maNhanVien = user?.maNV;
          newBill.tenNhanVien = user?.ten;
        }
        newBill.tinhTrang = "Đã thanh toán";
        const pte = patient;
        newBill.tuoi = Math.abs(
          new Date(
            Date.now() - new Date(pte.NgaySinh).getTime()
          ).getUTCFullYear() - 1970
        );
        await api.updateBill(newBill, Id);
        let updatedBills = bills.map((currRow, idx) => {
          if (idx !== selectedRow) return currRow;
          return newBill;
        });
        let pt = patient;
        setBills(updatedBills);
        setDisaleDiscount(true);
        setRecentDiscount(null);
        setRecentStaff(null);
        setConNo(noSauThanhToan);
        alert("Lưu thành công");
      }
    }
  };

  const onSearch = async () => {
    const searchResults = await api.getBillsBySearch(searchCriteria);
    setBills(searchResults);
  };

  useEffect(() => {
    getBills();
    getStaffs();
    getDiscounts();
  }, []);

  useEffect(() => { }, [selectedRow]);

  useEffect(() => {
    if (!disableDiscount) {
      setSoTienGiam((TongTienDV * recentDiscount.phanTram) / 100 || 0);
      setTTSGG(
        TongTienDV +
        TongTienThuoc -
        ((TongTienDV * recentDiscount.phanTram) / 100 || 0)
      );
      setConNo(patient.congNo);
      if (traGop) {
        setNoSauThanhToan(patient.congNo + ThanhTienSauGiamGia);
        document.getElementById("soTienDaThanhToan").value = 0;
      }
    }
  }, [recentDiscount]);

  return (
    <div>
      <div style={{ minHeight: "630px" }}>
        {page === 1 ? (
          <div>
            <div className="row">
              <div className="row ms-0 me-0" style={{ fontWeight: "500" }}>
                <div className="col-md-6">
                  <div className="mb-2 col-md-6">Mã hóa đơn</div>
                  <input
                    type="text"
                    className="form-control pb-2 pt-2 mb-2"
                    id="maHoaDon"
                    name="maHoaDon"
                    onChange={handleChange}
                    value={searchCriteria.maHoaDon}
                  />
                </div>
                <div className="col-md-6">
                  <div className="mb-2 col-md-6">Mã bệnh nhân</div>
                  <input
                    type="text"
                    className="form-control pb-2 pt-2 mb-2"
                    id="maBenhNhan"
                    name="maBenhNhan"
                    onChange={handleChange}
                    value={searchCriteria.maBenhNhan}
                  />
                </div>
                <div className="col-md-6">
                  <div className="mb-2">Tên bệnh nhân</div>
                  <input
                    type="text"
                    className="form-control pb-2 pt-2 mb-2"
                    id="tenBenhNhan"
                    name="tenBenhNhan"
                    onChange={handleChange}
                    value={searchCriteria.tenBenhNhan}
                  />
                </div>
                <div className="col-md-6">
                  <div className="mb-2">Ngày lập</div>
                  <input
                    type="date"
                    className="form-control pb-3 pt-3"
                    id="ngayLap"
                    name="ngayLap"
                    value={searchCriteria.ngayLap}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <div className="mb-2">Tình trạng</div>
                  <select
                    className="form-select pb-2 pt-2 mb-2"
                    aria-label="Chọn tình trạng"
                    id="tinhTrang"
                    name="tinhTrang"
                    onChange={handleChange}
                    value={searchCriteria.tinhTrang}
                  >
                    <option value="">Tất cả</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                  </select>
                </div>
                <div className="text-end">
                  <button
                    type="submit"
                    className="btn pb-2 pt-2 mt-2"
                    onClick={onSearch}
                    style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>

            <table className="table">
              <thead style={{ verticalAlign: "middle" }}>
                <tr className="table-secondary">
                  <th>Mã hóa đơn</th>
                  <th>Mã bệnh nhân</th>
                  <th>Tên bệnh nhân</th>
                  <th>Ngày lập</th>
                  <th>Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((item, index) => (
                  <tr
                    key={item.Id}
                    onClick={() => setSelectedRowById(index, item.maCTHSDT)}
                  >
                    <td>{item.maHoaDon}</td>
                    <td>{item.maBenhNhan}</td>
                    <td>{item.tenBenhNhan}</td>
                    <td>{moment(new Date(item.ngayLap)).format("DD/MM/YYYY")}</td>
                    <td
                      style={{
                        fontStyle: "italic",
                        color:
                          item.tinhTrang === "Đã thanh toán"
                            ? "#269A6C"
                            : "#B74141",
                      }}
                    >
                      {item.tinhTrang}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {page === 2 ? (
          <div>
            <div className="row">
              <div className="col-md-auto">
                <img alt="" src="/images/logo3.png" />
              </div>
              <div className="col">
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  NHA KHOA LOGOIPSUM
                </div>
                <div>
                  <span style={{ fontWeight: "600" }}>Địa chỉ:</span> 2 Lô E,
                  KD5, Dương Bá Trạc, Phường 1, quận 8, HCM
                </div>
                <div>
                  <span style={{ fontWeight: "600" }}>SĐT:</span> 0843593598
                </div>
                <div>
                  <span style={{ fontWeight: "600" }}>Email:</span>{" "}
                  logoipsum@gmail.com
                </div>
              </div>
            </div>
            <div className="mt-2 pe-2 ps-2">
              <div
                align="center"
                style={{ fontSize: "25px", fontWeight: "bold" }}
              >
                HÓA ĐƠN
              </div>
              <div

                align="center"
                style={{
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: "#6b6b6b",
                }}
              >
                Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
                {moment().year()}
              </div>
              <div className="mt-3 row">
                <div className='col-lg-4 col-md-auto mb-2'>
                  <span style={{ fontWeight: "600" }}>Mã hóa đơn: </span>
                  {bills[selectedRow]?.maHoaDon}
                </div>
                <div className='col-lg-4 col-md-auto mb-2'>
                  <span style={{ fontWeight: "600" }}>Mã BN: </span>
                  {bills[selectedRow]?.maBenhNhan}
                </div>
                <div className='col-lg-4 col-md-auto mb-2'>
                  <span style={{ fontWeight: "600" }}>Tên BN: </span>
                  {bills[selectedRow]?.tenBenhNhan}
                </div>
                <div className='col-lg-4 col-md-auto mb-2'>
                  <span style={{ fontWeight: "600" }}>Tên NS: </span>
                  {CTHSDT !== null ? CTHSDT.TenNhaSi : ""}
                </div>
                <div className='mb-2'>
                  <span style={{ fontWeight: "600" }}>Địa chỉ: </span>
                  {bills[selectedRow]?.DiaChi}
                </div>
                <div className='col-lg-4 col-md-auto mb-2'>
                  <span style={{ fontWeight: "600" }}>Tuổi: </span>
                  {Math.abs(
                    new Date(
                      Date.now() - new Date(patient?.NgaySinh).getTime()
                    ).getUTCFullYear() - 1970
                  )}
                </div>
                <div className='col-lg-4 col-md-auto mb-2'>
                  <span style={{ fontWeight: "600" }}>Giới tính: </span>
                  {bills[selectedRow]?.GioiTinh}
                </div>
                <div className='col-lg-4 col-md-auto mb-2'>
                  <span style={{ fontWeight: "600" }}>Số điện thoại: </span>
                  {bills[selectedRow]?.soDienThoai}
                </div>
              </div>

              <table className="table">
                <thead style={{ verticalAlign: "middle" }}>
                  <tr className="table-secondary">
                    <th>Dịch vụ</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Có trả góp hay không</th>
                    <th>Tái khám</th>
                  </tr>
                </thead>
                <tbody>
                  {CTHSDT !== null ? (
                    CTHSDT.DichVu.map((item, index) => {
                      TongTienDV += parseInt(item.DonGia * item.SL);
                      return (
                        <tr
                          key={item.Id}
                        >
                          <td>{item.tenDichVu}</td>
                          {item.taiKham ? (
                            <td>0</td>
                          ) : (
                            <td>
                              {new Intl.NumberFormat("en-DE").format(
                                item.DonGia
                              )}
                            </td>
                          )}
                          <td>{item.SL}</td>
                          <td>{item.coTraGop}</td>
                          {item.taiKham ? <td>Có</td> : <td>Không</td>}
                        </tr>
                      );
                    })
                  ) : (
                    <tr></tr>
                  )}
                </tbody>
              </table>
              <div style={{ fontSize: "18px" }}>
                <b>
                  Tổng tiền điều trị:{" "}
                  {new Intl.NumberFormat("en-DE").format(TongTienDV)}
                </b>
              </div>
              <div
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                ĐƠN THUỐC
              </div>
              <table className="table table-borderless">
                <tbody>
                  {CTHSDT !== null ? (
                    CTHSDT.Thuoc.map((item, index) => {
                      TongTienThuoc += parseInt(item.donGia * item.SL);
                      return (
                        <tr key={index}>
                          <td>
                            <div>
                              <div>
                                <b>
                                  {index + 1}/ {item.tenThuoc}
                                </b>
                              </div>
                              <div
                                className="ms-3"
                                style={{ fontStyle: "italic" }}
                              >
                                {item.GhiChu}
                              </div>
                            </div>
                          </td>
                          <td>{item.SL} viên</td>
                          <td>
                            {new Intl.NumberFormat("en-DE").format(item.donGia)}
                            /viên
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr></tr>
                  )}
                </tbody>
              </table>
              <div style={{ fontSize: "18px" }}>
                <b>
                  Tổng tiền thuốc:{" "}
                  {new Intl.NumberFormat("en-DE").format(TongTienThuoc)}
                </b>
              </div>

              <div>
                <table className="table table-borderless">
                  <tbody>
                    {bills[selectedRow]?.dsThanhToan !== undefined ? (
                      bills[selectedRow].dsThanhToan?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div>
                                <div>
                                  <b>
                                    {index + 1}/{" "}
                                    {"Thanh toán lần " + (index + 1)}
                                  </b>
                                </div>
                                <div
                                  className="ms-3"
                                  style={{ fontStyle: "italic" }}
                                ></div>
                              </div>
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-DE").format(
                                item.tienThanhToan
                              )}
                            </td>
                            <td>{"Ngày thanh toán: " + item.ngayThanhToan}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-3">
                <table
                  className="table table-borderless table-sm"
                  style={{
                    fontSize: "18px",
                    borderSpacing: 0,
                    borderCollapse: "separate",
                  }}
                >
                  <tbody>
                    <tr>
                      <th>Thành tiền:</th>
                      <th>
                        {new Intl.NumberFormat("en-DE").format(
                          TongTienDV + TongTienThuoc
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th>Mã giảm giá:</th>
                      <th>
                        {disableDiscount ? (
                          <Select
                            styles={{ minWidth: "500px" }}
                            value={recentDiscount}
                            isDisabled
                            onChange={(value) =>
                              value !== null &&
                                traGop &&
                                bills[selectedRow].tinhTrang == "Chưa thanh toán"
                                ? (setSoTienGiam(
                                  (TongTienDV * value.phanTram) / 100
                                ),
                                  setTTSGG(
                                    TongTienDV +
                                    TongTienThuoc -
                                    (TongTienDV * value.phanTram) / 100
                                  ),
                                  setConNo(
                                    patient.congNo +
                                    TongTienDV +
                                    TongTienThuoc -
                                    (TongTienDV * value.phanTram) / 100
                                  ),
                                  setNoSauThanhToan(
                                    patient.congNo +
                                    TongTienDV +
                                    TongTienThuoc -
                                    (TongTienDV * value.phanTram) / 100
                                  ),
                                  setRecentDiscount(value))
                                : value !== null &&
                                  traGop &&
                                  bills[selectedRow].tinhTrang ==
                                  "Đã thanh toán"
                                  ? (setSoTienGiam(
                                    (TongTienDV * value.phanTram) / 100
                                  ),
                                    setTTSGG(
                                      TongTienDV +
                                      TongTienThuoc -
                                      (TongTienDV * value.phanTram) / 100
                                    ),
                                    setConNo(patient.congNo),
                                    setNoSauThanhToan(patient.congNo),
                                    setRecentDiscount(value))
                                  : value !== null && !traGop
                                    ? (setSoTienGiam(
                                      (TongTienDV * value.phanTram) / 100
                                    ),
                                      setTTSGG(
                                        TongTienDV +
                                        TongTienThuoc -
                                        (TongTienDV * value.phanTram) / 100
                                      ),
                                      setConNo(patient.congNo),
                                      setNoSauThanhToan(patient.congNo),
                                      setRecentDiscount(value))
                                    : setRecentDiscount("")
                            }
                            options={maGiamGia}
                            id="maGiamGia"
                            getOptionLabel={(item) => item.maGiamGia}
                            getOptionValue={(item) => item}
                            placeholder={bills[selectedRow]?.maGiamGia}
                          />
                        ) : (
                          <Select
                            value={recentDiscount}
                            onChange={(value) =>
                              value !== null
                                ? (setSoTienGiam(
                                  (TongTienDV * value.phanTram) / 100
                                ),
                                  setTTSGG(
                                    TongTienDV +
                                    TongTienThuoc -
                                    (TongTienDV * value.phanTram) / 100
                                  ),
                                  setConNo(patient.congNo),
                                  setRecentDiscount(value))
                                : setRecentDiscount("")
                            }
                            options={maGiamGia}
                            id="maGiamGia"
                            getOptionLabel={(item) => item.maGiamGia}
                            getOptionValue={(item) => item}
                            placeholder=""
                          />
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th>Số tiền giảm:</th>
                      <th>
                        {SoTienGiam ? new Intl.NumberFormat("en-DE").format(SoTienGiam) : null}
                      </th>
                    </tr>
                    <tr>
                      <th>Thành tiền sau khi giảm:</th>
                      <th>
                        {new Intl.NumberFormat("en-DE").format(
                          ThanhTienSauGiamGia
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th>Công nợ trước thanh toán:</th>
                      <th>{new Intl.NumberFormat("en-DE").format(conNo)}</th>
                    </tr>
                    <tr>
                      <th>Số tiền đã thanh toán:</th>
                      <th>
                        {traGop ? (
                          <input
                            type="number"
                            className="signature"
                            id="soTienDaThanhToan"
                            name="soTienDaThanhToan"
                            size={1}
                            onChange={(value) => {
                              if (traGop) {
                                if (
                                  bills[selectedRow]?.tinhTrang ==
                                  "Chưa thanh toán" &&
                                  document.getElementById("soTienDaThanhToan")
                                    .value != ""
                                ) {
                                  setNoSauThanhToan(
                                    patient.congNo +
                                    ThanhTienSauGiamGia -
                                    parseInt(
                                      document.getElementById(
                                        "soTienDaThanhToan"
                                      ).value || 0,
                                      0
                                    )
                                  );
                                } else if (
                                  bills[selectedRow]?.tinhTrang ==
                                  "Chưa thanh toán"
                                ) {
                                  setNoSauThanhToan(
                                    patient.congNo + ThanhTienSauGiamGia
                                  );
                                } else if (
                                  document.getElementById("soTienDaThanhToan")
                                    .value != ""
                                ) {
                                  setNoSauThanhToan(
                                    patient.congNo -
                                    parseInt(
                                      document.getElementById(
                                        "soTienDaThanhToan"
                                      ).value,
                                      0
                                    )
                                  );
                                } else {
                                  setNoSauThanhToan(patient.congNo);
                                }
                              }
                            }}
                            placeholder=""
                            min={minimum}
                            max={TongTienDT - SoTienGiam}
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              fontWeight: "bold",
                            }}
                          />
                        ) : (
                          <label>
                            {new Intl.NumberFormat("en-DE").format(
                              ThanhTienSauGiamGia
                            )}
                          </label>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th> Công nợ sau thanh toán:</th>
                      <th>
                        {new Intl.NumberFormat("en-DE").format(noSauThanhToan)}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-4">
                <div style={{ fontSize: "19px" }}><b>NHÂN VIÊN THỰC HIỆN</b></div>
                <div style={{ height: "50px" }}></div>
                <div className='mt-5 text-uppercase' style={{ fontSize: "19px" }}>
                  <b>{user?.ten}</b>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn pb-2 pt-2 mt-3 mb-3"
                  style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="text-end">
        {page !== 1 ? (
          <button
            type="button"
            className="btn"
            style={{ border: "none" }}
            onClick={() => prevPage()}
          >
            <i className="fa-solid fa-chevron-left next_prevBtn"></i>
          </button>
        ) : (
          <button className="btn" style={{ border: "none" }}>
            <i className="fa-solid fa-chevron-left next_prevBtn_disabled"></i>
          </button>
        )}
        {page !== 2 && selectedRow !== null ? (
          <button
            type="button"
            className="btn"
            style={{ border: "none" }}
            onClick={() => nextPage()}
          >
            <i className="fa-solid fa-chevron-right next_prevBtn"></i>
          </button>
        ) : (
          <button className="btn" style={{ border: "none" }}>
            <i className="fa-solid fa-chevron-right next_prevBtn_disabled"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default BillManagement;
