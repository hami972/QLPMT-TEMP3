import React, { useState, useRef } from 'react'
import './style.css'
import ReactPaginate from 'react-paginate';
import TopNav from '../components/TopNav'
import Footer from '../components/Footer';
const DoctorsPage = (props) => {

    const pageToRef = useRef(null);


    //fake list doctor
    const doctorList = [
        {
            image: "/images/doctor10.png",
            fullName: "Nguyễn Gia Bảo",
            brach: "Thủ Đức, thành phố Hồ Chí Minh",
            speciality: "Chuyên khoa II Răng Hàm Mặt",
        },
        {
            image: "/images/doctor1.jpg",
            fullName: "Nguyễn Thanh Thư",
            brach: "Thủ Đức, thành phố Hồ Chí Minh",
            speciality: "Bác sĩ Răng Hàm Mặt",
        },
        {
            image: "/images/doctor8.png",
            fullName: "Phan Nguyễn Cao Trí",
            brach: "Thủ Đức, thành phố Hồ Chí Minh",
            speciality: "Thạc sĩ Răng Hàm Mặt",
        },
        {
            image: "/images/doctor6.png",
            fullName: "Lê Thị Lan Nhi",
            brach: "Thủ Đức, thành phố Hồ Chí Minh",
            speciality: "Chuyên khoa I Răng hàm mặt",
        },
        {
            image: "/images/doctor9.png",
            fullName: "Trần Gia Nghĩa",
            brach: "Thủ Đức, thành phố Hồ Chí Minh",
            speciality: "Chuyên khoa I Răng Hàm Mặt",
        },
        {
            image: "/images/doctor7.png",
            fullName: "Hoàng Thị Thảo",
            brach: "Quận 8, thành phố Hồ Chí Minh",
            speciality: "Bác sĩ Răng Hàm Mặt",
        },
        {
            image: "/images/doctor5.png",
            fullName: "Trần Thị Hà",
            brach: "Quận 7, thành phố Hồ Chí Minh",
            speciality: "Bác sĩ Răng Hàm Mặt",
        },
        {
            image: "/images/doctor11.png",
            fullName: "Trương Hoài An",
            brach: "Quận 7, thành phố Hồ Chí Minh",
            speciality: "Bác sĩ Răng Hàm Mặt",
        },
    ]
    const doctorPerPage = 4;
    const [startOffset, setStartOffset] = useState(0);
    const endOffset = startOffset + doctorPerPage;
    const currentDoctorList = doctorList.slice(startOffset, endOffset);
    const totalPages = Math.ceil(doctorList.length / doctorPerPage);

    const handlePageClick = (event) => {
        setStartOffset((event.selected * doctorPerPage) % doctorList.length)
        pageToRef.current.scrollIntoView();
    }

    return (
        <div style={{ backgroundColor: '#0D1117' }}>
            <TopNav />
            <header className="pt-4 pb-4 headerPage"><h3 align="center">Bác sĩ của chúng tôi</h3></header>
            <section className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-md-5 text-center">
                        <img alt="" src="/images/kham3.jpg" style={{ width: "90%" }} />
                    </div>
                    <div className="col-md-7 align-self-center mt-2">
                        <p><h4 style={{ color: "#FFF" }}>Đội ngũ bác sĩ</h4></p>
                        <p style={{ color: "#FFF" }}>Bác sĩ trong phòng khám nha khoa chuyên về chăm sóc và điều trị về vấn đề về răng và miệng. Họ là những chuyên gia có kiến thức vững chắc về cấu trúc và chức năng của răng, nướu và miệng. Đội ngũ bác sĩ nha khoa thường được đào tạo chuyên sâu và có kinh nghiệm trong các phương pháp điều trị như tẩy trắng răng, cạo vôi, chỉnh hình răng, nhổ răng, và nhiều phương pháp khác để giải quyết các vấn đề về răng và miệng của các bệnh nhân. Mục tiêu chính của bác sĩ nha khoa là đảm bảo sức khỏe và vẻ đẹp của răng và miệng cho bệnh nhân.</p>
                    </div>
                </div>
            </section>

            <section className="container mt-5 mb-5">
                <div className="row" ref={pageToRef}>
                    {currentDoctorList.map((item, index) => {
                        return (
                            <div className="col-sm-6 col-md-3 p-4" style={{ color: "#FFF" }}>
                                <img src={item.image} alt="" style={{ width: "100%" }} />
                                <p className="mt-3">
                                    {item.fullName}<br />
                                    Chuyên khoa: {item.speciality}<br />
                                    Chi nhánh:  {item.brach}
                                </p>

                            </div>
                        )
                    })}
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}//change when click new page
                        pageRangeDisplayed={2}//number page show in range 
                        marginPagesDisplayed={1} //1 left neighbor and 1 right neighbor
                        pageCount={totalPages}//totalPage
                        previousLabel="<"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link next-and-previous-button"
                        nextClassName="page-item"
                        nextLinkClassName="page-link next-and-previous-button"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination justify-content-center"
                        activeClassName="active"
                    />
                </div>

            </section>
            <Footer style={{ marginTop: "0px" }} />
        </div >
    );
}
export default DoctorsPage;