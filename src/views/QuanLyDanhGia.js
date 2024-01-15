import React, { useState, useEffect } from 'react'
import './mistyles.css'
import moment from 'moment';
import api from '../api/Api';
const QuanLyDanhGia = (props) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        getFeedbacks();
    }, []);

    const getFeedbacks = async () => {
        const feedbacks = await api.getAllFeedbacks(sortOrder);
        setFeedbacks(feedbacks);
    }
    const handleSelectChange = async (e) => {
        setSortOrder(e.target.value);
        const feedbacks = await api.getAllFeedbacks(e.target.value);
        setFeedbacks(feedbacks);
    }

    return (
        <div >
            <select className="form-select pb-2 pt-2 mt-2 mb-2" id="type" placeholder="chọn phương thức" name="year2"
                value={sortOrder}
                style={{ width: "fit-content", fontWeight: "bold" }}
                onChange={handleSelectChange}>
                <option value="desc">Sắp xếp theo mới nhất</option>
                <option value="asc">Sắp xếp theo cũ nhất</option>
            </select>

            <table className="table">
                <thead style={{ verticalAlign: "middle" }} className="table-secondary">
                    <tr>
                        <th className='pe-3'>Ngày</th>
                        <th className='pe-3'>Giờ</th>
                        <th>Nội dung</th>
                    </tr>
                </thead>
                {feedbacks.map((item, index) => (
                    <tr key={item.index} style={{backgroundColor: '#fff'}}>
                        <td className='pe-3'>{moment(new Date(item.ngay)).format("DD/MM/YYYY")}</td>
                        <td className='pe-3'>{item.gio}</td>
                        <td>{item.noidung}</td>
                    </tr>
                ))}
                <tbody>

                </tbody>
            </table>

        </div >
    );
}
export default QuanLyDanhGia;