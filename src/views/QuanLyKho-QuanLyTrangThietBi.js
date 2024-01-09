import React from 'react'
import './mistyles.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { FormVatTuThietBi } from '../components/FormVatTuThietBi';
import { useEffect, useState, useContext } from 'react';
import api from '../api/Api';
import { AuthContext } from '../hook/AuthProvider'

const QuanLyTrangThietBi = (props) => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [branches, setBranches] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    maVatTu: '',
    tenVatTu: '',
    slnDau: '',
    slnCuoi: '',
    sltkDau: '',
    sltkCuoi: '',
    giaDau: '',
    giaCuoi: '',
    ngayDau: '',
    ngayCuoi: '',
    chiNhanh: '',
  })

  useEffect(() => {
    getMaterials();
    getBranches()
  }, []);
  const getBranches = async () => {
    const branches = await api.getAllBranchs();
    setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
  };

  const getMaterials = async () => {
    const materials = await api.getAllMaterials()
    if (user?.Loai !== 'ChuHeThong') {
      const fil = materials.filter((item, idx) => item.chiNhanh === user?.chinhanh)
      setMaterials(fil);
    }
    else {
      setMaterials(materials)
    }
  }

  const handleDeleteRow = (targetIndex) => {
    const shouldDelete = window.confirm('Bạn có chắc chắn muốn xóa vật tư thiết bị này không?');
    if (shouldDelete) {
      setMaterials(materials.filter((_, idx) => idx !== targetIndex));
      api.deleteMaterial(materials[targetIndex].Id);
    }
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = async (newRow) => {
    console.log(newRow);
    if (rowToEdit == null) {
      if (user?.Loai === 'ChuHeThong') {
        const id = await api.addMaterial(newRow);
        newRow.Id = id;
        setMaterials([...materials, newRow]);
      }
      else {
        const id = await api.addMaterial({ ...newRow, chiNhanh: user?.chinhanh });
        newRow.Id = id;
        setMaterials([...materials, newRow]);
      }

    }
    else {
      api.updateMaterial(newRow, newRow.Id);
      let updatedMaterials = materials.map((currRow, idx) => {
        if (idx !== rowToEdit) return currRow;
        return newRow;
      })
      setMaterials(updatedMaterials);
    }
  };

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const onSearch = async () => {
    console.log(searchCriteria)

    const searchResults = await api.getMaterialsBySeacrh(searchCriteria);
    console.log(searchResults);
    if (user?.Loai !== 'ChuHeThong') {
      const fil = searchResults.filter((item, idx) => item.chiNhanh === user?.chinhanh)
      setMaterials(fil);
    }
    else {
      setMaterials(searchResults)
    }
  }
  return (
    <div>
      <div className="mb-3 mt-3">
        <input
          className="block m-2 px-4 customBox"
          type="text"
          id="maVatTu"
          placeholder="Mã vật tư"
          name="maVatTu"
          onChange={handleChange}
        />
        <input
          className="block m-2 px-4 customBox"
          type="text"
          id="tenVatTu"
          placeholder="Tên vật tư"
          name="tenVatTu"
          onChange={handleChange}
        />
        <div>
          <text>Số lượng nhập: Từ </text>
          <input
            className="block m-2 px-4 customBox"
            type="number"
            placeholder="0"
            name="slnDau"
            onChange={handleChange}
          />
          <text>đến</text>
          <input
            className="block m-2 px-4 customBox"
            type="number"
            placeholder="1000000000"
            name="slnCuoi"
            onChange={handleChange}
          />
        </div>
        <div>
          <text>Số lượng tồn kho: Từ </text>
          <input
            className="block m-2 px-4 customBox"
            type="number"
            placeholder="0"
            name="sltkDau"
            onChange={handleChange}
          />
          <text>đến</text>
          <input
            className="block m-2 px-4 customBox"
            type="number"
            placeholder="1000000000"
            name="sltkCuoi"
            onChange={handleChange}
          />
        </div>
        <div>
          <text>Giá nhập: Từ </text>
          <input
            className="block m-2 px-4 customBox"
            type="number"
            placeholder="0"
            name="giaDau"
            onChange={handleChange}
          />
          <text>đến</text>
          <input
            className="block m-2 px-4 customBox"
            type="number"
            placeholder="1000000000"
            name="giaCuoi"
            onChange={handleChange}
          />
        </div>
        <div>
          <text>Ngày nhập: Từ </text>
          <input
            className="block m-2 px-4 customBox"
            type="date"
            name="ngayDau"
            onChange={handleChange}
          />
          <text>đến</text>
          <input
            className="block m-2 px-4 customBox"
            type="date"
            name="ngayCuoi"
            onChange={handleChange}
          />
        </div>
        <div>
          <text>Chi nhánh: </text>
          <select
            className="customBox"
            id="type"
            name="chiNhanh"
            onChange={handleChange}
          >
            {user?.Loai === 'ChuHeThong' ? branches.map((item, index) => (
              <option key={index} value={item.tenChiNhanh}>
                {item.tenChiNhanh}
              </option>
            )) :
              <option value={user?.chinhanh}>
                {user?.chinhanh}
              </option>
            }
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={onSearch}
      >
        Tìm kiếm
      </button>
      <button
        onClick={() => setModalOpen(true)}
        className="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Thêm
      </button>

      <h1 className="noteVND">**Tính theo đơn vị VNĐ</h1>
      <table className="table">
        <thead>
          <tr className="table-secondary">
            <th>Mã vật tư thiết bị</th>
            <th>Tên vật tư thiết bị</th>
            <th>Số lượng nhập</th>
            <th>Số lượng tồn kho</th>
            <th>Đơn giá nhập</th>
            <th>Ngày nhập</th>
            <th></th>
          </tr>
        </thead>
        {materials.map((row, idx) => {
          return (
            <tr key={row.Id}>
              <td>{row.maVatTu}</td>
              <td>{row.tenVatTu}</td>
              <td>{row.soLuongNhap}</td>
              <td>{row.soLuongTonKho}</td>
              <td>{new Intl.NumberFormat("en-DE").format(row.donGiaNhap)}</td>
              <td>{row.ngayNhap}</td>
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
        <tbody></tbody>
      </table>
      {modalOpen && (
        <FormVatTuThietBi
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && materials[rowToEdit]}
          branches={branches}
        />
      )}
    </div>
  );
}
export default QuanLyTrangThietBi;