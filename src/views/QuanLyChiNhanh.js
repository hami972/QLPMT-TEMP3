import React from 'react'
import './mistyles.css'
import { useEffect, useState, useContext } from 'react';
import { NavLink } from "react-router-dom";
import { browserHistory, Router, Route, Switch } from 'react-router';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormChiNhanh } from '../components/FormChiNhanh';
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import api from '../api/Api';

const QuanLyChiNhanh = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [branchs, setBranchs] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState({
        maChiNhanh: '',
        tenChiNhanh: '',
        slpDau: '',
        slpCuoi: '',
    })

    useEffect(() => {
        getBranchs();
    }, []);

    const getBranchs = async () => {
        const branchs = await api.getAllBranchs()
        setBranchs(branchs);
    }

    const handleDeleteRow = (targetIndex) => {
        const shouldDelete = window.confirm('Bạn có chắc chắn muốn xóa chi nhánh này không?');
        if (shouldDelete) {
            setBranchs(branchs.filter((_, idx) => idx !== targetIndex));
            api.deleteBranch(branchs[targetIndex].Id);
        }
    };

    const handleEditRow = (idx) => {
        setRowToEdit(idx);
        setModalOpen(true);
    };

    const handleSubmit = async (newRow) => {
        console.log(newRow);
        if (rowToEdit == null) {
            const id = await api.addBranch(newRow);
            newRow.Id = id;
            setBranchs([...branchs, newRow]);
        }
        else {
            api.updateBranch(newRow, newRow.Id);
            let updatedBranchs = branchs.map((currRow, idx) => {
                if (idx !== rowToEdit) return currRow;
                return newRow;
            })
            setBranchs(updatedBranchs);
        }
    };

    const handleChange = (e) => {
        setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
    };

    const onSearch = async () => {
        console.log(searchCriteria)

        const searchResults = await api.getBranchsBySeacrh(searchCriteria);
        console.log(searchResults);
        setBranchs(searchResults);
    }
    return (
        <div >
            <div className='row' style={{color: '#fff'}}>
                <div className='col-lg-4 col-md-6'>
                    <input className="form-control pb-2 pt-2 mb-3" type="text" id="maChiNhanh" placeholder="Nhập mã chi nhánh" name="maChiNhanh"
                        onChange={handleChange} />
                </div>
                <div className='col-lg-4 col-md-6'>
                    <input className="form-control pb-2 pt-2" type="text" id="tenChiNhanh" placeholder="Nhập tên chi nhánh" name="tenChiNhanh"
                        onChange={handleChange} />
                </div>
            </div>
            <div className='col-auto row align-items-center' style={{color: '#fff'}}>
                <div className='col-auto mt-2' style={{ fontWeight: "bold" }}>Số lượng phòng: </div>
                <div className='col-auto row'>
                    <div className='col-auto row align-items-center gs-1'>
                        <div className='col-auto mt-2' style={{ fontWeight: 600 }}>Từ</div>
                        <input className="form-control pb-2 pt-2 mt-2" type="number" placeholder="0" name="slpDau" value={searchCriteria.slpDau} style={{ width: 100 }}
                            onChange={handleChange} />
                    </div>
                    <div className='col-auto row align-items-center gs-1'>
                        <div className='col-auto mt-2' style={{ fontWeight: 600 }}>đến</div>
                        <input className="form-control pb-2 pt-2" type="number" placeholder="100" name="slpCuoi" value={searchCriteria.slpCuoi} style={{ width: 100 }}
                            onChange={handleChange} />
                    </div>
                </div>
            </div>
            <button type="submit"
                className="btn pb-2 pt-2 me-3 mt-3 mb-3"
                style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}
                onClick={onSearch}>
                Tìm kiếm
            </button>
            <button onClick={() => setModalOpen(true)}
                className="btn pb-2 pt-2 me-3 mt-3 mb-3"
                style={{ backgroundColor: "#8298FF", color: "#FFFFFF" }}>
                Thêm
            </button>
            <div className="text-end">
                <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
            </div>
            <table className="table" >
                <thead style={{ verticalAlign: "middle" }}>
                    <tr className="table-secondary">
                        <th>Mã chi nhánh</th>
                        <th>Tên chi nhánh</th>
                        <th>Địa chỉ</th>
                        <th>Số lượng phòng</th>
                        <th></th>
                    </tr>
                </thead>
                {branchs.map((row, idx) => {
                    return (
                        <tr key={row.Id} style={{backgroundColor: '#fff'}}>
                            <td>{row.maChiNhanh}</td>
                            <td>{row.tenChiNhanh}</td>
                            <td>{row.diaChi}</td>
                            <td>{row.soLuongPhong}</td>
                            <td className="fit">
                                <span className="actions">
                                    <BsFillTrashFill
                                        className="delete-btn"
                                        onClick={() => handleDeleteRow(idx)}
                                    />
                                    <BsFillPencilFill
                                        className="edit-btn"
                                        onClick={() => handleEditRow(idx)}
                                    />
                                </span>
                            </td>
                        </tr>
                    );
                })}
                <tbody>
                </tbody>
            </table>
            {
                modalOpen && (
                    <FormChiNhanh
                        closeModal={() => {
                            setModalOpen(false);
                            setRowToEdit(null);
                        }}
                        onSubmit={handleSubmit}
                        defaultValue={rowToEdit !== null && branchs[rowToEdit]}
                        branchs={branchs}
                    />
                )
            }
        </div >
    );
}
export default QuanLyChiNhanh;