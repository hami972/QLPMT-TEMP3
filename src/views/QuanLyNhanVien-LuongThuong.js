import { BsFillTrashFill, BsFillPencilFill, BsEye } from "react-icons/bs";
import { useState, useEffect, useContext } from "react";
import { FormLuongThuong } from "../components/FormLuongThuong";
import Api from "../api/Api";
import { AuthContext } from "../hook/AuthProvider";

const LuongThuong = () => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [bonuses, setBonuses] = useState([]);
  const [branches, setBranches] = useState(user?.chinhanh || []);
  const [targetBranch, setTargetBranch] = useState("Tất cả");
  useEffect(() => {
    getBonuses();
    getBranches();
  }, []);
  const getBranches = async () => {
    if (user?.Loai === "ChuHeThong") {
      const branches = await Api.getAllBranchs();
      setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
    }
  };
  const getBonuses = async () => {
    const endpoint = "/StaffManagement/getAll/LuongThuong";
    const bonuses = await Api.getDocs(endpoint);
    const currentDate = new Date();
    if (user?.Loai !== "ChuHeThong") {
      const fil = bonuses.filter(
        (item, idx) =>
          item.chiNhanh === user?.chinhanh || item.chiNhanh === "Tất cả"
      );
      setBonuses(
        fil.filter(
          (item) =>
            item.Thang == currentDate.getMonth() + 1 &&
            item.Nam == currentDate.getFullYear()
        )
      );
    } else {
      setBonuses(
        bonuses.filter(
          (item) =>
            item.Thang == currentDate.getMonth() + 1 &&
            item.Nam == currentDate.getFullYear()
        )
      );
    }
  };

  const handleSubmit = async (newRow) => {
    if (rowToEdit == null) {
      let chiNhanh = "";
      if (user?.Loai === "ChuHeThong") {
        chiNhanh = newRow.chiNhanh;
      } else {
        chiNhanh = user?.chinhanh;
      }
      const endpoint = "/StaffManagement/add/LuongThuong";
      const id = await Api.addDoc(endpoint, { ...newRow, chiNhanh: chiNhanh });
      newRow.Id = id;
      setBonuses([...bonuses, newRow]);
    } else {
      const endpoint = "/StaffManagement/LuongThuong/update/" + newRow.Id;
      await Api.updateDoc(endpoint, newRow);
      let updatedBonuses = bonuses.map((currRow, idx) => {
        if (idx !== rowToEdit) return currRow;
        return newRow;
      });
      setBonuses(updatedBonuses);
    }
  };

  const handleDeleteRow = async (targetIndex) => {
    const shouldDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa lương thưởng này không?'
    );
    if (shouldDelete) {
      const endpoint =
        "/StaffManagement/LuongThuong/delete/" + bonuses[targetIndex].Id;
      await Api.deleteDoc(endpoint);
      setBonuses(bonuses.filter((_, idx) => idx !== targetIndex));
    }
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  return (
    <div >
      <div className="row align-items-center" style={{ color: '#fff' }}>
        <div className="col-auto mb-3"><b>Áp dụng: </b></div>
        <div className="col-lg-5 col-md-7 me-3 mb-3">
          <select
            className="form-select pb-2 pt-2"
            id="type"
            name="chiNhanh"
            onChange={async (e) => {
              const endpoint = "/StaffManagement/getAll/LuongThuong";
              const bonuses = await Api.getDocs(endpoint);
              if (user?.Loai === "ChuHeThong") {
                const fil = bonuses.filter(
                  (item, idx) => item.chiNhanh === e.target.value
                );
                setBonuses(fil);
              } else {
                const fil = bonuses.filter(
                  (item, idx) =>
                    item.chiNhanh === e.target.value || item.chiNhanh === "Tất cả"
                );
                setBonuses(fil);
              }
            }}
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
        <div className="col-auto mb-3">
          <button
            type="submit"
            className="btn pb-2 pt-2 btnGradient"
            onClick={() => setModalOpen(true)}
          >
            Thêm
          </button>
        </div>
      </div>
      <table className="table table-dark">
        <thead style={{ verticalAlign: "middle" }}>
          <tr>
            <th>Loại lương thưởng</th>
            <th>Tiền</th>
            <th>Ghi chú</th>
            <th>Tháng</th>
            <th>Năm</th>
            <th>Loại nhân viên</th>
            <th>Mã nhân viên</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bonuses.map((item, index) => (
            <tr key={index}>
              <td>{item.LoaiLuongThuong}</td>
              <td>{new Intl.NumberFormat("en-DE").format(item.Tien)}</td>
              <td>{item.GhiChu}</td>
              <td>{item.Thang}</td>
              <td>{item.Nam}</td>
              <td>{item.LoaiNhanVien}</td>
              <td>{item.MaNV}</td>
              <td className="fit">
                <span className="actions">
                  <BsFillPencilFill
                    className="edit-btn"
                    onClick={() => handleEditRow(index)}
                  />
                  <BsFillTrashFill
                    className="delete-btn"
                    onClick={() => handleDeleteRow(index)}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <FormLuongThuong
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          defaultValue={rowToEdit !== null && bonuses[rowToEdit]}
          onSubmit={handleSubmit}
          branches={branches}
        />
      )}
    </div>
  );
};
export default LuongThuong;
