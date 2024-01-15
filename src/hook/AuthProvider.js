import React, { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./FirebaseConfig";
import Api from "../api/Api";
import CustomModal from '../components/MessageBox.js';
import nav from './PhanQuyen'
import api from "../api/Api";
export const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [ndshow, setNdshow] = useState('');
  const [scope, setScope] = useState(nav.nav0);
  const [scopeQL, setScopeQL] = useState(nav.nav2_2);
  const [scopeQLLH, setScopeQLLH] = useState(nav.nav2_5_1);
  // Function để mở và đóng Modal
  const handleShowDialog = (body) => {
    setNdshow(body)
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  const [user, setUser] = useState(null);
  const FirstLogin = async (id) => {
    console.log('id' + id)
    const userData = await Api.getUserData(id)
      .catch(error => console.error(error));
    console.log(userData)
    if (userData && userData.id) {
      // console.log(userData)
      setUser(userData)
      if (userData.Loai === 'KhachHang') {
        if (userData.CCCD !== "") {
          const patients = await api.getPatientsBySeacrh({
            maBenhNhan: "",
            tenBenhNhan: "",
            CCCD: userData.CCCD,
            soDienThoai: ""
          })
          if (patients.length > 0) {
            setScope(nav.nav1)
          }
          else setScope(nav.nav0)
        }
        else setScope(nav.nav0)

      }
      else {
        setScope(nav.nav2)
        if (userData.Loai === 'Quản lý') {
          setScopeQL(nav.nav2_1)
        }
        else if (userData.Loai === 'Tiếp tân') {
          setScopeQL(nav.nav2_2)
          setScopeQLLH(nav.nav2_2_1)
        }
        else if (userData.Loai === 'ChuHeThong') {
          setScopeQL(nav.nav2_3)
        }
        else if (userData.Loai === 'Phụ tá') {
          setScopeQL(nav.nav2_4)
          setScopeQLLH(nav.nav2_4_1)
        }
        else if (userData.Loai === 'Nha sĩ') {
          setScopeQL(nav.nav2_5)
          setScopeQLLH(nav.nav2_5_1)
        }
      }
    }
  }
  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (u) => {
      if (u && u.metadata.creationTime === u.metadata.lastSignInTime) return null
      if (u) {
        console.log('hahaah')
        FirstLogin(u.uid)
      } else {
        setUser(null);
      }

    });
    return () => {
      listen();
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        scopeQLLH,
        scopeQL,
        scope,
        user,
        setUser,
        Login: async (email, password, history) => {
          try {
            //   await auth().signInWithEmailAndPassword(email, password);
            //   getFcmToken();
            //   const userData = {
            //     id: auth().currentUser.uid,
            //     name: auth().currentUser.displayName,
            //     email: auth().currentUser.email,
            //     userImg: auth().currentUser.photoURL,
            //   }
            //   await FirstLogin(userData);
            signInWithEmailAndPassword(auth, email, password)
              .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user)
                const userData = {
                  id: auth.currentUser.uid,
                  email: auth.currentUser.email,
                }
                await FirstLogin(userData.id);
                history.push("/");
                //window.location.href = '/'
                // ...
              })
              .catch((error) => {
                console.log("Error sign in", error);
                handleShowDialog("Tài khoản đăng nhập không đúng!")
              });
          } catch (e) {
            alert(e);
          }
        },
        forgotPassword: async (email) => {
          //   await auth()
          //     .sendPasswordResetEmail(email)
          //     .then(() => {
          //       alert("Password reset email sent, please check your email!");
          //     })
          //     .catch((e) => {
          //       console.log("error: ", e);
          //     });
          sendPasswordResetEmail(auth, email)
            .then(() => {
              // Thành công, có thể thông báo cho người dùng về việc gửi email đặt lại mật khẩu
              handleShowDialog("Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra email của bạn.")
              console.log("Đã gửi email đặt lại mật khẩu.");
            })
            .catch((error) => {
              // Xử lý lỗi nếu có
              console.error("Lỗi khi gửi email đặt lại mật khẩu: ", error);
            });
        },

        registerforKH: async (email, password, name, phone, identify, birthday, address) => {
          try {
            //   await auth().createUserWithEmailAndPassword(email, password)
            //   .then(() => {
            //     getFcmToken();

            //     const userData = {
            //       id: auth().currentUser.uid,
            //       name: name,
            //       email: auth().currentUser.email,
            //       userImg: auth().currentUser.photoURL,
            //     }
            //     Api.setUserInfo(userData)
            //     .catch(error => console.error(error));

            //     auth().currentUser.updateProfile({
            //       displayName: name,
            //     })
            //     .catch((error) => {
            //       console.log('Error updating displayName:', error);
            //     });
            //   });
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log(user)
                const userData = {
                  id: auth.currentUser.uid,
                  ten: name,
                  email: auth.currentUser.email,
                  diachi: address,
                  tuoi: birthday,
                  CCCD: identify,
                  SDT: phone,
                  Loai: 'KhachHang'
                }
                Api.setUserInfo(userData)
                  .catch(error => console.error(error));
                handleShowDialog("Đăng ký tài khoản thành công!")
                // ...
              })
              .catch((error) => {
                console.log("Error sign up", error);
                // ..
              });
          } catch (e) {
            console.log(e);
            alert(e);
          }
        },
        Logout: async (history) => {
          try {
            // await auth().signOut();
            signOut(auth).then(val => {
              console.log('sign out')
              setUser(null)
              setScope(nav.nav0)
              setScopeQL([])
              setScopeQLLH([])
              history.push("/");
            })
          } catch (e) {
            console.error(e);
          }
        },
      }}
    >
      <CustomModal
        show={showDialog}
        handleClose={handleCloseDialog}
        body={ndshow}
      />
      {children}
    </AuthContext.Provider>
  );
};
