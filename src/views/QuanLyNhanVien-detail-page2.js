import React from "react";
import "./mistyles.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useEffect, useState, useContext } from "react";
import { FormChiTietNhanVien } from "../components/FormChiTietNhanVien";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../api/Api";
import { auth } from "../hook/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { AuthContext } from "../hook/AuthProvider";

const XemThongTinNhanVien = (props) => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    maNhanVien: "",
    tenNhanVien: "",
    chucVu: "Tất cả",
    chiNhanh: "",
    luongDau: "",
    luongCuoi: "",
  });

  const [branches, setBranches] = useState(user?.chinhanh || []);
  const [positions, setPositions] = useState([
    "Tất cả",
    "Nha sĩ",
    "Phụ tá",
    "Quản lý",
    "Tiếp tân",
  ]);

  useEffect(() => {
    getStaffs();
    getBranches();
  }, []);

  const getStaffs = async () => {
    const staffs = await api.getAllStaffs();
    if (user?.Loai !== "ChuHeThong") {
      const fil = staffs.filter((item, idx) => item.chiNhanh === user.chinhanh);
      setStaffs(fil);
    } else {
      setStaffs(staffs);
    }
  };

  const getBranches = async () => {
    if (user?.Loai === "ChuHeThong") {
      const branches = await api.getAllBranchs();
      setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
    }
  };

  const handleDeleteRow = async (targetIndex) => {
    const shouldDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa nhân viên này không?'
    );
    if (shouldDelete) {
      setStaffs(staffs.filter((_, idx) => idx !== targetIndex));
      api.deleteStaff(staffs[targetIndex].Id);
      const id = await api.findAccountofStaff(staffs[targetIndex].maNhanVien);
      console.log("id" + id);
      if (id) {
        api.deleteUserAccount(id);
      }
    }
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = async (newRow) => {
    console.log(newRow);
    if (rowToEdit == null) {
      if (user?.Loai === "ChuHeThong") {
        const id = await api.addStaff(newRow);
        newRow.Id = id;
        setStaffs([...staffs, newRow]);
      } else {
        const id = await api.addStaff({ ...newRow, chiNhanh: user?.chinhanh });
        newRow.Id = id;
        setStaffs([...staffs, { ...newRow, chiNhanh: user?.chinhanh }]);
      }
      createUserWithEmailAndPassword(auth, newRow.email, newRow.soDienThoai)
        .then((userCredential) => {
          sendPasswordResetEmail(auth, auth.currentUser.email)
            .then(() => {
              // Thành công, có thể thông báo cho người dùng về việc gửi email đặt lại mật khẩu, mật khẩu mặc định là số đt
              console.log("Đã gửi email đặt lại mật khẩu.");
            })
            .catch((error) => {
              // Xử lý lỗi nếu có
              console.error("Lỗi khi gửi email đặt lại mật khẩu: ", error);
            });
          // Signed up
          const user = userCredential.user;
          console.log(user);
          const userData = {
            id: auth.currentUser.uid,
            ten: newRow.tenNhanVien,
            email: auth.currentUser.email,
            maNV: newRow.maNhanVien,
            chinhanh: newRow.chiNhanh,
            tuoi: "",
            diachi: "",
            CCCD: "",
            SDT: newRow.soDienThoai,
            Loai: newRow.chucVu,
          };
          api.setUserInfo(userData).catch((error) => console.error(error));
          // ...
        })
        .catch((error) => {
          console.log("Error sign up", error);
          // ..
        });
    } else {
      api.updateStaff(newRow, newRow.Id);
      let updatedStaffs = staffs.map((currRow, idx) => {
        if (idx !== rowToEdit) return currRow;
        return newRow;
      });
      setStaffs(updatedStaffs);
      const id = await api.findAccountofStaff(newRow.maNhanVien);
      api.updateUser({
        id: id,
        ten: newRow.tenNhanVien,
        chinhanh: newRow.chiNhanh,
        SDT: newRow.soDienThoai,
        Loai: newRow.chucVu,
      });
    }
  };

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const onSearch = async () => {
    console.log(searchCriteria);

    const searchResults = await api.getStaffsBySeacrh(searchCriteria);
    console.log(searchResults);
    setStaffs(searchResults);
  };
  return (
    <div >
      <div className="row" style={{color: '#fff'}}>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2"><b>Mã nhân viên</b></div>
          <input
            className="form-control pb-2 pt-2"
            type="text"
            name="maNhanVien"
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2"><b>Tên nhân viên</b></div>
          <input
            className="form-control pb-2 pt-2"
            type="text"
            id="name"
            name="tenNhanVien"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mt-2">
          <div className="mb-2"><b>Chức vụ</b></div>
          <select
            className="form-select pb-2 pt-2"
            id="type"
            name="chucVu"
            onChange={handleChange}
          >
            {positions.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-5 col-md-8 mt-2">
          <div className="mb-2"><b>Chi nhánh</b></div>
          <select
            className="form-select pb-2 pt-2"
            id="type"
            name="chiNhanh"
            onChange={handleChange}
          >
            {user?.Loai === "ChuHeThong" ? (
              branches.map((item, index) => (
                <option key={index} value={item.tenChiNhanh}>
                  {item.tenChiNhanh}
                </option>
              ))
            ) : (
              <option value={user?.chinhanh}>{user?.chinhanh}</option>
            )}
          </select>
        </div>
        <div className="col-auto mt-2">
          <div><b>Lương cơ bản</b></div>
          <div className='col-auto row'>
            <div className='col-auto row align-items-center gs-1'>
              <div className='col-auto mt-2 me-2' style={{ fontWeight: 600 }}>Từ</div>
              <div className='col-auto'>
                <input
                  className="form-control pb-2 pt-2 mt-2"
                  type="number"
                  placeholder="0"
                  name="luongDau"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='col-auto row align-items-center gs-1'>
              <div className='col-auto mt-2' style={{ fontWeight: 600 }}>đến</div>
              <div className='col-auto'>
                <input
                  className="form-control pb-2 pt-2 mt-2"
                  type="number"
                  placeholder="1000000000"
                  name="luongCuoi"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end mt-3">
        <button
          type="submit"
          className="btn pb-2 pt-2 mb-3 me-3"
          style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}
          onClick={onSearch}
        >
          Tìm kiếm
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="btn pb-2 pt-2 mb-3"
          style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}
        >
          Thêm
        </button>
      </div>

      <div className="text-end">
        <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      </div>
      <table className="table">
        <thead style={{ verticalAlign: "middle" }}>
          <tr className="table-secondary">
            <th>Mã nhân viên</th>
            <th>Họ và tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Chức vụ</th>
            <th>Bằng cấp</th>
            <th>Kinh nghiệm</th>
            <th>Chi nhánh làm việc</th>
            <th></th>
          </tr>
        </thead>
        {staffs.map((row, idx) => {
          return (
            <tr key={row.Id} style={{backgroundColor: '#fff'}}>
              <td>{row.maNhanVien}</td>
              <td>{row.tenNhanVien}</td>
              <td>{row.soDienThoai}</td>
              <td>{row.email}</td>
              <td>{row.chucVu}</td>
              <td>{row.bangCap}</td>
              <td>{row.kinhNghiem}</td>
              <td>{row.chiNhanh}</td>
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
        <FormChiTietNhanVien
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && staffs[rowToEdit]}
          staffs={staffs}
        />
      )}
    </div>
  );
};
export default XemThongTinNhanVien;
