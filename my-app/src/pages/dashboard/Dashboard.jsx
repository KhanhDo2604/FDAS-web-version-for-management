import { Column } from "@ant-design/charts";
import Highlighter from "react-highlight-words";
import React, { useState } from "react";
import "./Dashboard.css";
import { FaChartBar } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import { DatePicker } from "antd";
import { auth } from "../../firebase";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;

const data = [
  { month: "Jan", value: 3 },
  { month: "Feb", value: 4 },
  { month: "Mar", value: 3.5 },
  { month: "Apr", value: 5 },
  { month: "May", value: 4.9 },
  { month: "Jun", value: 6 },
  { month: "Jul", value: 7 },
  { month: "Aug", value: 9 },
  { month: "Sep", value: 11 },
  { month: "Oct", value: 10 },
  { month: "Nov", value: 5 },
  { month: "Dec", value: 20 },
];

const config = {
  data,
  xField: "month",
  yField: "value",
  point: {
    size: 5,
    shape: "diamond",
  },
  label: {
    style: {
      fill: "#aaa",
    },
  },
};

const listMember = [
  {
    id: "20521442",
    name: "Đỗ Phạm Huy Khánh",
    role: "Nhân viên",
    late: 4,
    absent: 5,
    deduction: "500.000",
    total: "12.500.000",
  },
  {
    id: "20521442",
    name: "Đỗ Phạm Huy Khánh",
    role: "Nhân viên",
    late: 4,
    absent: 5,
    deduction: "500.000",
    total: "12.500.000",
  },
  {
    id: "20521442",
    name: "Đỗ Phạm Huy Khánh",
    role: "Nhân viên",
    late: 4,
    absent: 5,
    deduction: "500.000",
    total: "12.500.000",
  },
  {
    id: "20521442",
    name: "Đỗ Phạm Huy Khánh",
    role: "Nhân viên",
    late: 4,
    absent: 5,
    deduction: "500.000",
    total: "12.500.000",
  },
  {
    id: "20521442",
    name: "Đỗ Phạm Huy Khánh",
    role: "Nhân viên",
    late: 4,
    absent: 5,
    deduction: "500.000",
    total: "12.500.000",
  },
  {
    id: "20521442",
    name: "Nguyễn Văn Pháp",
    role: "Nhân viên",
    late: 4,
    absent: 5,
    deduction: "500.000",
    total: "12.500.000",
  },
  {
    id: "20521442",
    name: "Võ Đình Vân",
    role: "Nhân viên",
    late: 4,
    absent: 5,
    deduction: "500.000",
    total: "12.500.000",
  },
];


