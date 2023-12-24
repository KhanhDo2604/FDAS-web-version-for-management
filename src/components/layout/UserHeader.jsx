import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserImage from '../hooks/UseUserImage';
import { UserAuth } from '../hooks/useAuth';

const UserHeader = ({ toggleSidebar }) => {
    const { logOut, user } = UserAuth();
    const url = useUserImage(user);
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        navigate("/login");
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                }}
            >
                <img onClick={toggleSidebar} src="/Button.png" alt="" />
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <img
                        onClick={handleLogout}
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
        </>
    );
};

export default UserHeader;
