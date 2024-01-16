import React, { useState, useContext } from "react";
import { AuthContext } from "../hook/AuthProvider";
export const FormThuoc = ({ closeModal, onSubmit, defaultValue, branches }) => {
  const { user } = useContext(AuthContext);
  const [formState, setFormState] = useState(
    defaultValue || {
      maThuoc: "",
      tenThuoc: "",
      soLuongNhap: "",
      donGiaNhap: "",
      donGia: "",
      hanSuDung: "",
      ngayNhap: "",
      soLuongTonKho: "",
      chiNhanh: "",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (!defaultValue) formState.soLuongTonKho = formState.soLuongNhap;
    if (
      formState.maThuoc != "" &&
      formState.tenThuoc != "" &&
      formState.soLuongNhap != "" &&
      formState.donGia != "" &&
      formState.donGiaNhap != "" &&
      formState.hanSuDung != "" &&
      formState.ngayNhap != "" &&
      (defaultValue ? formState.soLuongTonKho != "" : true)
    ) {
      if (parseInt(formState.soLuongNhap) < parseInt(formState.soLuongTonKho)) {
        setErrors("Số lượng tồn kho không được lớn hơn số lượng nhập!");
        return false;
      }
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (value == "") {
          switch (key) {
            case "maThuoc":
              errorFields.push("Mã thuốc");
              break;
            case "tenThuoc":
              errorFields.push("Tên thuốc");
              break;
            case "soLuongNhap":
              errorFields.push("Số lượng nhập");
              break;
            case "soLuongTonKho":
              errorFields.push("Số lượng tồn kho");
              break;
            case "donGiaNhap":
              errorFields.push("Đơn giá nhập");
              break;
            case "donGia":
              errorFields.push("Đơn giá");
              break;
            case "hanSuDung":
              errorFields.push("Hạn sử dụng");
              break;
            case "ngayNhap":
              errorFields.push("Ngày nhập");
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
      <div
        className="col-sm-4 modal1"
        style={{ height: "80%", overflowY: "auto" }}
      >
        <form>
          <div className="mb-2"><b>Mã thuốc</b></div>
          <input
            name="maThuoc"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.maThuoc}
          />
          <div className="mb-2"><b>Tên thuốc</b></div>
          <input
            name="tenThuoc"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            type="text"
            value={formState.tenThuoc}
          />
          <div className="mb-2"><b>Số lượng nhập</b></div>
          <input
            name="soLuongNhap"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            type="number"
            value={formState.soLuongNhap}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          {defaultValue && (
            <div>
              <div className="mb-2"><b>Số lượng nhập</b></div>
              <input
                name="soLuongTonKho"
                className="form-control pb-2 pt-2 mb-2"
                type="number"
                onChange={handleChange}
                value={formState.soLuongTonKho}
                onKeyDown={isNumberPress}
                onPaste={isNumberCopy}
              />
            </div>
          )}
          <div className="mb-2"><b>Đơn giá nhập</b></div>
          <input
            name="donGiaNhap"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            type="number"
            value={formState.donGiaNhap}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          <div className="mb-2"><b>Đơn giá</b></div>
          <input
            name="donGia"
            type="number"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.donGia}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          <div className="mb-2"><b>Hạn sử dụng</b></div>
          <input
            name="hanSuDung"
            className="form-control pb-2 pt-2 mb-2"
            type="date"
            onChange={handleChange}
            value={formState.hanSuDung}
          />
          <div className="mb-2"><b>Ngày nhập</b></div>
          <input
            name="ngayNhap"
            className="form-control pb-2 pt-2 mb-2"
            type="date"
            onChange={handleChange}
            value={formState.ngayNhap}
          />
          {user?.Loai === "ChuHeThong" && (
            <div>
              <div className="mb-2"><b>Chi nhánh</b></div>
              <select
                className="form-select pb-2 pt-2 mb-2"
                id="type"
                name="chiNhanh"
                onChange={handleChange}
                value={formState.chiNhanh}
              >
                {branches.map((item, index) => {
                  if (item.tenChiNhanh !== "Tất cả")
                    return (
                      <option key={index} value={item.tenChiNhanh}>
                        {item.tenChiNhanh}
                      </option>
                    );
                })}
              </select>
            </div>
          )}
          {errors && <div className="error">{errors}</div>}
          <div className="text-end">
            <button type="submit" className="btn pb-2 pt-2 ps-3 pe-3 mt-2 btnGradient" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};