const Dashboard = () => {
  const [isActive, setIsActive] = useState(tabs[0]);
  const [selected, setSelected] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  const filteredList = listMember.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredList.length / itemsPerPage);
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredList.length;
    setItemOffset(newOffset);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setItemOffset(0);
  };

  const handleActive = (tab) => {
    setIsActive(tab);
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => handleActive(tab)}
            className={`menu-item ${
              isActive === tab ? "tab-active" : "tab-inactive"
            }`}
          >
            <div className="icon">{tab.icon}</div>
            <span>{tab.name}</span>
          </div>
        ))}
      </div>
      <div className="header">
        <div className="navbar">
          <img src="/Button.png" alt="" />
          <div className="avatar">
            <img src="/Logout.png" alt="" onClick={handleLogout} />
            <img src="/Avatar.png" alt="" />
          </div>
        </div>
        <div className="border-shadow"></div>
        <div>
          {isActive.id === 1 && (
            <>
              <div className="content">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <h2>Attendance</h2>
                  <h2>
                    Dashboard / <span>Attendance</span>
                  </h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <select
                      style={{
                        width: "140px",
                        height: "36px",
                        borderRadius: "10px",
                        borderColor: "#d9d9d9",
                      }}
                      name="date"
                      id="date"
                      onChange={handleChange}
                    >
                      <option value="month">Month</option>
                      <option value="day">Day</option>
                    </select>
                  </div>
                  <div>
                    {selected === "month" ? (
                      <RangePicker format={"YYYY-MM-DD"} />
                    ) : (
                      <DatePicker />
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "20px", padding: "0 20px" }}>
                {/* Statistics */}
                <div
                  style={{
                    width: "50%",
                    border: "1px solid #D9D9D9",
                    borderRadius: "20px",
                    padding: "24px 24px",
                  }}
                >
                  <h2 style={{ color: "#1E85F1", marginBottom: "50px" }}>
                    Statistics
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid #D9D9D9",
                        borderRadius: "20px",
                        padding: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                        }}
                      >
                        <h3>Present employee</h3>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                          }}
                        >
                          4 / <span>12</span>
                        </p>
                      </div>
                      <div className="present">
                        <progress
                          id="present"
                          value="32"
                          max="100"
                          style={{ width: "100%", borderRadius: "10px" }}
                        >
                          {" "}
                          32%{" "}
                        </progress>
                      </div>
                    </div>
                    <div
                      style={{
                        border: "1px solid #D9D9D9",
                        borderRadius: "20px",
                        padding: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                        }}
                      >
                        <h3>Absent employee</h3>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                          }}
                        >
                          4 / <span>12</span>
                        </p>
                      </div>
                      <div className="absent">
                        <progress
                          id="absent"
                          value="32"
                          max="100"
                          style={{ width: "100%" }}
                        >
                          {" "}
                          32%{" "}
                        </progress>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "32px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "20px",
                          padding: "12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          width: "50%",
                        }}
                      >
                        <h3>Latest employee</h3>
                        <p>Đỗ Phạm Huy Khánh - 4</p>
                      </div>
                      <div
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "20px",
                          padding: "12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          width: "50%",
                        }}
                      >
                        <h3>Latest employee</h3>
                        <p>Đỗ Phạm Huy Khánh - 4</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Daily record */}
                <div
                  style={{
                    width: "50%",
                    border: "1px solid #D9D9D9",
                    borderRadius: "20px",
                    padding: "24px 24px",
                  }}
                >
                  <h2 style={{ color: "#1E85F1", marginBottom: "50px" }}>
                    Daily Records
                  </h2>
                  <Column {...config} />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px 20px",
                  gap: "20px",
                }}
              >
                <div style={{ width: "50%", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      transform: "translateY(-50%)",
                      top: "50%",
                      left: "16px",
                    }}
                  >
                    <CiSearch size={20} />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="Search name, email or etc."
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      padding: "16px 40px",
                      border: "1px solid #D9D9D9",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "50%",
                    justifyContent: "end",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#1E85F1",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#FFF",
                      cursor: "pointer",
                    }}
                  >
                    Set duration rate
                  </button>
                  <button
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "6px",
                      alignItems: "center",
                      backgroundColor: "#1E85F1",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FiDownload color="#fff" size={20} />
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#FFF",
                      }}
                    >
                      Export
                    </span>
                  </button>
                </div>
              </div>
              <div style={{ padding: "0 20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ backgroundColor: "#f2f2f2" }}>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        Id
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        Role
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        Late
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        Absent
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        Deduction
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems?.map((value, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "16px",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {value.id}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "16px",
                                textAlign: "center",
                              }}
                            >
                              <Highlighter
                                highlightClassName="highlighted-text"
                                searchWords={[searchQuery]}
                                autoEscape={true}
                                textToHighlight={value.name}
                              />
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "16px",
                                textAlign: "center",
                              }}
                            >
                              {value.role}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "16px",
                                textAlign: "center",
                              }}
                            >
                              {value.late}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "16px",
                                textAlign: "center",
                              }}
                            >
                              {value.absent}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "16px",
                                textAlign: "center",
                                color: "#E13428",
                                fontWeight: "bold",
                              }}
                            >
                              {value.deduction}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "16px",
                                textAlign: "center",
                                color: "#5DA969",
                                fontWeight: "bold",
                              }}
                            >
                              {value.total}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const tabs = [
  {
    id: 1,
    name: "Dashboard",
    icon: <FaChartBar size={24} />,
  },
  {
    id: 2,
    name: "List Employee",
    icon: <FaListUl size={24} />,
  },
];
