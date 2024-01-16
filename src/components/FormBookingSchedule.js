import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../api/Api";

export const FormBookingSchedule = ({
  closeModal,
  onSubmit,
  onDelete,
  defaultValue,
  flag,
}) => {
  const [formState, setFormState] = useState(defaultValue);
  const [errors, setErrors] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    const services = await api.getAllServices();
    setServices(services);
  };
  const validateForm = () => {
    if (
      formState.TenBN != "" &&
      formState.SDT != "" &&
      formState.DichVu != ""
    ) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (value == "") {
          switch (key) {
            case "TenBN":
              errorFields.push("Tên bệnh nhân");
              break;
            case "SDT":
              errorFields.push("Số điện thoại");
              break;
            case "DichVu":
              errorFields.push("Dịch vụ");
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

  const handleDelete = (e) => {
    e.preventDefault();

    onDelete(formState);

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
        style={{ overflowY: "auto", height: "80%" }}
      >
        <form>
          {/* <div className="mb-2" style={{ fontWeight: "500" }}>
            Mã bệnh nhân
          </div>
          <Select
            className="mb-2"
            value={customers.find((item) => item.MaBN === formState.MaBN) || ""}
            onChange={(value) =>
              value !== null
                ? setFormState({
                    ...formState,
                    MaBN: value.MaBN,
                    TenBN: value.TenBN,
                  })
                : setFormState({ ...formState, MaBN: "", TenBN: "" })
            }
            options={customers}
            isClearable
            getOptionLabel={(item) => item.MaBN}
            getOptionValue={(item) => item}
            placeholder=""
          /> */}
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Tên bệnh nhân
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            name="TenBN"
            onChange={handleChange}
            value={formState.TenBN}
          ></input>
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Số điện thoại
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            name="SDT"
            onChange={handleChange}
            value={formState.SDT}
            onKeyDown={isNumberPress}
            onPaste={isNumberCopy}
          ></input>
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Mã nha sĩ
          </div>
          <div
            className="form-control pb-2 pt-2 mb-2"
            style={{ minHeight: "40px" }}
          >
            {formState.MaNS}
          </div>
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Tên nha sĩ
          </div>
          <div
            className="form-control pb-2 pt-2 mb-2"
            style={{ minHeight: "40px" }}
          >
            {formState.TenNS}
          </div>
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Ngày hẹn
          </div>
          <div
            className="form-control pb-2 pt-2 mb-2"
            style={{ minHeight: "40px" }}
          >
            {formState.NgayHen}
          </div>
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Giờ
          </div>
          <div
            className="form-control pb-2 pt-2 mb-2"
            style={{ minHeight: "40px" }}
          >
            {formState.Gio}
          </div>
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Dịch vụ
          </div>
          <Select
            className="mb-2"
            value={
              services.find(
                (item) =>
                  `${item.tenDichVu} - ${item.loaiDichVu}` == formState.DichVu
              ) || ""
            }
            onChange={(value) =>
              value !== null
                ? setFormState({
                  ...formState,
                  DichVu: `${value.tenDichVu} - ${value.loaiDichVu}`,
                })
                : setFormState({ ...formState, DichVu: "" })
            }
            options={services}
            isClearable
            getOptionLabel={(item) => `${item.tenDichVu} - ${item.loaiDichVu}`}
            getOptionValue={(item) => item}
            placeholder=""
          />
          <div className="mb-2" style={{ fontWeight: "500" }}>
            Ghi chú
          </div>
          <div
            className="send-area mb-2"
            style={{ borderRadius: "5px", borderColor: "#D9D9D9" }}
          >
            <textarea
              rows="3"
              id="GhiChu"
              name="GhiChu"
              onChange={handleChange}
            >
              {formState.GhiChu}
            </textarea>
          </div>
          {errors && <div className="error">{errors}</div>}
          {flag == "add" && (
            <div className="text-end">
              <button
                type="button"
                className="btn pb-2 pt-2 ps-3 pe-3 mt-2 me-2"
                style={{ color: "#0096FF", border: "1px solid #0096FF" }}
                onClick={() => closeModal()}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="btn pb-2 pt-2 ps-3 pe-3 mt-2 btnGradient"
                onClick={handleSubmit}
              >
                Lưu
              </button>
            </div>
          )}{" "}
          {flag == "edit" && (
            <div className="text-end">
              <button
                type="button"
                className="btn pb-2 pt-2 ps-3 pe-3 mt-2 me-2"
                style={{ color: "#0096FF", border: "1px solid #0096FF" }}
                onClick={handleDelete}
              >
                Xóa lịch hẹn
              </button>

              <button
                type="submit"
                className="btn pb-2 pt-2 ps-3 pe-3 mt-2"
                style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
                onClick={handleSubmit}
              >
                Cập nhật
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
