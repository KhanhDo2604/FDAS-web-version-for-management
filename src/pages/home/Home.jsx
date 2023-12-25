import React, { useState, Suspense } from "react";
import { TABS } from "../../constant";
import UserHeader from "../../components/layout/UserHeader";

const Dashboard = React.lazy(() => import("../dashboard/Dashboard"));
const Listing = React.lazy(() => import("../listing/Listing"));

const Home = () => {
  const [isActive, setIsActive] = useState(TABS[0]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleActive = (tab) => {
    setIsActive(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: isSidebarVisible ? "280px" : "0",
            backgroundColor: "#1e85f1",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            paddingLeft: isSidebarVisible ? "10px" : "0px",
          }}
        >
          {isSidebarVisible ? TABS.map((tab, index) => (
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
                  fontSize: "20px"
                }}
              >
                {tab.name}
              </span>
            </div>
          )) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <UserHeader toggleSidebar={toggleSidebar} />
          <div
            className="custom-scrollbar"
            style={{ overflowY: "scroll", height: "100vh" }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              {isActive.id === 1 ? <Dashboard /> : <Listing />}
            </Suspense>
          </div>
        </div>
      </div >
    </>
  );
};

export default Home;
