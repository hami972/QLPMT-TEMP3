import React, { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Api from "../api/Api";

const BookingPage = (props) => {
  const [branches, setBranches] = useState([]);
  const [formState, setFormState] = useState({
    ChiNhanh: "",
    HoTen: "",
    NgaySinh: "",
    SDT: "",
    DiaChi: "",
    email: "",
    LoiNhan: "",
  });
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    const branches = await Api.getAllBranchs();
    formState.ChiNhanh = branches[0]?.tenChiNhanh || "";
    setBranches(branches);
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    console.log(formState);
    setSuccessMessage("");
    if (
      formState.ChiNhanh != "" &&
      formState.HoTen != "" &&
      formState.SDT != "" &&
      formState.NgaySinh != ""
    ) {
      setErrors("");
      return true;
    } else {
      setErrors(
        "Bạn vui lòng nhập đầy đủ Họ tên, Ngày sinh và Số điện thoại để được nhân viên hỗ trợ tư vấn và đặt lịch nhé!"
      );
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    const currentDate = new Date();
    formState.ngay = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
      }-${currentDate.getDate()}`;
    formState.gio = `${currentDate.getHours()}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    formState.TinhTrang = "Chưa xử lý";

    const endpoint = "/ScheduleManagement/add/DatLich";
    const id = await Api.addDoc(endpoint, formState);
    if (id) {
      setFormState({
        ChiNhanh: branches[0]?.tenChiNhanh || "",
        HoTen: "",
        NgaySinh: "",
        SDT: "",
        DiaChi: "",
        email: "",
        LoiNhan: "",
      });
      setSuccessMessage("Bạn đã gửi lịch hẹn thành công!");
    }
  };
  return (
    <div style={{backgroundColor: '#000'}} >
      <TopNav />
      <section className="row g-0" >
        <div className="col-1"></div>
        <div className="col-sm-6 col-md-5 col-lg-4">
          <div  className="footer"
            style={{
              border: "2px solid grey",
              borderRadius: "5px",
              boxShadow: "3px 3px #888888",
              marginTop: "70px",
            }}
            align="center"
          >
            <form style={{color: '#fff'}}>
              <h4 align="center" className="mt-5 mb-4">
                Đặt lịch hẹn
              </h4>
              <div className="mb-3 mt-3 col-10">
                <select
                  className="form-select pb-3 pt-3"
                  aria-label="Chọn chi nhánh"
                  name="ChiNhanh"
                  onChange={handleChange}
                  value={formState.ChiNhanh}
                >
                  {branches.map((item, index) => (
                    <option key={index} value={item.tenChiNhanh}>
                      {item.tenChiNhanh}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 mt-3 col-10">
                <input
                  type="text"
                  className="form-control pb-3 pt-3"
                  id="HoTen"
                  name="HoTen"
                  value={formState.HoTen}
                  placeholder="Họ và tên"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3 col-10">
                <input
                  type="date"
                  className="form-control pb-3 pt-3"
                  id="NgaySinh"
                  name="NgaySinh"
                  value={formState.NgaySinh}
                  placeholder="Ngày sinh: "
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3 col-10">
                <input
                  type="tel"
                  className="form-control pb-3 pt-3"
                  id="SDT"
                  name="SDT"
                  value={formState.SDT}
                  placeholder="Số điện thoại"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3 col-10">
                <input
                  type="text"
                  className="form-control pb-3 pt-3"
                  id="DiaChi"
                  name="DiaChi"
                  value={formState.DiaChi}
                  placeholder="Địa chỉ"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3 col-10">
                <input
                  type="email"
                  className="form-control pb-3 pt-3"
                  id="email"
                  name="email"
                  value={formState.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </div>
              <div
                className="mb-3 mt-3 col-10 send-area"
                style={{ borderRadius: "5px", borderColor: "#D9D9D9" }}
              >
                <textarea
                  rows="4"
                  placeholder="Lời nhắn"
                  name="LoiNhan"
                  value={formState.LoiNhan}
                  onChange={handleChange}
                ></textarea>
              </div>
              {errors && <div className="error">{errors}</div>}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              <button
                type="submit"
                className="btn col-10 pb-3 pt-3 mb-5"
                style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}
                onClick={handleSubmit}
              >
                Gửi lịch hẹn
              </button>
            </form>
          </div>
        </div>
        <div className="col-sm-5 col-md-6 col-lg-7 d-none d-sm-block">
          <img
            alt=""
            src="/images/phongkham.png"
            style={{ width: "90%" }}
            align="right"
          />
        </div>
      </section>
      <section className="mt-5" style={{backgroundColor: '#8298FF', color: '#fff'}}>
        <div className="container">
          <div className="row g-0">
            <div className="col-md-6 pt-5 pb-5">
              <p style={{ fontSize: "36px" }}>Phòng khám LOGOIPSUM</p>
              <p>
                Phòng khám nha khoa của chúng tôi đã được thành lập từ năm 2015
                và đã phục vụ hàng trăm bệnh nhân trong suốt thời gian này.
                Chúng tôi tự hào mang lại cho khách hàng sự chăm sóc nha khoa
                chất lượng và đáng tin cậy
              </p>
              <p>
                Với đội ngũ bác sĩ nha khoa giàu kinh nghiệm và chuyên môn,
                phòng khám của chúng tôi có thể đáp ứng mọi nhu cầu nha khoa của
                khách hàng. Chúng tôi cung cấp các dịch vụ từ những khám và tư
                vấn sức khỏe răng miệng đến điều trị và phục hình nha khoa.
              </p>
            </div>
            <div className="col-1"></div>
            <div className="col-md-5">
              <img
                alt=""
                src="/images/kham4.png"
                style={{ width: "100%", marginBottom: "-5%", marginTop: "-5%" }}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default BookingPage;
