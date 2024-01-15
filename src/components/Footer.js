import React, { useState } from "react";
import Api from "../api/Api";
import { Modal, Button } from 'react-bootstrap';
const Footer = (props) => {
    const { style } = props
    const [text, setText] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const onSubmit = async (e) => {
        if (text != '') {
            e.preventDefault();
            const currentDate = new Date();
            const data = {
                ngay: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
                gio: `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}`,
                noidung: text
            }
            console.log(data);
            await Api.addFeedback(data);
            setText('');
            setShowDialog(true);
        }
    }

    return (
        <footer className="footer" style={{ color: "white", marginTop: "80px", ...style }}>
            <div className="container pt-4 pb-5">
                <div className="row">
                    <div className="col-md-3">
                        <img alt="" src="/images/logo2.png" />
                        <p className="mt-3" style={{ fontSize: "20px" }}>Giới thiệu</p>
                        <p>Phòng khám LOGOIPSUM đã được thành lập hơn 7 năm. Với kinh nghiệm và đội ngũ nha sĩ chuyện nghiệp chúng tôi tự tin sẽ đem đến nhưng dịch vụ tốt nhất.</p>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-md-3">
                        <p className="mt-3">
                            <span style={{ fontSize: "19px" }}>Giờ mở cửa toàn chi nhánh</span>
                            <br />
                            <ul>
                                <li>Sáng: 08:30 - 11:30</li>
                                <li>Chiều: 13:30 - 17:00</li>
                                <li>Tối: 17:00 - 20:00</li>
                            </ul>
                        </p>
                        <p className="mt-3">
                            <span style={{ fontSize: "19px" }}>Địa chỉ</span>
                            <ul>
                                <li>Thủ Đức, thành phố Hồ Chí Minh</li>
                                <li>Quận 7, thành phố Hồ Chí Minh</li>
                                <li>Quận 8, thành phố Hồ Chí Minh</li>
                                <li>Bình Thạnh, thành phố Hồ Chí Minh</li>
                            </ul>
                        </p>
                        <p className="mt-3" style={{ fontSize: "19px" }}>
                            Email: LOGOIPSUM@gmail.com
                            <br />
                            Phone: 0843593598
                        </p>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-md-4">
                        <p className="mt-3" style={{ fontSize: "19px" }}>Phản hồi của bạn</p>
                        <p>Vui lòng viết phản hồi của bạn phía dưới</p>
                        <div className="send-area col-10">
                            <form>
                                <textarea rows="4" className="mb-4" required value={text}
                                    onChange={(e) => { setText(e.target.value) }}></textarea>

                                <button className="btn btnGradient"
                                    onClick={(e) => onSubmit(e)}>Gửi</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Đã gửi thành công!</Modal.Body>
            </Modal>
        </footer>
    )
}
export default Footer