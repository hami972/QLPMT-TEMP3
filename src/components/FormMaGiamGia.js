import React, { useState } from "react";
import moment from "moment";

export const FormMaGiamGia = ({
  closeModal,
  onSubmit,
  defaultValue,
  discounts,
}) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      maGiamGia: "",
      phanTram: "",
      TGBatDau: "",
      TGKetThuc: "",
      dichVuApDung: "",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (
      formState.maGiamGia != "" &&
      formState.phanTram != "" &&
      formState.TGBatDau != "" &&
      formState.TGKetThuc != ""
      // && formState.dichVuApDung != ""
    ) {
      const isIdExists = discounts.some(
        (discount) => discount.maGiamGia == formState.maGiamGia
      );
      if (!defaultValue && isIdExists) {
        setErrors(
          "Mã giảm giá này đã tồn tại! Vui lòng nhập một mã giảm giá khác."
        );
        return false;
      } else if (formState.phanTram > 100 || formState.phanTram <= 0) {
        setErrors("Phần trăm giảm giá phải lớn hơn 0 và không lớn hơn 100");
        return false;
      } else if (formState.TGBatDau >= formState.TGKetThuc) {
        setErrors(
          "Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu 1 ngày"
        );
        return false;
      } else if (new Date() > formState.TGKetThuc) {
        setErrors("Thời gian kết thúc phải là sau ngày hôm nay");
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
            case "maGiamGia":
              errorFields.push("ID mã giảm giá");
              break;
            case "phanTram":
              errorFields.push("Phầm trăm giảm");
              break;
            case "TGBatDau":
              errorFields.push("Thời gian bắt đầu");
              break;
            case "TGKetThuc":
              errorFields.push("Thời gian kết thúc");
              break;
            // case "dichVuApDung":
            //   errorFields.push("Dịch vụ áp dụng");
            //   break;
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
          <div className="mb-2">
            <b>ID mã giảm giá</b>
          </div>
          <input
            name="maGiamGia"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            value={formState.maGiamGia}
          />
          <div className="mb-2">
            <b>Phần trăm</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-2"
            name="phanTram"
            onChange={handleChange}
            type="number"
            value={formState.phanTram}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          />
          <div className="mb-2"><b>Thời gian bắt đầu</b></div>
          <input
            name="TGBatDau"
            className="form-control pb-2 pt-2 mb-2"
            onChange={handleChange}
            type="date"
            min={moment().format("YYYY-MM-DD")}
            value={formState.TGBatDau}
          />
          <div className="mb-2"><b>Thời gian kết thúc</b></div>
          <input
            className="form-control pb-2 pt-2 mb-2"
            name="TGKetThuc"
            onChange={handleChange}
            type="date"
            min={moment().add(1, "day").format("YYYY-MM-DD")}
            value={formState.TGKetThuc}
          />
          {/* <div className="form-group">
            <label htmlFor="dichVuApDung">Dịch vụ áp dụng</label>
            <textarea
              name="dichVuApDung"
              onChange={handleChange}
              value={formState.dichVuApDung}
            />
          </div> */}
          {errors && <div className="error">{`Please include: ${errors}`}</div>}
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
