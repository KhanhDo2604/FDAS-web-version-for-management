import React from 'react'
import "./ManageInfo.css"
import { FaPhone } from "react-icons/fa6";
import { FaTransgender, FaBirthdayCake } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Avatar, Button, DatePicker } from 'antd';
import { RiErrorWarningFill } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
const ManageInfo = () => {

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <>
            <div style={{ marginBottom: '90px' }}>
                header
            </div>

            <div className="manage-info">
                <div className="manage-info__left">
                    <div className="left__individual">

                        <div className="individual-status">
                            <p className='status-ontime'>On time</p>
                        </div>

                        <div className="individual-edit">
                            <Avatar
                                className='edit-avt'
                                src={<img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/IMG_Academy_Logo.svg/640px-IMG_Academy_Logo.svg.png"
                                    alt="avatar"
                                />}
                            />
                            <p className='edit-name'>Đỗ Phạm Huy Khánh</p>
                            <div className="edit-role">Nhân viên ...</div>
                            <Button className='edit-btn'>
                                Edit
                            </Button>
                        </div>

                        <div className="individual-detail">

                            <div className="detail-container">
                                <FaPhone style={{ width: '16px', height: '16px' }} />
                                <p>Phone Number: <span style={{ fontWeight: '600', fontSize: '15px' }}>0886667068</span></p>
                            </div>

                            <div className="detail-container">
                                <FaTransgender style={{ width: '16px', height: '16px' }} />
                                <p>Gender: <span style={{ fontWeight: '600', fontSize: '15px' }}>Male</span></p>
                            </div>

                            <div className="detail-container">
                                <FaBirthdayCake style={{ width: '16px', height: '16px' }} />
                                <p>Birthday: <span style={{ fontWeight: '600', fontSize: '15px' }}>26/04/2002</span></p>
                            </div>

                            <div className="detail-container">
                                <MdEmail style={{ width: '16px', height: '16px' }} />
                                <p>Email: <span style={{ fontWeight: '600', fontSize: '15px' }}>khanhdph2604@gmail.com</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="left__notice">

                        <div className="left__notice-title">Notice board</div>

                        <div className="left__notice-container">
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <RiErrorWarningFill style={{ color: 'red', width: '20px', height: '20px' }} />
                                <p style={{ fontWeight: '600', fontSize: '16px' }}>Caution: <span>Too many absent</span></p>
                            </div>
                            <p style={{ fontWeight: '600', fontSize: '16px' }}>12/2023</p>
                        </div>

                        <div className="left__notice-container">
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <RiErrorWarningFill style={{ color: 'red', width: '20px', height: '20px' }} />
                                <p style={{ fontWeight: '600', fontSize: '16px' }}>Caution: <span>Too many late </span></p>
                            </div>
                            <p style={{ fontWeight: '600', fontSize: '16px' }}>12/2023</p>
                        </div>


                    </div>
                </div>

                <div className="manage-info__right">
                    <div className="right-calender">
                        <DatePicker onChange={onChange} />
                    </div>

                    <div className="right-body">

                        <div className="right-display">

                            <div className="right-display-item">
                                <IoMdCheckmarkCircleOutline style={{ width: '30px', height: '30px' }} />
                                <div className="item-info">
                                    <p style={{ fontWeight: '600', textAlign: 'start' }}>08:24</p>
                                    <p>Avg check in</p>
                                </div>
                            </div>

                            <div className="right-display-item">
                                <IoMdCheckmarkCircleOutline style={{ width: '30px', height: '30px' }} />
                                <div className="item-info">
                                    <p style={{ fontWeight: '600', textAlign: 'start' }}>03</p>
                                    <p>Late</p>
                                </div>
                            </div>

                            <div className="right-display-item">
                                <RiErrorWarningLine style={{ width: '30px', height: '30px' }} />
                                <div className="item-info">
                                    <p style={{ fontWeight: '600', textAlign: 'start' }}>05</p>
                                    <p>Absent</p>
                                </div>
                            </div>

                        </div>

                        <div className="right-body-list">
                            <div className="list-title">
                                <p style={{ fontWeight: '600', width: '40%' }} className='list-title-date'>Date</p>
                                <p style={{ fontWeight: '600', width: '30%' }} className='list-checkin'>Check in</p>
                                <p style={{ fontWeight: '600', width: '30%' }} className='list-status'>Status</p>
                            </div>

                            <div className='list-item'>
                                <p style={{ width: '40%' }} className='list-title-date'>02/12/2023</p>
                                <p style={{ width: '30%' }} className='list-checkin'>7:00 am</p>

                                <div className="individual-status">
                                    <p className='status-ontime'>On time</p>
                                </div>
                            </div>

                            <div>
                                <div className='list-item'>
                                    <p style={{ width: '40%' }} className='list-title-date'>02/12/2023</p>
                                    <p style={{ width: '30%' }} className='list-checkin'>7:00 am</p>

                                    <p className='status-absent'>Absent</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default ManageInfo