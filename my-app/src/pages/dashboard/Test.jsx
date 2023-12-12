import React, { useState } from 'react'
import "./Test.css"
import { FaChartBar } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";

const Test = () => {
    const [isActive, setIsActive] = useState(tabs[0])

    const handleActive = (tab) => {
        setIsActive(tab)
    }

    return (
        <div style={{ display: "flex" }}>
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
            <div style={{ display: "flex", flexDirection: "column", flex: "1", padding: "0 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>Header</p>
                    <p>Header</p>
                </div>

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

export default Test

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