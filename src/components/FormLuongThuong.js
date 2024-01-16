import React, { useState, useEffect, useContext } from "react";
import Api from "../api/Api";
import { AuthContext } from "../hook/AuthProvider";

export const FormLuongThuong = ({
  closeModal,
  onSubmit,
  defaultValue,
  branches,
}) => {
  const { user } = useContext(AuthContext);
  const [formState, setFormState] = useState(
    defaultValue || {
      LoaiLuongThuong: "",
      Tien: "",
      Thang: new Date().getMonth() + 1,
      Nam: new Date().getFullYear(),
      LoaiNhanVien: "Tất cả",
      MaNV: "",
      GhiChu: "",
      chiNhanh: "",
    }
  );
  const [errors, setErrors] = useState("");
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    getStaffs();
  }, []);

  const getStaffs = async () => {
    const staffs = await Api.getAllStaffs();
    if (user?.Loai !== "ChuHeThong") {
      const fil = staffs.filter((item, idx) => item.chiNhanh === user.chinhanh);
      setStaffs(fil);
    } else {
      const fil = staffs.filter(
        (item, idx) => item.chiNhanh === formState.chiNhanh
      );
      console.log(fil);
      setStaffs(fil);
    }
  };
  const validateForm = () => {
    let validate = true;
    if (formState.LoaiLuongThuong != "" && formState.Tien != "") {
      if (formState.LoaiNhanVien == "Cá nhân" && formState.MaNV == "")
        validate = false;
    } else validate = false;
    if (validate) {
      setErrors("");
      console.log(1);
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (value == "") {
          switch (key) {
            case "LoaiLuongThuong":
              errorFields.push("Loại lương thưởng");
              break;
            case "Tien":
              errorFields.push("Số tiền");
              break;
            case "LoaiNhanVien":
              errorFields.push("Loại nhân viên");
              break;
            case "MaNV":
              if (formState.LoaiNhanVien == "Cá nhân")
                errorFields.push("Mã nhân viên");
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

  const handleChange = async (e) => {
    if (e.target.name == "LoaiNhanVien" && e.target.value != "Cá nhân")
      setFormState({ ...formState, [e.target.name]: e.target.value, MaNV: "" });
    else setFormState({ ...formState, [e.target.name]: e.target.value });
    if (e.target.name === "chiNhanh") {
      const staffs = await Api.getAllStaffs();
      const fil = staffs.filter(
        (item, idx) => item.chiNhanh === e.target.value
      );
      setStaffs(fil);
    }
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
      <div className="col-sm-4 modal1">
        <form>
          <div className="mb-2">
            <b>Loại lương thưởng</b>
          </div>
          <input
            type="text"
            className="form-control pb-2 pt-2 mb-2"
            value={formState.LoaiLuongThuong}
            id="LoaiLuongThuong"
            name="LoaiLuongThuong"
            onChange={handleChange}
          />
          <div className="mb-2">
            <b>Tiền</b>
          </div>
          <input
            type="number"
            className="form-control pb-2 pt-2 mb-2"
            value={formState.Tien}
            id="Tien"
            name="Tien"
            onChange={handleChange}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          <div className="mb-2">
            <b>Ghi chú</b>
          </div>
          <input
            type="text"
            className="form-control pb-2 pt-2 mb-2"
            value={formState.GhiChu}
            id="GhiChu"
            name="GhiChu"
            onChange={handleChange}
          />
          <div className="mb-2">
            <b>Loại nhân viên</b>
          </div>
          <select
            className="form-select pb-2 pt-2 mb-2"
            aria-label="Chọn chi nhánh"
            id="LoaiNhanVien"
            name="LoaiNhanVien"
            value={formState.LoaiNhanVien}
            onChange={handleChange}
          >
            <option value="Tất cả">Tất cả</option>
            <option selected value="Tiếp tân">
              Tiếp tân
            </option>
            <option value="Nha sĩ">Nha sĩ</option>
            <option value="Phụ tá">Phụ tá</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Cá nhân">Cá nhân</option>
          </select>
          {user?.Loai === "ChuHeThong" && (
            <div>
              <div className="mb-2">
                <b>Chi nhánh áp dụng</b>
              </div>
              <select
                className="form-select pb-2 pt-2 mb-2"
                id="type"
                name="chiNhanh"
                onChange={handleChange}
                value={formState.chiNhanh}
              >
                {formState.LoaiNhanVien === "Cá nhân"
                  ? branches.map((item, index) => {
                    if (item.tenChiNhanh !== "Tất cả")
                      return (
                        <option key={index} value={item.tenChiNhanh}>
                          {item.tenChiNhanh}
                        </option>
                      );
                  })
                  : branches.map((item, index) => (
                    <option key={index} value={item.tenChiNhanh}>
                      {item.tenChiNhanh}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {formState.LoaiNhanVien === "Cá nhân" ? (
            <div>
              <div className="mb-2">
                <b>Mã nhân viên</b>
              </div>
              <select
                className="form-select pb-2 pt-2 mb-2"
                id="type"
                name="MaNV"
                onChange={handleChange}
                value={formState.MaNV}
              >
                {staffs.map((item, index) => (
                  <option key={index} value={item.maNhanVien}>
                    {item.maNhanVien}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {errors && <div className="error">{errors}</div>}
          <div className="text-end">
            <button
              type="submit"
              className="btn pb-2 pt-2 ps-3 pe-3 mt-2 btnGradient"
              onClick={(e) => handleSubmit(e)}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
