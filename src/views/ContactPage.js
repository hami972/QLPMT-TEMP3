import React from 'react'
import './style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import TopNav from '../components/TopNav'
import Footer from '../components/Footer';
const ContactPage = (props) => {

    //fake brach list

    const braches = [
        {
            MaCN: "CN001",
            TenCN: "Chi nhánh 1",
            DiaChi: "Khu phố 6, Linh Trung, Thủ Đức, Hồ Chí Minh",
            Email: "nhakhoathuduc@gmail.com",
            SDT: "0835363598"
        },
        {
            MaCN: "CN002",
            TenCN: "Chi nhánh 2",
            DiaChi: "Lâm Văn Bền, Quận 7, Hồ Chí Minh",
            Email: "nhakhoaquan7@gmail.com",
            SDT: "0835363597"
        },
        {
            MaCN: "CN003",
            TenCN: "Chi nhánh 3",
            DiaChi: "Huỳnh Tấn Phát, Quận 8, Hồ Chí Minh",
            Email: "nhakhoathuducquan8@gmail.com",
            SDT: "0835363599"
        },
        {
            MaCN: "CN004",
            TenCN: "Chi nhánh 4",
            DiaChi: "Điện Biên Phủ, quận Bình Thạnh, Hồ Chí Minh",
            Email: "nhakhoabinhthanh@gmail.com",
            SDT: "0835363600"
        },

    ]


    const reviewList = [
        {
            fullname: "Trần Hoàng Thảo An ",
            image: "/images/khach1.png",
            brach: "Chi nhánh Thủ Đức",
            review: "Có các bác sĩ nha khoa và nhân viên có kinh nghiệm, đào tạo tốt và nhiệt tình, tạo cảm giác an tâm cho bệnh nhân."
        },
        {
            fullname: "Trần Thị Yến",
            image: "/images/khach5.png",
            brach: "Chi nhánh quận 7",
            review: "Không kéo dài thời gian chờ đợi cho bệnh nhân, tạo cảm giác tiện lợi và tôn trọng thời gian của chúng tôi."
        },
        {
            fullname: "Hoàng Văn Bình",
            image: "/images/khach2.png",
            brach: "Chi nhánh Thủ Đức",
            review: "Cung cấp thông tin rõ ràng và tư vấn chăm sóc sau điều trị, giúp bệnh nhân hiểu rõ về tình trạng sức khỏe của mình."
        },
        {
            fullname: "Phan Hải Anh",
            image: "/images/khach4.png",
            brach: "Chi nhánh Thủ Đức",
            review: "Nha khoa tốt có bác sĩ rất tốt, họ giúp răng của mình trở nên khỏe mạnh và sáng bóng. Cháu rất vui"
        },
        {
            fullname: "Hoàng Lê Bảo Châu",
            image: "/images/khach3.png",
            brach: "Chi nhánh Thủ Đức",
            review: "Bác sĩ và nhân viên tại nha khoa tốt thường rất tận tâm. Thời gian đặt lịch rất rõ ràng không cần chờ đợi."
        },
        {
            fullname: "Trần Vũ Thảo My",
            image: "/images/khach6.png",
            brach: "Chi nhánh quận 8",
            review: "Đội ngũ y tá ở đây rất chu đáo và nhẹ nhàng, họ luôn tạo cảm giác an tâm và thoải mái cho bệnh nhân."
        }
        ,
        {
            fullname: "Trương Anh Trinh",
            image: "/images/khach7.png",
            brach: "Chi nhánh quận 7",
            review: "Tôi thích việc được tư vấn về cách chăm sóc răng miệng và lựa chọn sản phẩm phù hợp cho nụ cười của mình."
        }
        ,
        {
            fullname: "Phạm Hải Lam",
            image: "/images/khach8.png",
            brach: "Chi nhánh Thủ Đức",
            review: "Bác sĩ nữ ở nha khoa tốt thường rất tận tâm và chu đáo trong việc tư vấn về việc chăm sóc răng miệng sau điều trị."
        }
        ,
        {
            fullname: "Nguyễn Thị Bảo Thương",
            image: "/images/khach9.png",
            brach: "Chi nhánh Thủ Đức",
            review: "Tôi thích điều trị ở nha khoa tốt vì họ sử dụng các trang thiết bị hiện đại và phương pháp làm đẹp răng hiệu quả."
        }
    ]
    //custom setting for slider
    var settings = {
        dots: true,
        infinite: true,
        swipeToSlide: true,
        speed: 500,

        slidesToShow: 3,//number show each slide
        slidesToScroll: 3,//number item next 
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: false
                }
            }

        ]
    };


    return (
        <div style={{ backgroundColor: "black" }}>
            <TopNav />
            <header className="pt-4 pb-4 headerPage"><h3 align="center">Liên lạc</h3></header>
            <section className="container mt-5">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6" >
                        <img alt="" src="images/phongkham.jpg" style={{ width: "100%" }} />
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </section>
            <section className="container mb-5">
                <div className="mt-4">

                    <div className="row" style={{ color: "#FFF" }}>
                        {braches.map((item, index) => {
                            return (
                                <div className="mt-4">
                                    <h3 align="center">{item.TenCN}</h3>
                                    <div className="row">
                                        <div className="col-md-4 text-center mt-2">
                                            <i className="fa-solid fa-location-dot icon1" style={{ fontSize: "25px" }}></i>
                                            <p><h4>Địa chỉ</h4></p>
                                            {item.DiaChi}
                                        </div>
                                        <div className="col-md-4 text-center mt-2">
                                            <i className="fa-solid fa-phone-volume icon1" style={{ fontSize: "25px" }}></i>
                                            <p><h4>Liên lạc</h4></p>
                                            {item.Email}<br />
                                            Phone : {item.SDT}
                                        </div>
                                        <div className="col-md-4 text-center mt-2">
                                            <i className="fa-regular fa-clock icon1" style={{ fontSize: "25px" }}></i>
                                            <p><h4>Giờ mở cửa</h4></p>
                                            Thứ 2 - Thứ 7: 09:00 – 20:00<br />
                                            Chủ nhật: 10:30 – 22:00
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section >
            <section className='container'>
                <h3 align="center" style={{ color: "#FFF" }}>Phản hồi của khách hàng</h3>
                <p className='text-center' style={{ color: "#FFF" }}>Cảm ơn bạn đã tin tưởng chúng tôi</p>
                <div className="container-fluid mt-4" align="center">
                    <Slider {...settings}>
                        {reviewList.map((item, index) => {
                            return (
                                <div className="container mb-2" >
                                    <div className="p-4" style={{ color: "#FFF" }}>
                                        <div className="custom-slider-item pt-5 pb-5 pe-3 px-3 mb-4" >
                                            <p className="truncation-text">{item.review}</p>
                                        </div>
                                        <img alt="" className="img-thumbnail" src={item.image} style={{ borderRadius: "50%", width: "40%" }} />
                                        <h5 className='mt-2'>{item.fullname}</h5>
                                        <p>{item.brach}</p>
                                    </div>
                                </div>
                            )
                        })}

                    </Slider>
                </div>

            </section >
            <Footer />
        </div >
    );
}
export default ContactPage;