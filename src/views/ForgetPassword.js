import React from 'react'
import './style.css'
import TopNav from '../components/TopNav.js'
import { NavLink } from "react-router-dom"
import Footer from '../components/Footer.js'
import CodeGetPass from '../components/CodeGetPass.js'
import { useState, useContext } from 'react'
import { AuthContext } from '../hook/AuthProvider'
const ForgetPassword = (props) => {
    const [codePopup, setCodePopup] = useState(false);
    const { forgotPassword } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const handleForgot = async (e) => {
        e.preventDefault();
        // await api.sendEmail()
        forgotPassword(email)
    }
    return (
        <div style={{backgroundColor: '#000'}} >
            <TopNav />
            <section className="row g-0">
                <div className="col-1" ></div>
                <div className="col-sm-6 col-md-5 col-lg-4">
                    <div className="footer" style={{ border: "2px solid grey", borderRadius: "5px", boxShadow: "3px 3px #888888", marginTop: "70px" }} align="center">
                        <form>
                            <h4 align="center" className="mt-5 mb-4">Quên mật khẩu</h4>
                            <div className="mb-3 mt-3 col-10">
                                <input type="text" className="form-control pb-3 pt-3" id="username" name="username" placeholder="Email đăng ký" onInvalid={e => e.target.setCustomValidity('Mời bạn nhập email')} onInput={e => e.target.setCustomValidity('')} required onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <NavLink to="/sign_in" className="text-decoration-none d-flex justify-content-end col-10" style={{ fontWeight: "600", color: "black" }}>Quay về trang đăng nhập</NavLink>
                            <br></br>
                            <button type="submit" className="btn col-10 pb-3 pt-3" onClick={(e) => { handleForgot(e) }} style={{ backgroundColor: "#8298FF", color: "#FFFFFF", marginBottom: "300px" }} >Gửi</button>
                            {codePopup && (
                                <CodeGetPass trigger="true">
                                    <div className="mb-3 mt-3 col-10">
                                        <input type="text" className="form-control pb-3 pt-3" id="code" name="code" placeholder="Mã xác nhận" onInvalid={e => e.target.setCustomValidity('Mời bạn nhập mã xác nhận')} onInput={e => e.target.setCustomValidity('')} required />

                                    </div>
                                </CodeGetPass>
                            )}
                        </form>
                    </div>
                </div>

                <div className="col-sm-5 col-md-6 col-lg-7 d-none d-sm-block"><img alt="" src="/images/kham5.png" style={{ width: "90%" }} align="right" /></div>
            </section >
            <section className="mt-5" style={{ backgroundColor: "#F0F6FB" }}>
                <div className="container">
                    <div className="row g-0">
                        <div className="col-md-6 pt-5 pb-5">
                            <p style={{ fontSize: "36px" }}>Phòng khám LOGOIPSUM</p>
                            <p>Phòng khám nha khoa của chúng tôi đã được thành lập từ năm 2015 và đã phục vụ hàng trăm bệnh nhân trong suốt thời gian này. Chúng tôi tự hào mang lại cho khách hàng sự chăm sóc nha khoa chất lượng và đáng tin cậy</p>
                            <p>Với đội ngũ bác sĩ nha khoa giàu kinh nghiệm và chuyên môn, phòng khám của chúng tôi có thể đáp ứng mọi nhu cầu nha khoa của khách hàng. Chúng tôi cung cấp các dịch vụ từ những khám và tư vấn sức khỏe răng miệng đến điều trị và phục hình nha khoa.</p>


                        </div>
                        <div className="col-1"></div>
                        <div className="col-md-5">
                            <img alt="" src="/images/kham4.png" style={{ width: "100%", marginBottom: "-5%", marginTop: "-5%" }} />
                        </div>
                    </div>
                </div>

            </section>
            <Footer />
        </div >
    );
}
export default ForgetPassword;