import Scheduler, { Resource } from "devextreme-react/scheduler";
import { useState, useRef, useEffect, useContext } from "react";
import AppointmentToolTip from "../components/AppointmentToolTip";
import { locale, loadMessages, formatMessage } from "devextreme/localization";
import viMessages from "devextreme/localization/messages/vi.json";
import Api from "../api/Api";
import { AuthContext } from "../hook/AuthProvider";

const ScheduleDetail = () => {
  const { user } = useContext(AuthContext);
  //default views
  const views = ["day", "week", "agenda"];

  //setting vi language
  locale("vi");
  loadMessages(viMessages);

  //set appointment for scheduler
  const [appointments, setAppointments] = useState([]);
  const [nhaSi, setNhaSi] = useState([]);
  const [doctorId, setDoctorId] = useState(
    user?.Loai === "Nha sĩ" ? user.maNV : ""
  );

  //set today button
  const schedulerRef = useRef();
  // fake currentuser
  // const doctorId = "NV321";

  useEffect(() => {
    getNhasi();
    getdoctorId();
    getAppointments();
  }, []);
  const getdoctorId = () => {
    if (user?.Loai === "Nha sĩ") {
      if (user) {
        setDoctorId(user.maNV);
      }
    }
  };
  const getNhasi = async () => {
    if (user?.Loai !== "Nha sĩ") {
      const nhasi = await Api.getStaffsBySeacrh({
        maNhanVien: "",
        tenNhanVien: "",
        chucVu: "Nha sĩ",
        chiNhanh: user?.chinhanh,
        luongDau: "",
        luongCuoi: "",
      });
      setNhaSi(nhasi);
      setDoctorId(nhasi[0].maNhanVien);
    }
  };
  const onSearch = () => {
    console.log("ma" + doctorId);
    getAppointments();
  };
  const getAppointments = async () => {
    const endpoint = `/ScheduleManagement/getByField/LichHen/MaNS?fieldValue=${doctorId}`;
    const appointments = await Api.getDocByField(endpoint);
    console.log(appointments);
    setAppointments(
      appointments.map((item) => {
        const [startTime, endTime] = item.Gio.split("-");
        return {
          ...item,
          startDate: new Date(
            item.NgayHen + "T" + formatTime(startTime) + ":00.000Z"
          ),
          endDate: new Date(
            item.NgayHen + "T" + formatTime(endTime) + ":00.000Z"
          ),
          text: item.DichVu,
          color: "#0096FF",
        };
      })
    );
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const moveToToday = () => {
    let element = document.querySelectorAll(".dx-scheduler-navigator");
    const container = document.createElement("div");
    schedulerRef.current.instance.option("currentDate", new Date());
  };

  return (
    <div>
      <div className="row">
        <div className="col-auto mb-2">
          <button
            type="button"
            className="btn pb-2 pt-2 ps-3 pe-3 me-4"
            style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
            onClick={() => moveToToday()}
          >
            Hôm nay
          </button>

        </div>
        {user?.Loai !== "Nha sĩ" && (
          <>
            <div className="col-auto row g-0">
              <div className="col-auto mt-2 mb-2 ms-3"><b>Nha sĩ</b></div>
              <div className="col-auto row">
                <div className="col-auto" style={{ minWidth: "225px" }}>
                  <select
                    className="form-select pb-2 pt-2 mb-2"
                    id="type"
                    name="chiNhanh"
                    onChange={(e) => setDoctorId(e.target.value)}
                  >
                    {nhaSi.map((item, index) => (
                      <option key={index} value={item.maNhanVien}>
                        {item.tenNhanVien}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto mb-2 me-auto">
                  <button
                    className="btn pb-2 pt-2 ps-3 pe-3 me-1"
                    style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
                    onClick={onSearch}
                  >
                    Xem
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Scheduler
        ref={schedulerRef}
        timeZone="Greenwich"
        dataSource={appointments}
        views={views}
        showCurrentTimeIndicator={false}
        defaultCurrentView="day"
        startDayHour={8}
        endDayHour={20}
        cellDuration={15}
        editing={false}
        showAllDayPanel={false}
        style={{ minWidth: "400px" }}
        onAppointmentDblClick={(e) => {
          e.cancel = true;
        }}
        appointmentTooltipComponent={AppointmentToolTip}
        height={600}
      ></Scheduler>
    </div>
  );
};

export default ScheduleDetail;
