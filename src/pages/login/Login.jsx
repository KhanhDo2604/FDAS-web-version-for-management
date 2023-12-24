import React, { useState } from "react";
import { BiSolidUser } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../components/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const { logIn } = UserAuth();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #5d54a4, #7c78b8)",
          position: "relative",
          height: "600px",
          width: "360px",
          boxShadow: "0px 0px 24px #5c5696",
        }}
      >
        <div
          style={{
            zIndex: "1",
            position: "relative",
            height: "100%",
          }}
        >
          <form
            style={{
              width: "320px",
              padding: "30px",
              paddingTop: "156px",
            }}
          >
            <div
              style={{
                padding: "20px 0px",
                position: "relative",
              }}
            >
              <BiSolidUser
                style={{
                  position: "absolute",
                  top: "30px",
                  color: "#7875b5",
                }}
              />
              <input
                type="text"
                className="login__input"
                style={{
                  border: "none",
                  borderBottom: "2px solid #d1d1d4",
                  background: "none",
                  padding: "10px",
                  paddingLeft: "24px",
                  fontWeight: "700",
                  width: "75%",
                  transition: "0.2s",
                }}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              style={{
                padding: "20px 0px",
                position: "relative",
              }}
            >
              <RiLockPasswordFill
                className="login__icon"
                style={{
                  position: "absolute",
                  top: "30px",
                  color: "#7875b5",
                }}
              />
              <input
                type="password"
                className="login__input"
                style={{
                  border: "none",
                  borderBottom: "2px solid #d1d1d4",
                  background: "none",
                  padding: "10px",
                  paddingLeft: "24px",
                  fontWeight: "700",
                  width: "75%",
                  transition: "0.2s",
                }}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              style={{
                background: "#fff",
                fontSize: "14px",
                marginTop: "30px",
                padding: "16px 20px",
                borderRadius: "26px",
                border: "1px solid #d4d3e8",
                textTransform: "uppercase",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                width: "100%",
                color: "#4c489d",
                boxShadow: "0px 2px 2px #5c5696",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onClick={(e) => {
                e.preventDefault();
                logIn(email, password).then((role) => {
                  if (role === "staff") {
                    navigate("/manageinfo");
                  } else if (role === "admin") {
                    navigate("/");
                  }
                });
              }}
            >
              <span>Log In Now</span>
              <MdArrowForwardIos />
            </button>
          </form>
        </div>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "0",
            WebkitClipPath: "inset(0 0 0 0)",
            clipPath: "inset(0 0 0 0)",
          }}
        >
          <span
            style={{
              height: "400px",
              width: "200px",
              background: "#7e7bb9",
              top: "420px",
              right: "50px",
              borderRadius: "60px",
              transform: "rotate(45deg)",
              position: "absolute",
            }}
          ></span>
          <span
            style={{
              height: "540px",
              width: "190px",
              background: "linear-gradient(270deg, #5d54a4, #6a679e)",
              top: "-24px",
              right: "0",
              borderRadius: "32px",
              transform: "rotate(45deg)",
              position: "absolute",
            }}
          ></span>
          <span
            style={{
              height: "220px",
              width: "220px",
              background: "#6c63ac",
              top: "-172px",
              right: "0",
              borderRadius: "32px",
              transform: "rotate(45deg)",
              position: "absolute",
            }}
          ></span>
          <span
            style={{
              height: "520px",
              width: "520px",
              background: "#fff",
              top: "-50px",
              right: "120px",
              borderRadius: "0 72px 0 0",
              transform: "rotate(45deg)",
              position: "absolute",
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
