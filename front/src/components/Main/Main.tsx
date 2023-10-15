import React from "react";
import style from './Main.module.css'
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home/Home";
import Detail from "../pages/Detail/Detail";
import Login from "../pages/Login/Login";
import Message from "../Message/Message";
import Logout from "../pages/Logout/Logout";
import Review from "../pages/Tech/Review/Review";
import Equipment from "../pages/Equipment/Equipment";
import Loading from "../pages/Loading/Loading";
import Presentation from "../pages/Presentation/Presentation";


const Main = () => {
    return (
        <div className={style.window}>
            <div className={style.content}>
                <Routes>
                    <Route path="*" element={<Home />} />
                    <Route path="review" element={<Review />} />
                    <Route path="detail" element={<Detail />} />
                    <Route path="equipment" element={<Equipment />} />
                    <Route path="loading" element={<Loading />} />
                    <Route path="login" element={<Login />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="tests" element={<Presentation />} />
                </Routes>
                <Message/>
            </div>
        </div>
    )
}

export default Main