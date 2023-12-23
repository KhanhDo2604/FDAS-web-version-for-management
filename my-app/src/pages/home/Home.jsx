import React, { useEffect, useState } from "react";
import Listing from "../listing/Listing";
import Dashboard from "../dashboard/Dashboard";
import { TABS } from "../../constant";
import { UserAuth } from "../../hooks/useAuth";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";

const Home = () => {
  const [isActive, setIsActive] = useState(TABS[0]);
  const [url, setUrl] = useState(null);
  const { logOut, user } = UserAuth();
  const handleActive = (tab) => {
    setIsActive(tab);
  };

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

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "280px",
            backgroundColor: "#1e85f1",
            color: "white",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            paddingLeft: "26px",
          }}
        >
          {TABS.map((tab, index) => (
            <div
              key={index}
              onClick={() => handleActive(tab)}
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                width: "100%",
                textAlign: "center",
                padding: "13px 0",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "29px",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
                ...(isActive === tab
                  ? { color: "#1e85f1", backgroundColor: "#fff" }
                  : { color: "#fff" }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  width: "30%",
                }}
              >
                {tab.icon}
              </div>
              <span
                style={{
                  display: "flex",
                  justifyContent: "start",
                  width: "70%",
                }}
              >
                {tab.name}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <img src="/Button.png" alt="" />
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img
                onClick={() => {
                  logOut();
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
          <div
            style={{
              width: "100%",
              height: "2px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          ></div>
          <div
            className="custom-scrollbar"
            style={{ overflowY: "scroll", height: "100vh" }}
          >
            {isActive.id === 1 ? <Dashboard /> : <Listing />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
