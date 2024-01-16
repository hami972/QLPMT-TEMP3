import React, { useState, useContext } from "react";
import { AuthContext } from "../hook/AuthProvider";
export const FormVatTuThietBi = ({
  closeModal,
  onSubmit,
  defaultValue,
  branches,
}) => {
  const { user } = useContext(AuthContext);
  const [formState, setFormState] = useState(
    defaultValue || {
      maVatTu: "",
      tenVatTu: "",
      soLuongNhap: "",
      soLuongTonKho: "",
      donGiaNhap: "",
      ngayNhap: "",
      chiNhanh: "",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (!defaultValue) formState.soLuongTonKho = formState.soLuongNhap;
    if (
      formState.maVatTu != "" &&
      formState.tenVatTu != "" &&
      formState.soLuongNhap != "" &&
      (defaultValue ? formState.soLuongTonKho != "" : true) &&
      formState.donGiaNhap != "" &&
      formState.ngayNhap != ""
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
            case "maVatTu":
              errorFields.push("Mã vật tư");
              break;
            case "tenVatTu":
              errorFields.push("Tên vật tư");
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
          <div className="mb-2"><b>Mã vật tư</b></div>
          <input
            name="maVatTu"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.maVatTu}
          />
          <div className="mb-2"><b>Tên vật tư</b></div>
          <input
            name="tenVatTu"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            type="text"
            value={formState.tenVatTu}
          />
          <div className="mb-2"><b>Số lượng nhập</b></div>
          <input
            name="soLuongNhap"
            onChange={handleChange}
            type="number"
            value={formState.soLuongNhap}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
            className="form-control pb-2 pt-2 mb-2"
          />
          {defaultValue && (
            <div>
              <div className="mb-2"><b>Số lượng tồn kho</b></div>
              <input
                name="soLuongTonKho"
                onChange={handleChange}
                type="number"
                className="form-control pb-2 pt-2 mb-2"
                value={formState.soLuongTonKho}
                onKeyDown={isNumberPress}
                onPaste={isNumberCopy}
              />
            </div>
          )}
          <div>
            <div className="mb-2"><b>Đơn giá nhập</b></div>
            <input
              name="donGiaNhap"
              className="form-control pb-2 pt-2 mb-2"
              onChange={handleChange}
              type="number"
              value={formState.donGiaNhap}
              onKeyDown={isNumberPress}
              onPaste={isNumberCopy}
            />
          </div>
          <div>
            <div className="mb-2"><b>Đơn giá nhập</b></div>
            <input
              name="ngayNhap"
              onChange={handleChange}
              className="form-control pb-2 pt-2 mb-2"
              type="date"
              value={formState.ngayNhap}
            />
          </div>
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
