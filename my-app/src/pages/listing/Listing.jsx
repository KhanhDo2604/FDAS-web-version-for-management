import React, { useState } from 'react'
import "../listing/Listing.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from 'react-paginate';

const data = [
    {
        id: 1,
        name: "Võ Đình Vân",
        role: "IT",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 2,
        name: "Trần Thị Thanh Bình",
        role: "Content",
        attendanceTime: "20-11-2022",
        gender: "Female",
    },
    {
        id: 3,
        name: "Nguyễn Huỳnh Tuấn Khang",
        role: "Media",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 4,
        name: "Đỗ Phạm Huy Khánh",
        role: "Markerting",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 1,
        name: "Võ Đình Vân",
        role: "IT",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 2,
        name: "Trần Thị Thanh Bình",
        role: "Content",
        attendanceTime: "20-11-2022",
        gender: "Female",
    },
    {
        id: 3,
        name: "Nguyễn Huỳnh Tuấn Khang",
        role: "Media",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 4,
        name: "Đỗ Phạm Huy Khánh",
        role: "Markerting",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 1,
        name: "Võ Đình Vân",
        role: "IT",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 2,
        name: "Trần Thị Thanh Bình",
        role: "Content",
        attendanceTime: "20-11-2022",
        gender: "Female",
    },
    {
        id: 3,
        name: "Nguyễn Huỳnh Tuấn Khang",
        role: "Media",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 4,
        name: "Đỗ Phạm Huy Khánh",
        role: "Markerting",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 2,
        name: "Trần Thị Thanh Bình",
        role: "Content",
        attendanceTime: "20-11-2022",
        gender: "Female",
    },
    {
        id: 3,
        name: "Nguyễn Huỳnh Tuấn Khang",
        role: "Media",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 2,
        name: "Trần Thị Thanh Bình",
        role: "Content",
        attendanceTime: "20-11-2022",
        gender: "Female",
    },
    {
        id: 3,
        name: "Nguyễn Huỳnh Tuấn Khang",
        role: "Media",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 2,
        name: "Trần Thị Thanh Bình",
        role: "Content",
        attendanceTime: "20-11-2022",
        gender: "Female",
    },
    {
        id: 3,
        name: "Nguyễn Huỳnh Tuấn Khang",
        role: "Media",
        attendanceTime: "20-11-2022",
        gender: "Male",
    },
    {
        id: 2,
        name: "Trần Thị Thanh Bình",
        role: "Content",
        attendanceTime: "20-11-2022",
        gender: "Female",
    },
    {
        id: 3,
        name: "Nguyễn Huỳnh Tuấn Khang",
        role: "Media",
        attendanceTime: "20-11-2022",
        gender: "Male",
    }
]

const Listing = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = data.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(data.length / itemsPerPage);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.length;
        setItemOffset(newOffset);
    };

    return (
        <div className='list'>
            <div className='list__filter'>
                <input placeholder='Search name of staff' />
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                />
            </div>
            <div>
                <div className='list__container'>
                    <h5>Name</h5>
                    <h5>Role</h5>
                    <h5>Attendance Time</h5>
                    <h5>Gender</h5>
                    <h5>Action</h5>
                </div>
                <div>
                    {
                        currentItems && currentItems.map((value, index) => (
                            <div key={index} className='list__item' >
                                <p>{value.name}</p>
                                <p>{value.role}</p>
                                <p>{value.attendanceTime}</p>
                                <p>{value.gender}</p>
                                <div className='list__action'>
                                    <button>
                                        <img src='/pencil.png' alt='' />
                                    </button>
                                    <button>
                                        <img src='/delete.png' alt='' />
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
        </div>
    )
}

export default Listing