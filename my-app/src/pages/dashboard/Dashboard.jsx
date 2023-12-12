import React, { useState } from 'react'
import "./Dashboard.css"
import { FaChartBar } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";

const Dashboard = () => {
    const [isActive, setIsActive] = useState(tabs[0])

    const handleActive = (tab) => {
        setIsActive(tab)
    }

    return (
        <div className='dashboard'>
            <div className="sidebar">
                {
                    tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => handleActive(tab)}
                            className={`menu-item ${isActive === tab ? 'tab-active' : 'tab-inactive'}`}>
                            <div className='icon'>{tab.icon}</div>
                            <span>{tab.name}</span>
                        </div>
                    ))
                }
            </div>
            <div className='header' >
                <div className='navbar'>
                    <img src="/Button.png" alt="" />
                    <div className='avatar'>
                        <img src="/Logout.png" alt="" />
                        <img src="/Avatar.png" alt="" />
                    </div>
                </div>
                <div className='border-shadow'></div>
                <div>
                    {isActive.id === 1 ?
                        <div className="content">
                            <p>abc</p>
                        </div> :
                        <div className="content">
                            <p>123</p>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default Dashboard

const tabs = [
    {
        id: 1,
        name: "Dashboard",
        icon: <FaChartBar size={24} />

    },
    {
        id: 2,
        name: "List Employee",
        icon: <FaListUl size={24} />
    }
]