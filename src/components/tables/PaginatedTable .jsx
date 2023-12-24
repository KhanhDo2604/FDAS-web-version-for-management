import * as XLSX from 'xlsx';
import React, { useState } from 'react'
import Highlighter from 'react-highlight-words';
import ReactPaginate from 'react-paginate';
import { CiSearch } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import DeductionModal from "../modal/DeductionModal"

const PaginatedTable = ({ listMember, itemPerpage, layout = 1 }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [isModal, setIsModal] = useState(false)

    const [itemOffset, setItemOffset] = useState(0);

    const filteredList = listMember?.filter(item => {
        if (item.name) {
            return item.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
    })


    const endOffset = itemOffset + itemPerpage;
    const currentItems = filteredList.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredList.length / itemPerpage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemPerpage) % filteredList.length;
        setItemOffset(newOffset);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        setItemOffset(0)
    }

    // EXPORT DATA TO EXCEL
    const handleOnExport = () => {
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(listMember)
        XLSX.utils.book_append_sheet(wb, ws, "MySheet1")
        XLSX.writeFile(wb, "MyExcel.xlsx")
    }

    const handleOpenModal = () => {
        setIsModal(true)
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 20px", gap: "20px" }}>
                <div style={{ width: "50%", position: "relative" }}>
                    <div style={{ position: "absolute", transform: "translateY(-50%)", top: "50%", left: "16px" }}>
                        <CiSearch size={20} />
                    </div>
                    <input value={searchQuery}
                        onChange={handleSearchChange} type='text'
                        placeholder='Search name, email or etc.'
                        style={{ width: "100%", borderRadius: "10px", padding: "16px 40px", border: "1px solid #D9D9D9", fontSize: "16px" }} />
                </div>
                {layout === 1 && <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "50%", justifyContent: "end" }}>
                    <button onClick={handleOpenModal} style={{ backgroundColor: "#1E85F1", borderRadius: "10px", padding: "12px 16px", border: "none", fontSize: "16px", fontWeight: "bold", color: "#FFF", cursor: "pointer" }}>Set duration rate</button>
                    <button onClick={handleOnExport} style={{ display: "flex", flexDirection: "row", gap: "6px", alignItems: "center", backgroundColor: "#1E85F1", borderRadius: "10px", padding: "12px 16px", border: "none", cursor: "pointer" }}>
                        <FiDownload color='#fff' size={20} />
                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#FFF" }}>Export</span>
                    </button>
                </div>}

            </div>
            <div style={{ padding: "0 20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f2f2f2" }}>
                        <tr>
                            <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Id</th>
                            <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Name</th>
                            <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Role</th>
                            {layout === 1 ?
                                <>
                                    <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Late</th>
                                    <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Absent</th>
                                    <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Deduction</th>
                                    <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Total</th>
                                </>
                                :
                                <>
                                    <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Email</th>
                                    <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Phone Number</th>
                                    <th style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>Status</th>

                                </>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentItems?.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center", fontWeight: "bold" }}>{value.id}</td>
                                        <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>
                                            <Highlighter
                                                highlightClassName="highlighted-text"
                                                searchWords={[searchQuery]}
                                                autoEscape={true}
                                                textToHighlight={value.name}
                                            />
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>{value.role}</td>
                                        {
                                            layout === 1 ?
                                                <>
                                                    <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>{value.late}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>{value.absent}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center", color: "#E13428", fontWeight: "bold" }}>{value.deduction}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center", color: "#5DA969", fontWeight: "bold" }}>{value.total}</td>
                                                </>
                                                :
                                                <>
                                                    <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>{value.email}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center" }}>{value.phone}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "16px", textAlign: "center", color: "rgb(30, 133, 241)", fontWeight: "bold" }}>{value.status === 1 ? "Active" : "Deactive"}</td>
                                                </>
                                        }
                                    </tr>
                                )
                            })
                        }
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
    )
}

export default PaginatedTable 