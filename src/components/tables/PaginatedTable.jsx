import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import ReactPaginate from "react-paginate";
import { CiSearch } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import DeductionModal from "../modal/DeductionModal";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { combineLists, formatNumber } from "../../helpers";

const PaginatedTable = ({
  listMember,
  countAttendanceRecord,
  itemPerpage,
  layout = 1,
  setListStaff
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [company, setCompany] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const options = [0, 1];
  const toggleDropdown = (uid) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [uid]: !prevState[uid],
    }));
  };

  const filteredList = listMember?.filter((item) => {
    if (item.name) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });
  const endOffset = itemOffset + itemPerpage;
  const currentItems = filteredList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredList.length / itemPerpage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemPerpage) % filteredList.length;
    setItemOffset(newOffset);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setItemOffset(0);
  };

  //Thay đổi status nhân viên 
  const handleChangeStatus = (id, userStatus) => {
    let docRef = doc(db, "User", id.toString());
    const newData = [...listMember].map(e => {
      if (+e.id == id) {
        return {
          ...e,
          status: e.status == 1 ? 0 : 1
        }
      } return e
    })
    setListStaff([...newData])

    updateDoc(docRef, {
      status: userStatus === 1 ? 0 : 1,
    }).then(() => {
      console.log("111 cái này fetch lại data nè");
    }).catch((error) => console.log(error))
  };

  //Thay đổi mặt để nhận dạng
  const handleChangeFace = () => { };

  // EXPORT DATA TO EXCEL
  const handleOnExport = async () => {
    const combined = combineLists(listMember, countAttendanceRecord, company, layout);
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(combined)
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1")
    XLSX.writeFile(wb, "Attendance Record.xlsx")
  };

  const handleOpenModal = () => {
    setIsModal(true);
  };

  useEffect(() => {
    async function getCompany() {
      const docRef = doc(db, "Company", "TcIe43CAaSdN6FWzJVZC");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompany(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    getCompany();
  }, []);

  return (
    <>
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
        {layout === 1 && (
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
              onClick={handleOpenModal}
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
              onClick={handleOnExport}
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
                style={{ fontSize: "16px", fontWeight: "bold", color: "#FFF" }}
              >
                Export
              </span>
            </button>
          </div>
        )}
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
              {layout === 1 ? (
                <>
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
                </>
              ) : layout === 2 ? (
                <>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    Phone Number
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    Status
                  </th>
                </>
              ) : (
                <>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    Check In
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    Status
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((value, index) => {
              let deduction = layout === 1 && value.salary * ((countAttendanceRecord[value.uid]?.absent * company.absent_rate) / 100 + (countAttendanceRecord[value.uid]?.late * company.late_rate) / 100);

              let formattedDate = '------';
              let formattedTime = '------';
              let status = '------';

              if (layout === 3) {
                const userData = countAttendanceRecord[value.uid] || {};
                const dailyRecords = userData.dailyRecords || {};
                const timeData = dailyRecords.time || {};
                const timestamp = timeData.seconds ? timeData.seconds * 1000 : null;

                if (timestamp) {
                  const dateObject = new Date(timestamp);

                  if (!isNaN(dateObject.getTime())) {
                    formattedTime = dateObject.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    });

                    const day = dateObject.getDate();
                    const month = dateObject.getMonth() + 1;
                    const year = dateObject.getFullYear();
                    formattedDate = `${day}/${month}/${year}`;
                    status = dailyRecords.status;
                  }
                }
              }
              return (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {value.uid}
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
                  {layout === 1 ? (
                    <>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        {countAttendanceRecord[value.uid]?.late}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        {countAttendanceRecord[value.uid]?.absent}
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
                        {deduction ? formatNumber(deduction) : 0}
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
                        {deduction
                          ? formatNumber(Math.max(0, value.salary - deduction))
                          : formatNumber(value.salary)}
                      </td>
                    </>
                  ) : layout === 2 ? (
                    <>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        {value.email}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        {value.phone}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                          fontWeight: "bold",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: value.status === 1 ? "#5DA969" : "#E4644B",
                          }}
                        >
                          {value.status === 1 ? "Active" : "Deactive"}
                        </p>
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            onClick={() => toggleDropdown(value.uid)}
                            src="/Options.png"
                            alt=""
                            style={{ width: "24px", cursor: "pointer" }}
                          />
                          {dropdownVisible[value.uid] && (
                            <ul
                              style={{
                                display: "block",
                                padding: "0",
                                margin: "0",
                                position: "absolute",
                                top: "calc(100% + 8px)",
                                left: value.status === 1 ? "-50px" : "-140px",
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                zIndex: "1",
                              }}
                            >
                              {value.status === 1 ? (
                                <li
                                  key={index}
                                  onClick={() =>
                                    handleChangeStatus(value.uid, value.status)
                                  }
                                  style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                  }}
                                >
                                  Dectivate
                                </li>
                              ) : (
                                options.map((option, index) => (
                                  <li
                                    key={index}
                                    onClick={() =>
                                      option === 0
                                        ? handleChangeFace()
                                        : handleChangeStatus(
                                          value.uid,
                                          value.status
                                        )
                                    }
                                    style={{
                                      padding: "8px",
                                      cursor: "pointer",
                                      transition: "background-color 0.3s",
                                    }}
                                  >
                                    {option === 0
                                      ? "Change face recognize"
                                      : value.status === 1
                                        ? "Deactivate"
                                        : "Activate"}
                                  </li>
                                ))
                              )}
                            </ul>
                          )}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        {formattedDate}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        {formattedTime}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            minWidth: "100px",
                            textAlign: "center",
                            ...(
                              status === 1
                                ? {
                                  border: "1px solid #5DA969",
                                  backgroundColor: "rgba(204, 245, 210, 0.50)",
                                  color: "#5DA969",
                                }
                                : status === 2
                                  ? {
                                    border: "1px solid #E4644B",
                                    backgroundColor: "rgba(253, 210, 204, 0.50)",
                                    color: "#E4644B",
                                  }
                                  : {
                                    border: "1px solid #999999",
                                    backgroundColor: "rgba(217, 217, 218, 0.50)",
                                    color: "#999999",
                                  }
                            ),
                            borderRadius: "20px",
                            padding: "4px 12px",
                          }}
                        >
                          {status === 1 ? "On Time" : status === 2 ? "Late" : "Absent"}
                        </span>
                      </td>

                    </>
                  )}
                </tr>
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
          activeLinkClassName={"active-link"}
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
      </div>
      {isModal && <DeductionModal setIsModal={setIsModal} />}
    </>
  );
};

export default PaginatedTable;
