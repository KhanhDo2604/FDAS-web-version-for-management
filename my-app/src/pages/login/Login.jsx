import React from 'react'
import "../login/Login.css"
import { BiSolidUser } from "react-icons/bi"
import { RiLockPasswordFill } from "react-icons/ri"
import { AiOutlineInstagram, AiFillFacebook, AiOutlineTwitter } from "react-icons/ai"

const Login = () => {
    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <form className="login">
                        <div className="login__field">
                            <BiSolidUser className='login__icon' />
                            <input type="text" className="login__input" placeholder="User name / Email" />
                        </div>
                        <div class="login__field">
                            <RiLockPasswordFill className='login__icon' />
                            <input type="password" className="login__input" placeholder="Password" />
                        </div>
                        <button className="button login__submit">
                            <span className="button__text">Log In Now</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>
                    <div className="social-login">
                        <h3>log in via</h3>
                        <div className="social-icons">
                            <AiOutlineInstagram />
                            <AiFillFacebook />
                            <AiOutlineTwitter />
                        </div>
                    </div>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    )
}

export default Login