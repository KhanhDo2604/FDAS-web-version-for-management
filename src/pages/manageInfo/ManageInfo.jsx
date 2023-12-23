import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa6";
import { FaTransgender, FaBirthdayCake } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Avatar, Button, DatePicker } from "antd";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { UserAuth } from "../../hooks/useAuth";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";
import { useNavigate } from "react-router-dom";

const ManageInfo = () => {
  const { logOut, user } = UserAuth();
  const [url, setUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.url) {
      const fileRef = ref(storage, user.url);

      getDownloadURL(fileRef)
        .then((res) => {
          setUrl(res);
        })
        .catch((error) => console.log(error));
    } else {
      return;
    }
  }, [user]);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <div></div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            onClick={() => {
              logOut();
              navigate("/login");
            }}
            src="/Logout.png"
            alt=""
          />
          {url ? (
            <img
              src={url}
              alt=""
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
          ) : null}
        </div>
      </div>

      <div style={{ display: "flex", padding: "25px", gap: "40px" }}>
        <div style={{ width: "40%" }}>
          <div
            style={{
              padding: "20px",
              boxShadow: "1px 2px 9px #bababa",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                textAlign: "right",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <p
                style={{
                  border: "1px solid #00d000",
                  color: "#00d000",
                  fontWeight: "600",
                  padding: "3px 17px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  backgroundColor: "#d7ffd7",
                }}
              >
                On time
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <Avatar
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px solid #cacaca",
                }}
                src={
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/IMG_Academy_Logo.svg/640px-IMG_Academy_Logo.svg.png"
                    alt="avatar"
                  />
                }
              />
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Đỗ Phạm Huy Khánh
              </p>
              <div
                style={{
                  fontSize: "16px",
                }}
              >
                Nhân viên ...
              </div>
              <Button
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: "4px 30px",
                }}
              >
                Edit
              </Button>
            </div>

            <div className="individual-detail">
              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0"
                }}
              >
                <FaPhone style={{ width: "16px", height: "16px" }} />
                <p>
                  Phone Number:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    0886667068
                  </span>
                </p>
              </div>

              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0"
                }}
              >
                <FaTransgender style={{ width: "16px", height: "16px" }} />
                <p>
                  Gender:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    Male
                  </span>
                </p>
              </div>

              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0"
                }}
              >
                <FaBirthdayCake style={{ width: "16px", height: "16px" }} />
                <p>
                  Birthday:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    26/04/2002
                  </span>
                </p>
              </div>

              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0"
                }}
              >
                <MdEmail style={{ width: "16px", height: "16px" }} />
                <p>
                  Email:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    khanhdph2604@gmail.com
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            className="left__notice"
            style={{
              dpadding: "20px",
              borderRadius: "5px",
              border: "1px solid #333",
              padding: "16px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "18px",
                marginBottom: "15px",
              }}
            >
              Notice board
            </div>

            <div
              className="left__notice-container"
              style={{
                display: "flex",
                gap: "4px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <RiErrorWarningFill
                  style={{ color: "red", width: "20px", height: "20px" }}
                />
                <p style={{ fontWeight: "600", fontSize: "16px" }}>
                  Caution: <span>Too many absent</span>
                </p>
              </div>
              <p style={{ fontWeight: "600", fontSize: "16px" }}>12/2023</p>
            </div>

            <div
              className="left__notice-container"
              style={{
                display: "flex",
                gap: "4px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <RiErrorWarningFill
                  style={{ color: "red", width: "20px", height: "20px" }}
                />
                <p style={{ fontWeight: "600", fontSize: "16px" }}>
                  Caution: <span>Too many late </span>
                </p>
              </div>
              <p style={{ fontWeight: "600", fontSize: "16px" }}>12/2023</p>
            </div>
          </div>
        </div>

        <div
          className="manage-info__right"
          style={{
            boxShadow: "1px 2px 9px #bababa",
            width: "60%",
            borderRadius: "5px",
            padding: "20px 0px",
          }}
        >
          <div
            className="right-calender"
            style={{
              borderBottom: "1px solid #bababa",
              paddingBottom: "15px",
              textAlign: "center",
            }}
          >
            <DatePicker className="css-dev-only-do-not-override-p7e5j5" onChange={onChange} />
          </div>

          <div
            style={{
              padding: "20px",
            }}
          >
            <div
              className="right-display"
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                className="right-display-item"
                style={{
                  width: "calc(100%/3)",
                  borderRight: "1px solid #333",
                }}
              >
                <IoMdCheckmarkCircleOutline
                  style={{ width: "30px", height: "30px" }}
                />
                <div
                  className="item-info"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                >
                  <p style={{ fontWeight: "600", textAlign: "start" }}>08:24</p>
                  <p>Avg check in</p>
                </div>
              </div>

              <div
                className="right-display-item"
                style={{
                  width: "calc(100%/3)",
                  borderRight: "1px solid #333",
                }}
              >
                <IoMdCheckmarkCircleOutline
                  style={{ width: "30px", height: "30px" }}
                />
                <div
                  className="item-info"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                >
                  <p style={{ fontWeight: "600", textAlign: "start" }}>03</p>
                  <p>Late</p>
                </div>
              </div>

              <div
                className="right-display-item"
                style={{
                  width: "calc(100%/3)",
                  borderRight: "1px solid #333",
                }}
              >
                <RiErrorWarningLine style={{ width: "30px", height: "30px" }} />
                <div
                  className="item-info"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                >
                  <p style={{ fontWeight: "600", textAlign: "start" }}>05</p>
                  <p>Absent</p>
                </div>
              </div>
            </div>

            <div className="right-body-list">
              <div
                className="list-title"
                style={{
                  display: "flex",
                  backgroundColor: "#dedada",
                  marginTop: "15px",
                  padding: "5px 10px",
                }}
              >
                <p
                  style={{ fontWeight: "600", width: "40%" }}
                  className="list-title-date"
                >
                  Date
                </p>
                <p
                  style={{ fontWeight: "600", width: "30%" }}
                  className="list-checkin"
                >
                  Check in
                </p>
                <p
                  style={{ fontWeight: "600", width: "30%" }}
                  className="list-status"
                >
                  Status
                </p>
              </div>

              <div
                className="list-item"
                style={{
                  display: "flex",
                  marginTop: "15px",
                  padding: "5px 10px",
                }}
              >
                <p style={{ width: "40%" }} className="list-title-date">
                  02/12/2023
                </p>
                <p style={{ width: "30%" }} className="list-checkin">
                  7:00 am
                </p>

                <div className="individual-status">
                  <p
                    style={{
                      border: "1px solid #00,000",
                      color: "#00d000",
                      fontWeight: "600",
                      padding: "3px 17px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      backgroundColor: "#d7ffd7",
                    }}
                  >
                    On time
                  </p>
                </div>
              </div>

              <div>
                <div
                  className="list-item"
                  style={{
                    display: "flex",
                    marginTop: "15px",
                    padding: "5px 10px",
                  }}
                >
                  <p style={{ width: "40%" }} className="list-title-date">
                    02/12/2023
                  </p>
                  <p style={{ width: "30%" }} className="list-checkin">
                    7:00 am
                  </p>

                  <p
                    className="status-absent"
                    style={{
                      border: "1px solid #8d8d8d",
                      color: "#8d8d8d",
                      fontWeight: "600",
                      padding: "3px 17px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      backgroundColor: "#e2e5e2",
                    }}
                  >
                    Absent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageInfo;
