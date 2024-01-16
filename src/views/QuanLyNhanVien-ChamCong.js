import moment from "moment";
import { useState, useEffect, useRef, useContext } from "react";
import Api from "../api/Api";
import NotificationModal from "../components/NotificationModal";
import { AuthContext } from "../hook/AuthProvider";

const ChamCong = () => {
  const { user } = useContext(AuthContext);
  const BANGCHAMCONG = useRef();
  const [table, setTable] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [showNoti, setShowNoti] = useState(false);
  const [notiBody, setNotiBody] = useState("");
  const [branches, setBranches] = useState(user?.chinhanh || []);
  const [targetBranch, setTargetBranch] = useState("Tất cả");
  const [nhanvien, setNhanVien] = useState([]);

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

    const staffs = await Api.getAllStaffs();
    setNhanVien(staffs);
    const currentDate = new Date();
    BANGCHAMCONG.current = worktimes.find(
      (item) =>
        item.Thang == currentDate.getMonth() + 1 &&
        item.Nam == currentDate.getFullYear()
    );
    if (BANGCHAMCONG.current) {
      const result = [
        ...BANGCHAMCONG.current[selectedDate].filter((item) => {
          if (targetBranch === "Tất cả") return true;
          else {
            const find = staffs.find((nv) => nv.maNhanVien === item.MaNV);
            return find.chiNhanh === targetBranch;
          }
        }),
        // item in staffs that not in BANGCHAMCONG
        ...staffs
          .filter((item1) => {
            const item2 = BANGCHAMCONG.current[selectedDate].find(
              (item2) => item2.MaNV === item1.maNhanVien
            );

            return !item2;
          })
          .filter(
            (item) =>
              item.chiNhanh === targetBranch || targetBranch === "Tất cả"
          )
          .map((item1) => {
            return {
              MaNV: item1.maNhanVien,
              TenNV: item1.tenNhanVien,
              SoGioLam: 0,
            };
          }),
      ];
      setTable(result);
    } else {
      const currentDate = moment();
      const firstDayOfMonth = moment(currentDate).startOf("month");
      const lastDay = moment(currentDate).endOf("month");

      const chamcongthang = {
        Thang: currentDate.month() + 1,
        Nam: currentDate.year(),
      };
      for (
        let day = firstDayOfMonth;
        day.isSameOrBefore(lastDay);
        day.add(1, "day")
      ) {
        chamcongthang[day.format("YYYY-MM-DD")] = staffs.map((item) => ({
          MaNV: item.maNhanVien,
          TenNV: item.tenNhanVien,
          SoGioLam: 0,
          ChiNhanh: user?.chinhanh,
        }));
      }
      const id = await Api.addDoc(
        "/StaffManagement/add/ChamCong",
        chamcongthang
      );
      setTable(chamcongthang[selectedDate]);
      BANGCHAMCONG.current = { ...chamcongthang, Id: id };
    }
  };

  const handleChange = (e, row) => {
    setTable(
      table.map((item) =>
        item.MaNV === row.MaNV
          ? {
            ...item,
            SoGioLam: e.target.value,
          }
          : item
      )
    );
  };

  const onSave = async () => {
    console.log(table);
    BANGCHAMCONG.current[selectedDate] = table;
    console.log(BANGCHAMCONG.current);
    const endpoint =
      "/StaffManagement/ChamCong/update/" + BANGCHAMCONG.current.Id;
    const success = await Api.updateDoc(endpoint, BANGCHAMCONG.current);
    if (success) {
      setNotiBody("Đã lưu thành công!");
      setShowNoti(true);
    }
  };

  const onSee = async () => {
    if (
      new Date(selectedDate).getMonth() == new Date().getMonth() &&
      new Date(selectedDate).getFullYear() == new Date().getFullYear()
    ) {
      const result = [
        ...BANGCHAMCONG.current[selectedDate].filter((item) => {
          if (targetBranch === "Tất cả") return true;
          else {
            const find = nhanvien.find((nv) => nv.maNhanVien === item.MaNV);
            return find.chiNhanh === targetBranch;
          }
        }),
        // item in staffs that not in BANGCHAMCONG
        ...nhanvien
          .filter((item1) => {
            const item2 = BANGCHAMCONG.current[selectedDate].find(
              (item2) => item2.MaNV === item1.maNhanVien
            );

            return !item2;
          })
          .filter(
            (item) =>
              item.chiNhanh === targetBranch || targetBranch === "Tất cả"
          )
          .map((item1) => {
            return {
              MaNV: item1.maNhanVien,
              TenNV: item1.tenNhanVien,
              SoGioLam: 0,
            };
          }),
      ];
      setTable(result);
      // setTable(BANGCHAMCONG.current[selectedDate]);
    }
  };

  const isNumberPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) {
    } else {
      const validKeyForPayment = ["-", "."];
      if (validKeyForPayment.includes(e.key)) {
        e.preventDefault();
      }
    }
  };
  const isNumberCopy = (e) => {
    let data = e.clipboardData.getData("text");
    if (data.match(/[^\d]/)) {
      e.preventDefault();
    }
  };
  return (
    <div style={{ color: "#FFF" }}>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-2"><b>Ngày</b></div>
          <input
            type="date"
            className="form-control pb-2 pt-2 mb-2"
            id="Ngay"
            name="Ngay"
            min={moment().startOf("month").format("YYYY-MM-DD")}
            max={moment().format("YYYY-MM-DD")}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
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
          <div className="text-end mt-3">
            <button
              type="submit"
              className="btn pb-2 pt-2 btnGradient"
              onClick={onSee}
            >
              Xem
            </button>
          </div>
        </div>
      </div>
      <table className="table table-dark">
        <thead>
          <tr>
            <th>Mã nhân viên</th>
            <th>Họ và tên</th>
            <th>Số giờ làm</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, idx) => {
            return (
              <tr>
                <td>{row.MaNV}</td>
                <td>{row.TenNV}</td>
                <td>
                  <input
                    className="signature"
                    type="text"
                    value={row.SoGioLam}
                    onChange={(e) => handleChange(e, row)}
                    onKeyDown={isNumberPress}
                    onPaste={isNumberCopy}
                    style={{ backgroundColor: "#212529", color: "#FFF" }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-end">
        <button
          type="submit"
          className="btn pb-2 pt-2 mt-2 btnGradient"
          onClick={onSave}
        >
          Lưu
        </button>
      </div>
      <NotificationModal
        show={showNoti}
        onHide={() => setShowNoti(false)}
        title="LOGOIPSUM"
        message={notiBody}
      />
    </div>
  );
};
export default ChamCong;
