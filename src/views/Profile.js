import moment from "moment"
import React, { useState, useEffect, useContext } from 'react';
import TopNav from "../components/TopNav"
import Footer from "../components/Footer"
import { AuthContext } from '../hook/AuthProvider'
import Api from "../api/Api";
import CustomModal from '../components/MessageBox.js';
const Profile = () => {
  const { user } = useContext(AuthContext);
  const [showDialog, setShowDialog] = useState(false);
  const [branches, setBranches] = useState([]);
  const [ndshow, setNdshow] = useState('');
  const handleShowDialog = (body) => {
    setNdshow(body)
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  const getBranches = async () => {
    const branche = await Api.getAllBranchs();
    setBranches([...branche]);
  };
  useEffect(() => {
    getBranches();
  }, []);
  const [formState, setFormState] = useState(user ||
  {
    ten: '',
    tuoi: '',
    gioiTinh: '',
    SDT: '',
    CCCD: ''
  }
  );
  const onchange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;
    await Api.updateUser(formState)
    handleShowDialog("Lưu thông tin thành công!")

  };
  return (
    <div style={{ backgroundColor: "#0D1117" }}>
      <TopNav />
      <div
        className="container mt-5 pb-5"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          backgroundColor: "#6a7785",
          borderRadius: "10px",
        }}
      >
        <div className="row ms-md-3 me-md-3 ms-1 me-1">
          <h2
            className="mt-3 mb-3 textGradient"
            align="center"
          >
            HỒ SƠ CÁ NHÂN
          </h2>
          <div
            className="col-sm-auto p-lg-5 p-4 mb-3 sticky-top"
            style={{ backgroundColor: "#F0F6FB", height: "fit-content", background: "linear-gradient(to right, #489BFF 0%, #A978F9 80%)" }}
          >
            <div className="upload">
              <img
                src="/images/ava.png"
                style={{ width: "120px", height: "120px" }}
                alt=""
              />
              {/* <div className="round">
                                <input type="file" accept="image/*" />
                                <i className="fa fa-camera" style={{ color: "#fff" }}></i>
                            </div> */}
            </div>
            <div style={{ textAlign: "center", fontSize: "18px" }}>
              <div className="mt-2 pe-sm-3 ps-sm-3">
                <b>{user?.ten || ""}</b>
              </div>
              {user?.Loai != "KhachHang" && (
                <div
                  className="mt-2 pe-sm-3 ps-sm-3"
                  style={{ color: "#0096FF" }}
                >
                  <b>{user?.maNV}</b>
                </div>
              )}
              {/* {user?.Loai!='KhachHang'&&<div className="mt-5 d-none d-sm-block" style={{ fontSize: "16px", color: "#858585" }}>
                                <hr />
                                <div>Vào làm việc từ</div>
                                <div>12/10/2020</div>
                            </div>} */}
            </div>
          </div>
          <div className="col-sm ms-md-4">
            <form className="row ms-0 me-0" style={{ fontWeight: "500" }}>
              <div className="col-md-6">
                <div className="mb-2">Họ và tên</div>
                <input
                  type="text"
                  className="form-control pb-2 pt-2 mb-2"
                  id="fullName"
                  name="ten"
                  value={formState?.ten}
                  onChange={onchange}
                />
              </div>
              {user?.Loai != "KhachHang" && (
                <div className="col-md-6">
                  <div className="mb-2 col-md-6">Chức vụ</div>
                  <div className="form-control pb-2 pt-2 mb-2 col-md-6">
                    {formState?.Loai}
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div className="mb-2 col-md-6">Ngày sinh</div>
                <input
                  type="date"
                  className="form-control pb-2 pt-2 mb-2"
                  id="birthday"
                  name="tuoi"
                  max={moment().add(-24, "years").format("YYYY-MM-DD")}
                  value={formState?.tuoi}
                  onChange={onchange}
                />
              </div>
              <div className="col-md-6">
                <div className="mb-2 col-md-6">Giới tính</div>
                <select
                  className="form-select pb-2 pt-2 col-md-6 mb-2"
                  aria-label="Chọn chi nhánh"
                  onChange={(e) =>
                    setFormState({ ...formState, gioiTinh: e.target.value })
                  }
                  value={formState?.gioiTinh}
                >
                  <option value="nam">
                    Nam
                  </option>
                  <option value="nữ">Nữ</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="mb-2">Số điện thoại</div>
                <input
                  type="tel"
                  className="form-control pb-2 pt-2 mb-2"
                  id="phone"
                  name="SDT"
                  value={formState?.SDT}
                  onChange={onchange}
                />
              </div>
              <div className="col-md-6">
                <div className="mb-2">Email</div>
                <input
                  type="email"
                  className="form-control pb-2 pt-2 mb-2"
                  id="email"
                  name="email"
                  value={formState?.email}
                />
              </div>
              <div className="col-md-6">
                <div className="mb-2">Căn cước công dân</div>
                <input
                  type="text"
                  className="form-control pb-2 pt-2 mb-2"
                  id="CCCD"
                  name="CCCD"
                  value={formState?.CCCD}
                  onChange={onchange}
                />
              </div>
              {/* {user?.Loai != "KhachHang" && (
                  <div className="col-md-6">
                    <div className="mb-2 col-md-6">Chi nhánh</div>
                    <select
                      className="form-select pb-2 pt-2 col-md-6 mb-2"
                      aria-label="Chọn chi nhánh"
                      value={formState?.chinhanh}
                    >
                      {branches.map((item, index) => (
                        <option key={index} value={item.tenChiNhanh}>
                          {item.tenChiNhanh}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}
              {user?.Loai != "KhachHang" && (
                <div className="col-md-6">
                  <div className="mb-2 col-md-6">Chi nhánh</div>
                  <div className="form-control pb-2 pt-2 mb-2 col-md-6" style={{ minHeight: "40px" }}>
                    {formState?.chinhanh}
                  </div>
                </div>
              )}
              {/* <div className="col-md-6">
                                <div className="mb-2">Tên đăng nhập</div>
                                <input type="text" className="form-control pb-2 pt-2 mb-2" id="username" name="username" />
                            </div> */}
              {/* <div className="col-md-6">
                                <div className="mb-2">Mật khẩu</div>
                                <input type="password" className="form-control pb-2 pt-2 mb-2" id="re-enter_password" name="re-enter_password" />
                            </div> */}
              <div className="mt-3 text-end">
                <button
                  type="submit"
                  className="btn pb-2 pt-2 btnGradient"
                  onClick={(e) => handleSubmit(e)}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CustomModal
        show={showDialog}
        handleClose={handleCloseDialog}
        body={ndshow}
      />
      <Footer />
    </div>
  );
}
export default Profile