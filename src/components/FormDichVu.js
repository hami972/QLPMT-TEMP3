import React, { useState } from "react";

export const FormDichVu = ({
  closeModal,
  onSubmit,
  defaultValue,
  services,
}) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      maDichVu: "",
      tenDichVu: "",
      loaiDichVu: "",
      giaDichVu: "",
      baoHanh: "Không",
      coTraGop: "Không",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (
      formState.maDichVu != "" &&
      formState.tenDichVu != "" &&
      formState.loaiDichVu != "" &&
      formState.giaDichVu != ""
    ) {
      const isIdExists = services.some(
        (service) => service.maDichVu == formState.maDichVu
      );
      if (
        !defaultValue &&
        defaultValue.maDichVu != formState.maDichVu &&
        isIdExists
      ) {
        setErrors(
          "Mã dịch vụ này đã tồn tại! Vui lòng nhập một mã dịch vụ khác."
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
            case "maDichVu":
              errorFields.push("Mã dịch vụ");
              break;
            case "tenDichVu":
              errorFields.push("Tên dịch vụ");
              break;
            case "loaiDichVu":
              errorFields.push("Loại dịch vụ");
              break;
            case "giaDichVu":
              errorFields.push("Giá dịch vụ");
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
          <div className="mb-2"><b>Mã dịch vụ</b></div>
          <input
            name="maDichVu"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            value={formState.maDichVu}
          />
          <div className="mb-2"><b>Tên dịch vụ</b></div>
          <input
            name="tenDichVu"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            type="text"
            value={formState.tenDichVu}
          />
          <div className="mb-2"><b>Loại dịch vụ</b></div>
          <input
            name="loaiDichVu"
            onChange={handleChange}
            className="form-control pb-2 pt-2 mb-2"
            type="text"
            value={formState.loaiDichVu}
          />
          <div className="mb-2"><b>Giá dịch vụ</b></div>
          <input
            name="giaDichVu"
            onChange={handleChange}
            type="number"
            className="form-control pb-2 pt-2 mb-2"
            value={formState.giaDichVu}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          <div className="mb-2"><b>Bảo hành</b></div>
          <select
            name="baoHanh"
            onChange={handleChange}
            className="form-select pb-2 pt-2 mb-2"
            value={formState.baoHanh}
          >
            <option value="Không">Không</option>
            <option value="Có">Có</option>
          </select>
          <div className="mb-2"><b>Có trả góp</b></div>
          <select
            name="coTraGop"
            className="form-select pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.coTraGop}
          >
            <option value="Không">Không</option>
            <option value="Có">Có</option>
          </select>
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
