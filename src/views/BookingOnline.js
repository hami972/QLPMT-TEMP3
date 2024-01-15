import { useState, useEffect, useContext } from "react";
import moment from "moment";
import { FormBookingSchedule } from "../components/FormBookingSchedule";
import Api from "../api/Api";
import { AuthContext } from '../hook/AuthProvider'
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
const BookingOnline = () => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [doctorSchedules, setDoctorSchedules] = useState();
  const [doctors, setDoctors] = useState([]);
  const [flag, setFlag] = useState("");

  useEffect(() => {
    getDoctorSchedules();
  }, []);

  const getDoctorSchedules = async () => {
    const endpoint1 = "/ScheduleManagement/getAll/LichBacSi";
    const doctorSchedules = await Api.getDocs(endpoint1);

    const endpoint2 = "/ScheduleManagement/getAll/NhanVien";
    const doctors = await Api.getDocs(endpoint2);

    setDoctorSchedules(doctorSchedules);
    setDoctors(
      doctors.filter((item) => {
        item.date = moment().format("YYYY-MM-DD");
        return item.chucVu === "Nha sĩ";
      })
    );
  };

  const changeDate = (e, MaNS) => {
    setDoctors(
      doctors.map((item) =>
        item.maNhanVien === MaNS ? { ...item, date: e.target.value } : item
      )
    );
  };

  const handleSubmit = async (newData) => {
    const res = await Api.getStaffsBySeacrh()
    if (flag == "add") {
      const endpoint = "/ScheduleManagement/add/LichHen";
      const id = await Api.addDoc(endpoint, { ...newData, chiNhanh: selectedItem?.doctor.chiNhanh });

      const newWorkTime = {
        gio: selectedItem.selectedWorkTime.gio,
        maLichHen: id,
      };

      const newWorkTimes = selectedItem.workTimes.map((item) =>
        item.gio === newWorkTime.gio ? newWorkTime : item
      );

      selectedItem.doctorSchedule.lich[
        convertDateFormat(selectedItem.doctor.date)
      ] = newWorkTimes;
      const newDoctorSchedule = selectedItem.doctorSchedule;
      const endpoint2 =
        "/ScheduleManagement/update/LichBacSi/" +
        selectedItem.doctorSchedule.Id;
      console.log(newDoctorSchedule);
      const success = await Api.updateDoc(endpoint2, newDoctorSchedule);

      if (success) {
        setDoctorSchedules(
          doctorSchedules.map((item) =>
            item.Id == newDoctorSchedule.Id ? newDoctorSchedule : item
          )
        );
      }
    } else if (flag == "edit") {
      const endpoint = "/ScheduleManagement/update/LichHen/" + newData.Id;
      const success = await Api.updateDoc(endpoint, { ...newData, chiNhanh: selectedItem?.doctor.chiNhanh });
    }
  };

  const handleDelete = async (formData) => {
    const endpoint = "/ScheduleManagement/delete/LichHen/" + formData.Id;
    const success = await Api.deleteDoc(endpoint);
    if (success) {
      const newWorkTime = {
        gio: selectedItem.selectedWorkTime.gio,
        maLichHen: null,
      };

      const newWorkTimes = selectedItem.workTimes.map((item) =>
        item.gio === newWorkTime.gio ? newWorkTime : item
      );

      selectedItem.doctorSchedule.lich[
        convertDateFormat(selectedItem.doctor.date)
      ] = newWorkTimes;
      const newDoctorSchedule = selectedItem.doctorSchedule;
      const endpoint2 =
        "/ScheduleManagement/update/LichBacSi/" +
        selectedItem.doctorSchedule.Id;
      console.log(newDoctorSchedule);
      const success2 = await Api.updateDoc(endpoint2, newDoctorSchedule);

      if (success2) {
        setDoctorSchedules(
          doctorSchedules.map((item) =>
            item.Id == newDoctorSchedule.Id ? newDoctorSchedule : item
          )
        );
      }
    }
  };

  const setItemToEdit = async (worktime, doctor) => {
    const doctorSchedule = doctorSchedules.find((item1) => {
      return (
        doctor.maNhanVien === item1.maNS &&
        new Date(doctor.date).getMonth() + 1 === parseInt(item1.thang) &&
        new Date(doctor.date).getFullYear() === parseInt(item1.nam)
      );
    });
    if (worktime.maLichHen === null) {
      setFlag("add");
      const appointment = {
        MaBN: "",
        TenBN: "",
        SDT: "",
        MaNS: doctor.maNhanVien,
        TenNS: doctor.tenNhanVien,
        NgayHen: doctor.date,
        Gio: worktime.gio,
        DichVu: "",
        GhiChu: "",
        TinhTrang: "Đang chờ",
      };
      setSelectedItem({
        appointment: appointment,
        doctor: doctor,
        doctorSchedule: doctorSchedule,
        workTimes: doctorSchedule.lich[convertDateFormat(doctor.date)],
        selectedWorkTime: worktime,
      });
      setModalOpen(true);
    } else {
      setFlag("edit");
      const endpoint = "/ScheduleManagement/get/LichHen/" + worktime.maLichHen;
      const appointment = await Api.getDoc(endpoint);
      if (user !== null && appointment.TenBN === user?.ten && appointment.SDT === user?.SDT) {
        setSelectedItem({
          appointment: { ...appointment, Id: worktime.maLichHen },
          doctor: doctor,
          doctorSchedule: doctorSchedule,
          workTimes: doctorSchedule.lich[convertDateFormat(doctor.date)],
          selectedWorkTime: worktime,
        });
        setModalOpen(true);
      }
    }
  };

  function convertDateFormat(targetDate) {
    const parts = targetDate.split("-");
    const formattedDate = `${parseInt(parts[2])}/${parseInt(
      parts[1]
    )}/${parseInt(parts[0])}`;
    return formattedDate;
  }

  function getWorkTimes(item) {
    const doctorSchedule = doctorSchedules.find((item1) => {
      return (
        item.maNhanVien === item1.maNS &&
        new Date(item.date).getMonth() + 1 === parseInt(item1.thang) &&
        new Date(item.date).getFullYear() === parseInt(item1.nam)
      );
    });
    return doctorSchedule.lich[convertDateFormat(item.date)];
  }

  function getWorkTime(item) {
    return doctorSchedules.find((item1) => {
      return (
        item.maNhanVien === item1.maNS &&
        new Date(item.date).getMonth() + 1 === parseInt(item1.thang) &&
        new Date(item.date).getFullYear() === parseInt(item1.nam) &&
        item1.lich[convertDateFormat(item.date)].length !== 0
      );
    });
  }

  return (
    <div>
      <TopNav />
      <div style={{ minHeight: "300px" }}>
        {doctors.map((item) => {
          return (
            <div
              className="row p-2 m-3"
              style={{
                border: "2px solid grey",
                borderRadius: "5px",
                boxShadow: "3px 3px #8298FF",
              }}
            >
              <div className="col-lg-6 mt-2">
                <div className="row justify-content-center align-items-center">
                  <div className="col-auto">
                    <img
                      alt=""
                      src="/images/ava.png"
                      style={{ borderRadius: "50%", width: "100px" }}
                    />
                  </div>
                  <div className="col">
                    <div>
                      {item.bangCap}, {item.tenNhanVien}
                    </div>
                    <div>Kinh nghiệm: {item.kinhNghiem}</div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="datepicker-wrp">
                  <div className="btn-wrp">
                    <input
                      type="date"
                      className="btn-clck"
                      value={item.date}
                      min={moment().format("YYYY-MM-DD")}
                      onChange={(e) => changeDate(e, item.maNhanVien)}
                    />
                  </div>
                  <button className="btn btnIconDate">
                    <img alt="" src="/images/dropdown.png" />
                  </button>
                </div>
                <div
                  style={{
                    height: "340px",
                    overflowY: "auto",
                    fontWeight: "bold",
                  }}
                >
                  <div className="row ms-0 me-0" style={{ fontWeight: "bold" }}>
                    {!getWorkTime(item) ? (
                      <div className="mt-3">Không có lịch</div>
                    ) : (
                      getWorkTimes(item).map((worktime, index) => {
                        return (
                          <div className="col-auto" style={{ cursor: "default" }}>
                            <div
                              className="mt-3 p-2"
                              style={{
                                backgroundColor:
                                  worktime.maLichHen !== null
                                    ? "#bfbfbf"
                                    : "#0096FF",
                              }}
                              onClick={() =>
                                setItemToEdit(worktime, item)}
                            >
                              {worktime.gio}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {modalOpen && (
          <FormBookingSchedule
            closeModal={() => {
              setModalOpen(false);
              setSelectedItem(null);
            }}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            defaultValue={selectedItem !== null && selectedItem.appointment}
            flag={flag}
          />
        )}
      </div>
      <Footer style={{ marginTop: 0 }} />
    </div>
  );
};
export default BookingOnline;
