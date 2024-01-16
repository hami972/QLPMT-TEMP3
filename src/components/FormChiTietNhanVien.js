import React, { useState, useEffect, useContext } from "react";
import api from "../api/Api";
import { AuthContext } from "../hook/AuthProvider";

export const FormChiTietNhanVien = ({
  closeModal,
  onSubmit,
  defaultValue,
  staffs,
}) => {
  const { user } = useContext(AuthContext);
  const [formState, setFormState] = useState(
    defaultValue || {
      maNhanVien: "",
      tenNhanVien: "",
      soDienThoai: "",
      chucVu: "Nha sĩ",
      email: "",
      luongCoBan: "",
      chiNhanh: "",
      bangCap: "",
      kinhNghiem: "",
    }
  );
  const [errors, setErrors] = useState("");
  const [branches, setBranches] = useState([]);
  const [positions, setPositions] = useState([
    "Nha sĩ",
    "Phụ tá",
    "Quản lý",
    "Tiếp tân",
  ]);
  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    const branches = await api.getAllBranchs();
    setBranches(branches);
    if (!defaultValue) formState.chiNhanh = branches[0].tenChiNhanh;
  };
  const validateForm = () => {
    console.log(formState);
    if (
      formState.maNhanVien != "" &&
      formState.tenNhanVien != "" &&
      formState.soDienThoai != "" &&
      formState.chucVu != "" &&
      formState.email != "" &&
      formState.chiNhanh != ""
    ) {
      const isIdExists = staffs.some(
        (staff) => staff.maNhanVien == formState.maNhanVien
      );
      if (
        !defaultValue &&
        defaultValue.maNhanVien != formState.maNhanVien &&
        isIdExists
      ) {
        setErrors(
          "Mã nhân viên này đã tồn tại! Vui lòng nhập một mã nhân viên khác."
        );
        return false;
      } else {
        setErrors("");
        return true;
      }
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (value == "") {
          switch (key) {
            case "maNhanVien":
              errorFields.push("Mã nhân viên");
              break;
            case "tenNhanVien":
              errorFields.push("Tên nhân viên");
              break;
            case "soDienThoai":
              errorFields.push("Số điện thoại");
              break;
            case "email":
              errorFields.push("Email");
              break;
            case "luongCoBan":
              errorFields.push("Lương cơ bản");
              break;
            default:
              break;
          }
        }
      }
      setErrors("Vui lòng nhập: " + errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formState);

    closeModal();
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
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="col-sm-4 modal1" style={{ overflow: "auto", height: "80%" }}>
        <form>
          <div className="mb-2"><b>Mã nhân viên</b></div>
          <input
            name="maNhanVien"
            type="text"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.maNhanVien}
          />
          <div className="mb-2"><b>Họ và tên</b></div>
          <input
            name="tenNhanVien"
            type="text"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            value={formState.tenNhanVien}
          />
          <div className="mb-2"><b>Số điện thoại</b></div>
          <input
            name="soDienThoai"
            onChange={handleChange}
            type="number"
            value={formState.soDienThoai}
            className="form-control pb-2 pt-2 mb-2"
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          <div className="mb-2"><b>Email</b></div>
          <input
            name="email"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.email}
          />
          <div className="mb-2"><b>Chức vụ</b></div>
          <select
            name="chucVu"
            className="form-select pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.chucVu}
          >
            {positions.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="mb-2"><b>Bằng cấp</b></div>
          <input
            name="bangCap"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            type="text"
            value={formState.bangCap}
          />
          <div className="mb-2"><b>Kinh nghiệm</b></div>
          <div
            className="mb-2 send-area"
            style={{ borderRadius: "5px", borderColor: "#D9D9D9" }}
          >
            <textarea
              rows="3"
              name="kinhNghiem"
              value={formState.kinhNghiem}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-2"><b>Lương cơ bản/giờ</b></div>
          <input
            type="number"
            name="luongCoBan"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            value={formState.luongCoBan}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          {
            user?.Loai === "ChuHeThong" && (
              <div>
                <div className="mb-2"><b>Chi nhánh làm việc</b></div>
                <select
                  className="form-select pb-2 pt-2 mb-2"
                  name="chiNhanh"
                  onChange={handleChange}
                  value={formState.chiNhanh}
                >
                  {branches.map((item, index) => (
                    <option key={index} value={item.tenChiNhanh}>
                      {item.tenChiNhanh}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          {errors && <div className="error">{errors}</div>}
          <div className="text-end">
            <button type="submit" className="btn pb-2 pt-2 ps-3 pe-3 mt-2 btnGradient" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </form >
      </div >
    </div >
  );
};
