import React, { useState, useContext} from "react";
import { AuthContext } from '../hook/AuthProvider'
export const FormVatTuThietBi = ({ closeModal, onSubmit, defaultValue, branches}) => {
  const {user} = useContext(AuthContext);
  const [formState, setFormState] = useState(
    defaultValue || {
      maVatTu: "",
      tenVatTu: "",
      soLuongNhap: "",
      soLuongTonKho: "",
      donGiaNhap: "",
      ngayNhap: "",
      chiNhanh:"",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if(!defaultValue) formState.soLuongTonKho = formState.soLuongNhap;
    if (formState.maVatTu!="" && formState.tenVatTu!="" && formState.soLuongNhap!="" && (defaultValue? formState.soLuongTonKho!="" : true) && formState.donGiaNhap!="" && formState.ngayNhap!="") {
      if(parseInt(formState.soLuongNhap) < parseInt(formState.soLuongTonKho)){
        setErrors("Số lượng tồn kho không được lớn hơn số lượng nhập!");
        return false;
      }
      setErrors("");
      return true;

    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (value == "") {
          switch (key){
            case 'maVatTu': 
              errorFields.push("Mã vật tư"); break;
            case 'tenVatTu': 
              errorFields.push("Tên vật tư"); break;
            case 'soLuongNhap': 
              errorFields.push("Số lượng nhập"); break;
            case 'soLuongTonKho': 
              errorFields.push("Số lượng tồn kho"); break; 
            case 'donGiaNhap': 
              errorFields.push("Đơn giá nhập"); break; 
            case 'ngayNhap': 
              errorFields.push("Ngày nhập"); break; 
            default: break;         
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
            <label for="maVatTu">Mã vật tư</label>
            <input name="maVatTu" 
            onChange={handleChange} 
            value={formState.maVatTu} />
          </div>
          <div className="form-group">
            <label for="tenVatTu">Tên vật tư</label>
            <input
              name="tenVatTu"
              onChange={handleChange}
              type="text"
              value={formState.tenVatTu}
            />
          </div>
          <div className="form-group">
            <label for="soLuongNhap">Số lượng nhập</label>
            <input
              name="soLuongNhap"
              onChange={handleChange}
              type="number"
              value={formState.soLuongNhap}
            />
          </div>
          {defaultValue &&
          <div className="form-group">
            <label for="soLuongTonKho">Số lương tồn kho</label>
            <input
              name="soLuongTonKho"
              onChange={handleChange}
              type="number"
              value={formState.soLuongTonKho}
            />
          </div>
          }
          <div className="form-group">
            <label for="donGiaNhap">Đơn giá nhập</label>
            <input
              name="donGiaNhap"
              onChange={handleChange}
              type="number"
              value={formState.donGiaNhap}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ngayNhap">Ngày nhập</label>
            <input
              name="ngayNhap"
              onChange={handleChange}
              type="date"
              value={formState.ngayNhap}
            />
          </div>
          {user?.Loai==='ChuHeThong'&&<div className="form-group">
          <label for="chiNhanh">Chi nhánh</label>
              <select
                className="form-select pb-2 pt-2 mb-2"
                id="type"
                name="chiNhanh"
                onChange={handleChange}
                value={formState.chiNhanh}
              >
                {branches.map((item, index) => {
                  if(item.tenChiNhanh!=='Tất cả')
                  return(
                  <option key={index} value={item.tenChiNhanh}>
                    {item.tenChiNhanh}
                  </option>
                  )
                 })
                }
              </select>
            </div>}
          
          {errors && <div className="error">{errors}</div>}
          <button type="submit" className="btnSummit" onClick={handleSubmit}>
            Lưu
          </button>
        </form>
      </div>
    </div>
  );
};
