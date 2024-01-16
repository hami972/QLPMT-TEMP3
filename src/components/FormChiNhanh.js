import React, { useState } from "react";

export const FormChiNhanh = ({
  closeModal,
  onSubmit,
  defaultValue,
  branchs,
}) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      maChiNhanh: "",
      tenChiNhanh: "",
      soLuongPhong: "",
      diaChi: "",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (
      formState.maChiNhanh != "" &&
      formState.tenChiNhanh != "" &&
      formState.diaChi != "" &&
      formState.soLuongPhong != ""
    ) {
      const isIdExists = branchs.some(
        (branch) => branch.maChiNhanh == formState.maChiNhanh
      );
      if (
        !defaultValue &&
        defaultValue.maChiNhanh != formState.maChiNhanh &&
        isIdExists
      ) {
        setErrors(
          "Mã chi nhánh này đã tồn tại! Vui lòng nhập một mã chi nhánh khác."
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
            case "maChiNhanh":
              errorFields.push("Mã chi nhánh");
              break;
            case "tenChiNhanh":
              errorFields.push("Tên chi nhánh");
              break;
            case "soLuongPhong":
              errorFields.push("Số lượng phòng");
              break;
            case "diaChi":
              errorFields.push("Địa chỉ");
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
      <div className="col-sm-4 modal1">
        <form>
          <div className="mb-2"><b>Mã chi nhánh</b></div>
          <input
            name="maChiNhanh"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.maChiNhanh}
          />
          <div className="mb-2"><b>Tên chi nhánh</b></div>
          <input
            name="tenChiNhanh"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            type="text"
            value={formState.tenChiNhanh}
          />
          <div className="mb-2"><b>Địa chỉ</b></div>
          <input
            name="diaChi"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            type="text"
            value={formState.diaChi}
          />
          <div className="mb-2"><b>Số lượng phòng</b></div>
          <input
            name="soLuongPhong"
            onChange={handleChange}
            type="number"
            value={formState.soLuongPhong}
            className="form-control pb-2 pt-2 mb-2"
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />

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
