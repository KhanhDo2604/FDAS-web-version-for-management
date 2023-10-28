import React, { useRef, useState } from 'react'
import "../adding/Adding.css"
import { AiOutlinePlus } from "react-icons/ai"

const Adding = () => {
    const imageRef = useRef()
    const [image, setImage] = useState("")

    const handleImageClick = () => {
        imageRef.current.click()
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file)
    }

    return (
        <div className="add">
            <div className="screen">
                <form className='screen__content'>

                    <div onClick={handleImageClick} className='adding__image'>
                        {
                            image ? <img src={URL.createObjectURL(image)} alt="" />
                                : <div className='adding__upload'>
                                    <AiOutlinePlus size={14} color='#5d54a4' />
                                    <span>Upload</span>
                                </div>
                        }
                        <input type="file" accept=".png, .jpg, .jpeg, .svg" ref={imageRef} onChange={handleImageChange} />
                    </div>

                    <div className='adding__position'>
                        <div>
                            <label htmlFor="">Hãy chọn chức vụ hiện tại:</label>
                        </div>
                        <select name="position" id="position" >
                            <option value="markerting">Markerting</option>
                            <option value="it">IT</option>
                            <option value="content">Content</option>
                            <option value="media">Media</option>
                        </select>
                    </div>

                    <div className='adding__fullname'>
                        <div>
                            <label htmlFor="">Họ và tên:</label>
                        </div>
                        <input type="text" />
                    </div>

                    <div className='adding__email'>
                        <div>
                            <label htmlFor="">Email:</label>
                        </div>
                        <input type="email" />
                    </div>

                    <div className='adding__phonenumber'>
                        <div>
                            <label htmlFor="">Phone Number:</label>
                        </div>
                        <input type="tel" />
                    </div>

                    <div className='adding__gender'>
                        <div>
                            <label htmlFor="">Giới tính:</label>
                        </div>
                        <select name="gender" id="gender" >
                            <option value="nam">Nam</option>
                            <option value="nữ">Nữ</option>

                        </select>
                    </div>

                    <div className='submit__form'>
                        <button>Submit</button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default Adding