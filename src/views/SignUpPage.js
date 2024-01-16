import React, { useState, useEffect, useContext } from 'react';
import './style.css'
import { NavLink } from "react-router-dom"
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import moment from 'moment'
import { AuthContext } from '../hook/AuthProvider'
const SignUpPage = (props) => {
    const [errors, setErrors] = useState("");
    const [fullname, setFullName] = useState('')
    const [birthday, setBirthday] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [identify, setIdentify] = useState('')
    const [signinName, setSigninName] = useState('')
    const [password, setPassWord] = useState('')
    const [againPass, setAgainPass] = useState('')
    const { registerforKH } = useContext(AuthContext);
    function isPositiveInteger(A) {
        // && Number.isInteger(A)
        if (A > 0) {
            return true; // A là số nguyên dương
        } else {
            return false; // A không phải là số nguyên dương
        }
    }
    const validateForm = () => {
        if (fullname != '' && birthday != '' && phone != '' && address != '' && email != '' && identify != '' && password != '' && againPass != '') {
            if (password.length < 6) {
                setErrors('Mật khẩu phải lớn hơn 6 kí tự')
                return false
            }
            else if (password !== againPass) {
                setErrors('Mật khẩu nhắc lại không đúng')
                return false
            }
            else if (identify.length != 12) {
                setErrors("Căn cước công dân này không hợp lệ! Vui lòng nhập căn cước công dân có 12 chữ số.");
                return false;
            }
            else if (phone.length != 10) {
                setErrors("Số điện thoại này không hợp lệ! Vui lòng nhập số điện thoại có 10 chữ số.");
                return false;
            }
            else if (!isPositiveInteger(identify)) {
                setErrors("Căn cước công dân này không hợp lệ! Vui lòng nhập căn cước công dân là số nguyên dương.");
                return false;
            }
            else if (!isPositiveInteger(phone)) {
                setErrors("Số điện thoại này không hợp lệ! Vui lòng nhập số điện thoại là số nguyên dương.");
                return false;
            }
            else {
                setErrors("");
                return true;
            }
        }
        else {
            let errorFields = [];
            if (fullname == '') errorFields.push('tên')
            if (birthday == '') errorFields.push('ngày sinh')
            if (phone == '') errorFields.push('SDT')
            if (address == '') errorFields.push('địa chỉ')
            if (email == '') errorFields.push('email')
            if (identify == '') errorFields.push('CCCD')
            if (password == '') errorFields.push('mật khẩu')
            if (againPass == '') errorFields.push('nhắc lại mật khẩu')
            setErrors("Vui lòng nhập: " + errorFields.join(", "));
            return false;
        }
    }
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (password == againPass) {
            console.log('đk')
            registerforKH(email, password, fullname, phone, identify, birthday, address)
            setFullName('')
            setAddress('')
            setAgainPass('')
            setBirthday('')
            setEmail('')
            setIdentify('')
            setPassWord('')
            setPhone('')
        }
        else {
            alert('Password confirmation does not match!')
        }

    }
    return (
        <div style={{ backgroundColor: '#000', color: '#fff' }}>
            <TopNav />
            <section className="row g-0">
                <div className="col-1"></div>
                <div className="col-sm-6 col-md-5 col-lg-4" >
                    <div style={{ border: "2px solid grey", borderRadius: "5px", boxShadow: "3px 3px #888888", marginTop: "70px" }} className='footer' align="center">
                        <form>
                            <h4 align="center" className="mt-5 mb-4">Đăng ký</h4>
                            <div className="mb-3 mt-3 col-10">
                                <input type="text" className="form-control pb-3 pt-3" id="fullName" name="fullName" placeholder="Họ và tên" required onChange={(e) => setFullName(e.target.value)} value={fullname} />

                            </div>
                            <div className="mb-3 mt-3 col-10">
                                <input type="date" className="form-control pb-3 pt-3" id="birthday" name="birthday" placeholder="Ngày sinh: " max={moment().add(-1, "years").format('YYYY-MM-DD')} required onInvalid={e => e.target.setCustomValidity('Mời bạn nhập ngày sinh')} onInput={e => e.target.setCustomValidity('')} onChange={(e) => setBirthday(e.target.value)} value={birthday} />
                            </div>
                            <div className="mb-3 mt-3 col-10">
                                <input type="tel" className="form-control pb-3 pt-3" id="phone" name="phone" placeholder="Số điện thoại" required onChange={(e) => setPhone(e.target.value)} value={phone} />
                            </div>
                            <div className="mb-3 mt-3 col-10">
                                <input type="text" className="form-control pb-3 pt-3" id="address" name="address" placeholder="Địa chỉ" required onChange={(e) => setAddress(e.target.value)} value={address} />
                            </div>
                            <div className="mb-3 mt-3 col-10">
                                <input type="email" className="form-control pb-3 pt-3" id="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} value={email} />
                            </div>
                            <div className="mb-3 mt-3 col-10">
                                <input type="text" className="form-control pb-3 pt-3" id="CCCD" name="CCCD" placeholder="Căn cước công dân" required onChange={(e) => setIdentify(e.target.value)} value={identify} />
                            </div>
                            {/* <div className="mb-3 mt-3 col-10">
                                <input type="text" className="form-control pb-3 pt-3" id="username" name="username" placeholder="Tên đăng nhập" required onChange={(e) => setSigninName(e.target.value)} value={signinName}/>
                            </div> */}
                            <div className="col-10 mb-3 mt-3">
                                <input type="password" className="form-control pb-3 pt-3" id="password" name="password" placeholder="Mật khẩu" required onChange={(e) => setPassWord(e.target.value)} value={password} />
                            </div>


                            <div className="col-10 mb-3 mt-3">
                                <input type="password" className="form-control pb-3 pt-3" id="re-enter_password" name="re-enter_password" placeholder="Nhập lại mật khẩu" required onChange={(e) => setAgainPass(e.target.value)} value={againPass} />
                            </div>

                            <NavLink to="/sign_in" className="btn d-flex justify-content-center col-10 mb-2 mt-2" style={{ color: "#fff" }}>Đăng nhập nếu bạn đã có tài khoản</NavLink>
                            {errors && <div className="error">{errors}</div>}
                            <button type="submit" className="btn col-10 pb-3 pt-3 mb-5" style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }} onClick={(e) => { handleSignup(e) }}>Đăng ký</button>


                        </form>
                    </div>
                </div>
                <div className="col-sm-5 col-md-6 col-lg-7 d-none d-sm-block"><img alt="" src="/images/phongkham.png" style={{ width: "90%" }} align="right" /></div>
            </section >
            <section className="mt-5" style={{ background: 'linear-gradient(to right, #489BFF 0%, #A978F9 80%)', color: '#fff' }}>
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
export default SignUpPage;