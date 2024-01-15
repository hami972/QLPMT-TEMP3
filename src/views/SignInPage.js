import React, { useState, useEffect, useContext } from 'react';
import './style.css'
import TopNav from '../components/TopNav.js'
import { NavLink, useHistory } from "react-router-dom"
import Footer from '../components/Footer.js'
import { AuthContext } from '../hook/AuthProvider'

const SignInPage = (props) => {
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const [userInfo, setUserInfo] = useState(null)
    const [flag, setFlag] = useState(false)
    const { Login, user } = useContext(AuthContext);
    const history = useHistory();


    const handleSignin = async (e) => {
        e.preventDefault();
        //    const user = await api.SignIn(name,pass)
        //    setUserInfo(user.userInfo)
        //    if(user.flag)
        //    {
        //     history.push('/')
        //    }
        //    else{
        //     alert('Sign in unsuccessfully')
        //    }
        Login(name, pass, history)
        // if(user!=null){
        //     console.log('redirect'+redirectTo)
        //     history.push(redirectTo);
        // }

    }

    return (
        <div style={{ backgroundColor: '#000', color: '#fff' }}>
            <TopNav />
            <section className="row g-0">
                <div className="col-1"></div>
                <div className="col-sm-6 col-md-5 col-lg-4 " >
                    <div style={{ border: "2px solid grey", borderRadius: "5px", boxShadow: "3px 3px #888888", marginTop: "70px" }} align="center" className='footer'>
                        <form>
                            <h4 align="center" className="mt-5 mb-4">Đăng nhập</h4>
                            <div className="mb-3 mt-3 col-10">
                                <input type="email" className="form-control pb-3 pt-3" id="username" name="username" placeholder="Email" onInvalid={e => e.target.setCustomValidity('Mời bạn nhập email')} onInput={e => e.target.setCustomValidity('')} required onChange={(e) => setName(e.target.value)} value={name} />
                            </div>
                            <div className="col-10 mt-3 mb-2">
                                <input type="password" className="form-control pb-3 pt-3" id="password" name="password" placeholder="Mật khẩu" onInvalid={e => e.target.setCustomValidity('Mời bạn nhập mật khẩu')} onInput={e => e.target.setCustomValidity('')} required onChange={(e) => setPass(e.target.value)} value={pass} />
                            </div>
                            <NavLink to="/forgetpassword" className="text-decoration-none d-flex justify-content-end col-10" style={{ fontWeight: "600", color: "black" }}>Bạn quên mật khẩu?</NavLink>

                            <NavLink to="/sign_up" className="btn d-flex justify-content-center col-10 mb-2 mt-2" style={{ color: "#fff" }}>Nếu bạn chưa có tài khoản, đăng ký ngay!</NavLink>

                            {<button type="submit" className="btn col-10 pb-3 pt-3" style={{ backgroundColor: "#8298FF", color: "#FFFFFF", marginBottom: "300px" }} onClick={handleSignin}>Đăng nhập</button>}
                        </form>
                    </div>
                </div>
                <div className="col-sm-5 col-md-6 col-lg-7 d-none d-sm-block"><img alt="" src="/images/phongkham.png" style={{ width: "90%" }} align="right" /></div>
            </section >
            <section className="mt-5" style={{ backgroundColor: '#8298FF', color: '#fff' }}>
                <div className="container">
                    <div className="row g-0">
                        <div className="col-md-6 pt-5 pb-5">
                            <p style={{ fontSize: "36px" }}>Phòng khám ABC</p>
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
export default SignInPage;