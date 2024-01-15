import React, { useState, useEffect, useContext } from 'react'
import './mistyles.css'
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { FormThuoc } from '../components/FormThuoc';
import moment from 'moment';
import api from '../api/Api';
import { AuthContext } from '../hook/AuthProvider'

const QuanLyThuoc = (props) => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [branches, setBranches] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    maThuoc: '',
    tenThuoc: '',
    slnDau: '',
    slnCuoi: '',
    sltkDau: '',
    sltkCuoi: '',
    giaNhapDau: '',
    giaNhapCuoi: '',
    giaDau: '',
    giaCuoi: '',
    hsdDau: '',
    hsdCuoi: '',
    ngayDau: '',
    ngayCuoi: '',
    chiNhanh: '',
  })

  useEffect(() => {
    getDrugs();
    getBranches();
  }, []);
  const getBranches = async () => {
    const branches = await api.getAllBranchs();
    setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
  };
  const getDrugs = async () => {
    const drugs = await api.getAllDrugs()
    if (user?.Loai !== 'ChuHeThong') {
      const fil = drugs.filter((item, idx) => item.chiNhanh === user?.chinhanh)
      setDrugs(fil);
    }
    else {
      setDrugs(drugs)
    }
  }

  const handleDeleteRow = (targetIndex) => {
    const shouldDelete = window.confirm('Bạn có chắc chắn muốn xóa thuốc này không?');
    if (shouldDelete) {
      setDrugs(drugs.filter((_, idx) => idx !== targetIndex));
      api.deleteDrug(drugs[targetIndex].Id);
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
        const id = await api.addDrug(newRow);
        newRow.Id = id;
        setDrugs([...drugs, newRow]);
      }
      else {
        const id = await api.addDrug({ ...newRow, chiNhanh: user?.chinhanh });
        newRow.Id = id;
        setDrugs([...drugs, newRow]);
      }

    }
    else {
      api.updateDrug(newRow, newRow.Id);
      let updatedDrugs = drugs.map((currRow, idx) => {
        if (idx !== rowToEdit) return currRow;
        return newRow;
      })
      setDrugs(updatedDrugs);
    }
  };

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const onSearch = async () => {
    console.log(searchCriteria)

    const searchResults = await api.getDrugsBySeacrh(searchCriteria);
    console.log(searchResults);
    if (user?.Loai !== 'ChuHeThong') {
      const fil = searchResults.filter((item, idx) => item.chiNhanh === user?.chinhanh)
      setDrugs(fil);
    }
    else {
      setDrugs(searchResults)
    }
  }
  return (
    <div >
      <div style={{color: '#fff'}}>
        <div className='row'>
          <div className='col-lg-4 col-md-6'>
            <input
              className="form-control pb-2 pt-2 mb-2"
              type="text"
              id="maThuoc"
              placeholder="Mã thuốc"
              name="maThuoc"
              onChange={handleChange}
            />
          </div>
          <div className='col-lg-4 col-md-6'>
            <input
              className="form-control pb-2 pt-2 mb-3"
              type="text"
              id="tenThuoc"
              placeholder="Tên thuốc"
              name="tenThuoc"
              onChange={handleChange}
            />
          </div>
        </div>
        <table className='container-fluid'>
          <tbody>
            <tr>
              <td>
                <b>Số lượng nhập: </b>
              </td>
              <td>
                <div div className='row'>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Từ</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="0"
                      name="slnDau"
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Đến</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="1000000000"
                      name="slnCuoi"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <b>Số lượng tồn kho: </b>
              </td>
              <td>
                <div div className='row'>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Từ</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="0"
                      name="sltkDau"
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Đến</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="1000000000"
                      name="sltkCuoi"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <b>Giá nhập:</b>
              </td>
              <td>
                <div className='row'>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Từ</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="0"
                      name="giaNhapDau"
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Đến</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="1000000000"
                      name="giaNhapCuoi"
                      onChange={handleChange}
                    />

                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <b>Đơn giá:</b>
              </td>
              <td>
                <div className='row'>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Từ</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="0"
                      name="giaDau"
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Đến</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="number"
                      placeholder="1000000000"
                      name="giaCuoi"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <b>Hạn sử dụng:</b>
              </td>
              <td>
                <div className='row'>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Từ</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="date"
                      name="hsdDau"
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Đến</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="date"
                      name="hsdCuoi"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <b>Ngày nhập:</b>
              </td>
              <td>
                <div className='row'>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Từ</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="date"
                      name="ngayDau"
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <text style={{ fontWeight: 600 }}>Đến</text>
                    <input
                      className="form-control pb-2 pt-2 mb-2"
                      type="date"
                      name="ngayCuoi"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <b>Chi nhánh: </b>
              </td>
              <td>
                <div className='col-lg-5 col-md-8'>
                  <select
                    className="form-select pb-2 pt-2 mt-2"
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
              </td>
            </tr>
          </tbody>
        </table>
        <div>
        </div>
      </div>
      <button
        type="submit"
        className="btn pb-2 pt-2 mb-3 me-3 mt-3"
        style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}
        onClick={onSearch}
      >
        Tìm kiếm
      </button>
      <button
        onClick={() => setModalOpen(true)}
        className="btn pb-2 pt-2 mb-3 mt-3"
        style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}
      >
        Thêm
      </button>

      <div className='text-end'>
        <h1 className="noteVND">
          **Nếu thuốc dạng viên đơn vị tính là viên, còn lại hộp
        </h1>
        <h1 className="noteVND">**Tính theo đơn vị VNĐ</h1>
      </div>
      <table className="table">
        <thead style={{ verticalAlign: "middle" }}>
          <tr className="table-secondary">
            <th>Mã Thuốc</th>
            <th>Tên thuốc</th>
            <th>Số lượng nhập</th>
            <th>Số lượng tồn kho</th>
            <th>Đơn giá nhập</th>
            <th>Đơn giá</th>
            <th>Hạn sử dụng</th>
            <th>Ngày nhập</th>
            <th></th>
          </tr>
        </thead>
        {drugs.map((row, idx) => {
          return (
            <tr key={row.Id} style={{backgroundColor: 'white'}}>
              <td>{row.maThuoc}</td>
              <td>{row.tenThuoc}</td>
              <td>{row.soLuongNhap}</td>
              <td>{row.soLuongTonKho}</td>
              <td>{new Intl.NumberFormat("en-DE").format(row.donGiaNhap)}</td>
              <td>{new Intl.NumberFormat("en-DE").format(row.donGia)}</td>
              <td>{moment(new Date(row.hanSuDung)).format("DD/MM/YYYY")}</td>
              <td>{moment(new Date(row.ngayNhap)).format("DD/MM/YYYY")}</td>
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
        <FormThuoc
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && drugs[rowToEdit]}
          branches={branches}
        />
      )}
    </div>
  );
}
export default QuanLyThuoc;