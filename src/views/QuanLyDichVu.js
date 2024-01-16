import React from 'react'
import './mistyles.css'
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useEffect, useState, useContext } from 'react';
import { FormDichVu } from '../components/FormDichVu';
import api from '../api/Api';

const QuanLyDichVu = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState({
        maDichVu: '',
        tenDichVu: '',
        loaiDichVu: '',
        giaDau: '',
        giaCuoi: '',
    })
    useEffect(() => {
        getServices();
    }, []);

    const getServices = async () => {
        const services = await api.getAllServices();
        setServices(services);
    }

    const handleDeleteRow = (targetIndex) => {
        const shouldDelete = window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?');
        if (shouldDelete) {
            setServices(services.filter((_, idx) => idx !== targetIndex));
            api.deleteService(services[targetIndex].Id);
        }
    };

    const handleEditRow = (idx) => {
        setRowToEdit(idx);
        setModalOpen(true);
    };

    const handleSubmit = async (newRow) => {
        console.log(newRow);
        if (rowToEdit == null) {
            const id = await api.addService(newRow);
            newRow.Id = id;
            setServices([...services, newRow]);
        }
        else {
            api.updateService(newRow, newRow.Id);
            let updatedServices = services.map((currRow, idx) => {
                if (idx !== rowToEdit) return currRow;
                return newRow;
            })
            setServices(updatedServices);
        }
    };

    const handleChange = (e) => {
        setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
    };

    const onSearch = async () => {
        console.log(searchCriteria)

        const searchResults = await api.getServicesBySeacrh(searchCriteria);
        console.log(searchResults);
        setServices(searchResults);
    }
    return (
        <div>
            <div className="row" style={{ color: '#fff' }}>
                <div className='col-lg-4 col-md-6'>
                    <input className="form-control pb-2 pt-2 mb-3" type="text" id="maDichVu" placeholder="Nhập mã dịch vụ" name="maDichVu" value={searchCriteria.maDichVu}
                        onChange={handleChange} />
                </div>
                <div className='col-lg-4 col-md-6'>
                    <input className="form-control pb-2 pt-2 mb-3" type="text" id="tenDichVu" placeholder="Nhập tên dịch vụ" name="tenDichVu" value={searchCriteria.tenDichVu}
                        onChange={handleChange} />
                </div>
                <div className='col-lg-4 col-md-6'>
                    <input className="form-control pb-2 pt-2" type="text" id="loaiDichVu" placeholder="Nhập loại dịch vụ" name="loaiDichVu" value={searchCriteria.loaiDichVu}
                        onChange={handleChange} />
                </div>
            </div>
            <div className='row align-items-center' style={{ color: '#fff' }}>
                <div className='col-auto mt-2' style={{ fontWeight: "bold" }}>Đơn giá: </div>
                <div className='col-auto row'>
                    <div className='col-auto row align-items-center gs-1'>
                        <div className='col-auto mt-2 me-2' style={{ fontWeight: 600 }}>Từ</div>
                        <div className='col-auto'>
                            <input className="form-control pb-2 pt-2 mt-2" type="number" placeholder="0" name="giaDau" value={searchCriteria.giaDau}
                                onChange={handleChange} />
                        </div>
                    </div>
                    <div className='col-auto row align-items-center gs-1'>
                        <div className='col-auto mt-2' style={{ fontWeight: 600 }}>đến</div>
                        <div className='col-auto mt-2'>
                            <input className="form-control pb-2 pt-2" type="number" placeholder="1000000000" name="giaCuoi" value={searchCriteria.giaCuoi}
                                onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={onSearch}
                className="btn pb-2 pt-2 me-3 mt-3 mb-3 btnGradient"
            >
                Tìm kiếm
            </button>
            <button onClick={() => setModalOpen(true)}
                className="btn pb-2 pt-2 mt-3 mb-3 btnGradient">
                Thêm
            </button>
            <div className="text-end">
                <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
            </div>
            <table className="table table-dark" >
                <thead style={{ verticalAlign: "middle" }}>
                    <tr>
                        <th>Mã dịch vụ</th>
                        <th>Tên dịch vụ</th>
                        <th>Loại dịch vụ</th>
                        <th>Đơn giá</th>
                        <th>Bảo hành</th>
                        <th>Có trả góp hay không</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((row, idx) => {

                        return (
                            <tr key={row.Id} style={{ backgroundColor: '#fff' }}>
                                <td>{row.maDichVu}</td>
                                <td>{row.tenDichVu}</td>
                                <td>{row.loaiDichVu}</td>
                                <td>{new Intl.NumberFormat('en-DE').format(row.giaDichVu)}</td>
                                <td>
                                    {row.baoHanh}
                                </td>
                                <td>
                                    {row.coTraGop}
                                </td>
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
                </tbody>
            </table>
            {
                modalOpen && (
                    <FormDichVu
                        closeModal={() => {
                            setModalOpen(false);
                            setRowToEdit(null);
                        }}
                        onSubmit={handleSubmit}
                        defaultValue={rowToEdit !== null && services[rowToEdit]}
                        services={services}
                    />
                )
            }
        </div >
    );
}
export default QuanLyDichVu;