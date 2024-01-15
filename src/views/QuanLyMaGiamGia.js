import React from "react";
import "./mistyles.css";
import { useEffect, useState } from "react";
import { FormMaGiamGia } from "../components/FormMaGiamGia";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import api from "../api/Api";
import moment from "moment";
const QuanLyMaGiamGia = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [magiamgia, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    maGiamGia: "",
    TGBatDau: "",
    TGKetThuc: ""
  });

  const handleDeleteRow = (targetIndex) => {
    const shouldDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa tài khoản này không?'
    );
    if (shouldDelete) {
      setRows(magiamgia.filter((_, idx) => idx !== targetIndex));
      api.deleteDiscount(magiamgia[targetIndex].Id);
    }
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = async (newRow) => {
    if (rowToEdit == null) {
      const id = await api.addDiscount(newRow);
      newRow.Id = id;
      setRows([...magiamgia, newRow]);
    } else {
      api.updateDiscount(newRow, newRow.Id);
      let updatedDiscounts = magiamgia.map((currRow, idx) => {
        if (idx !== rowToEdit) return currRow;
        return newRow;
      });
      setRows(updatedDiscounts);
    }
  };

  const getDiscounts = async () => {
    const discounts = await api.getAllDiscounts();
    setRows(discounts);
  };

  const onSearch = async () => {
    const searchResults = await api.getDiscountsBySearch(searchCriteria);
    setRows(searchResults);
  };

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getDiscounts();
  }, []);

  return (
    <div>
      <div className="row" style={{color: '#fff'}}>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2"><b>ID mã giảm giá</b></div>
          <input
            className="form-control pb-2 pt-2 mb-2"
            type="text"
            id="maGiamGia"
            placeholder="Nhập id mã giảm giá"
            name="maGiamGia"
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2"><b>Thời gian bắt đầu</b></div>
          <input
            className="form-control pb-2 pt-2 mb-2"
            type="date"
            name="TGBatDau"
            id="TGBatDau"
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2"><b>Thời gian kết thúc</b></div>
          <input
            className="form-control pb-2 pt-2 mb-2"
            type="date"
            name="TGKetThuc"
            id="TGKetThuc"
            onChange={handleChange}
          />
        </div>
        <div className="text-end">
          <button
            onClick={onSearch}
            className="btn pb-2 pt-2 mt-3 mb-3 me-3"
            style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}>
            Tìm kiếm
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="btn pb-2 pt-2 mt-3 mb-3"
            style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}>
            Thêm
          </button>
        </div>
      </div>
      <div className="text-end">
        <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      </div>
      <table className="table">
        <thead>
          <tr className="table-secondary">
            <th>ID mã giảm giá</th>
            <th>Phần trăm giảm</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
            {/* <th>Dịch vụ áp dụng</th> */}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {magiamgia.map((row, idx) => {
            return (
              <tr key={row.Id}>
                <td>{row.maGiamGia}</td>
                <td>{row.phanTram}</td>
                <td>{moment(new Date(row.TGBatDau)).format("DD/MM/YYYY")}</td>
                <td>{moment(new Date(row.TGKetThuc)).format("DD/MM/YYYY")}</td>
                <td className="fit">
                  <span className="actions">
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => handleDeleteRow(idx)}
                    />
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => handleEditRow(idx)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalOpen && (
        <FormMaGiamGia
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && magiamgia[rowToEdit]}
          discounts={magiamgia}
        />
      )}
    </div>
  );
};
export default QuanLyMaGiamGia;
