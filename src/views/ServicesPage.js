import React, { useState, useRef } from 'react'
import './style.css'
import ReactPaginate from 'react-paginate';
import TopNav from '../components/TopNav'
import Footer from '../components/Footer';
const ServicesPage = (props) => {
    const pageToRef = useRef(null);

    //fake service list
    const serviceList = [
        {
            image: "/images/chinhhinh.png",
            name: "Chỉnh hình răng",
            price: "30.000.000-50.000.000 đồng",
            description: "Niềng răng là quá trình điều chỉnh vị trí của răng để cải thiện hàm răng và ngoại hình. Bằng cách sử dụng các bộ niềng răng, các chuyên gia nha khoa có thể di chuyển răng từ vị trí ban đầu của chúng đến vị trí mong muốn, giúp cải thiện sự cân đối của khuôn mặt và tăng tính thẩm mỹ của nụ cười."
        },
        {
            image: "/images/dieutrituy.png",
            name: "Điều trị tủy",
            price: "1.500.000-2.000.000 đồng",
            description: "Điều trị tủy là quá trình y tế nhằm điều trị các vấn đề liên quan đến tủy răng khi tủy bị viêm, tổn thương hoặc nhiễm trùng. Quá trình này thường bao gồm việc loại bỏ tủy răng bị tổn thương, làm sạch và điều trị khuẩn tủy, sau đó điền kín khoang tủy để ngăn vi khuẩn xâm nhập và tái phát triển. Điều trị tủy không chỉ giữ cho răng được bảo tồn mà còn ngăn ngừa sự lan rộng của nhiễm trùng đến các cấu trúc xung quanh."
        },
        {
            image: "/images/nhorang.png",
            name: "Nhổ răng",
            price: "300.000-1.500.000 đồng",
            description: "Việc nhổ răng là quá trình y tế được thực hiện để loại bỏ răng đã bị tổn thương, bị nhiễm trùng hoặc không thể được điều trị. Quá trình này thường được thực hiện bởi các chuyên gia nha khoa hoặc các bác sĩ nha khoa có kỹ năng chuyên sâu. Việc nhổ răng được thực hiện sau khi xác định rằng răng không thể được cứu chữa hoặc không tốt cho sức khỏe nướu miệng và hàm răng. Đôi khi, việc nhổ răng cũng có thể là phần của quá trình điều trị nha khoa khác như chuẩn bị cho việc cấy ghép răng hoặc để tạo không gian cho các điều trị khác."
        },
        {
            image: "/images/laycaorang.png",
            name: "Cạo vôi răng",
            price: "400.000 đồng",
            description: "Cạo vôi răng là quá trình loại bỏ các cặn bám và mảng bám trên bề mặt của răng để làm sạch và ngăn ngừa sự hình thành của sâu răng và bệnh nướu. Thông qua việc sử dụng các dụng cụ chuyên dụng như cạo vôi và máy siêu âm, chuyên gia nha khoa sẽ loại bỏ các cặn bám, mảng bám và mảng vi khuẩn tích tụ trên răng và quanh nướu. Quá trình này giúp duy trì sức khỏe nướu miệng, ngăn ngừa sâu răng và các vấn đề liên quan đến vi khuẩn gây bệnh trong miệng."
        },
        {
            image: "/images/phuchinh.png",
            name: "Phục hình cố định",
            price: "1.000.000-5.000.000 đồng",
            description: "Phục hình cố định răng là quá trình khôi phục và cải thiện hàm răng bằng cách sử dụng các cấu trúc cố định như cầu răng, bọc răng, hay cấy ghép để thay thế răng bị mất, bị hỏng hoặc không còn khả năng sử dụng. Quá trình này thường được thực hiện bởi các chuyên gia nha khoa có kỹ năng chuyên sâu, nhằm tái tạo hàm răng hoàn chỉnh và cải thiện chức năng nhai cũng như thẩm mỹ nụ cười. "
        },
        {
            image: "/images/ranggia.png",
            name: "Răng giả tháo lắp",
            price: "6.000.000 đồng",
            description: "Răng giả tháo lắp là một loại phục hình không cố định, cho phép người dùng tháo lắp nó từ và lên trên nướu miệng một cách dễ dàng. Thường được làm từ chất liệu như nhựa hoặc kim loại nhẹ, răng giả tháo lắp có thể được đặt và tháo ra khỏi miệng hàng ngày để làm sạch, vệ sinh hoặc trong những trường hợp cần thiết khác. Điều này mang lại tính linh hoạt và thuận tiện cho người dùng so với các loại phục hình cố định khác, giúp duy trì sự thoải mái và sức khỏe tốt cho nướu miệng."
        },
        {
            image: "/images/taytrang.png",
            name: "Tẩy trắng răng",
            price: "1.000.000-2.000.000 đồng",
            description: "Tẩy trắng răng là quá trình sử dụng các chất hóa học hoặc công nghệ để loại bỏ hoặc làm mờ các vết ố vàng, bám trên bề mặt răng, giúp răng trở nên sáng và trắng hơn. Quá trình này thường được thực hiện tại phòng nha khoa hoặc bằng cách sử dụng các sản phẩm tẩy trắng tại nhà dưới sự hướng dẫn của chuyên gia. Tẩy trắng răng không chỉ cải thiện thẩm mỹ của nụ cười mà còn giúp tăng cường tự tin và làm tăng độ trắng sáng của răng trong thời gian ngắn. "
        },
        {
            image: "/images/tieuphaurangkhon.png",
            name: "Tiểu phẩu răng khôn",
            price: "1.000.000-2.500.000 đồng",
            description: "Tiểu phẩu răng khôn là quá trình loại bỏ răng khôn (hay còn gọi là răng số 8) thông qua một ca phẫu thuật nhỏ. Răng khôn thường nằm ở cuối hàm và có thể gây ra các vấn đề như viêm nhiễm, đau nhức, hoặc áp lực lên các răng lân cận do không có đủ không gian để phát triển hoặc mọc đúng hướng. Tiểu phẩu răng khôn thường được thực hiện dưới tình trạng tê cục bộ hoặc tình trạng tê toàn bộ, sau đó răng được loại bỏ một cách cẩn thận để giảm thiểu đau đớn và tối ưu hóa quá trình phục hồi sau phẫu thuật."
        },

    ]
    const doctorPerPage = 3;
    const [startOffset, setStartOffset] = useState(0);
    const endOffset = startOffset + doctorPerPage;
    const currentDoctorList = serviceList.slice(startOffset, endOffset);
    const totalPages = Math.ceil(serviceList.length / doctorPerPage);

    const handlePageClick = (event) => {

        setStartOffset((event.selected * doctorPerPage) % serviceList.length)
        pageToRef.current.scrollIntoView();;
    }

    return (
        <div style={{ backgroundColor: 'black' }}>
            <TopNav />
            <header className="pt-4 pb-4 headerPage"><h3 align="center">Dịch vụ</h3></header>

            <section className="container mt-5 mb-5">
                <div className="row" ref={pageToRef} style={{ color: "#FFF" }}>
                    {currentDoctorList.map((item, index) => {
                        return (
                            <div className="row">
                                <div className="col-md-4 mt-2 mb-4">
                                    <img alt="" src={item.image} style={{ width: "100%" }} />
                                </div>
                                <div className="col-md-8 align-self-center px-3">
                                    <p style={{ fontSize: "26px" }}>{item.name}</p>
                                    <p><h6>{item.price}</h6></p>
                                    <p style={{ color: "#fff" }} className='mb-5'>{item.description}</p>
                                </div>
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

            </section >
            <Footer style={{ marginTop: 0 }} />
        </div >
    );
}
export default ServicesPage;