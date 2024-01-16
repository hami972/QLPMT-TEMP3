import React, { useState } from "react";

export const FormMaGiamGia = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      idMa: "",
      phanTram: "",
      thoiGianBatDau: "",
      thoiGianKetThuc: "",
      dichVuApDung: "",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (formState.idMa && formState.phanTram && formState.thoiGianBatDau && formState.thoiGianKetThuc && formState.dichVuApDung) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (!value) {
          errorFields.push(key);
        }
      }
      setErrors(errorFields.join(", "));
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

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="col-sm-4 modal1">
        <form>
          <div className="form-group">
            <label for="idMa">Id mã giảm giá</label>
            <input name="idMa"
              onChange={handleChange}
              value={formState.idMa} />
          </div>
          <div className="form-group">
            <label for="phanTram">Phần trăm</label>
            <input
              name="phanTram"
              onChange={handleChange}
              type="number"
              value={formState.phanTram}
            />
          </div>
          <div className="form-group">
            <label for="thoiGianBatDau">Thời gian bắt đầu</label>
            <input
              name="thoiGianBatDau"
              onChange={handleChange}
              type="date"
              value={formState.thoiGianBatDau}
            />
          </div>
          <div className="form-group">
            <label htmlFor="thoiGianKetThuc">Thời gian kết thúc</label>
            <input
              name="thoiGianKetThuc"
              onChange={handleChange}
              type="date"
              value={formState.thoiGianKetThuc}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dichVuApDung">Dịch vụ áp dụng</label>
            <textarea
              name="dichVuApDung"
              onChange={handleChange}
              value={formState.dichVuApDung}
            />
          </div>
          {errors && <div className="error">{`Please include: ${errors}`}</div>}
          <button type="submit" className="btnGradient" onClick={handleSubmit}>
            Lưu
          </button>
        </form>
      </div>
    </div>
  );
};
