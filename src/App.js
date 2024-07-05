import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import ProfilePage from './pages/ProfilePage';
import QAPage from './pages/QAPage';
import NotificationPage from './pages/NotificationPage';
import FeedHeader from './components/FeedHeader';
import { useDataContext } from './DataContext';
import OtherUserProfile from './pages/OtherUserProfile';
import { MutatingDots,TailSpin } from 'react-loader-spinner'
import logo from './images/Logo.jpg'
import SingleBlog from './pages/SingleBlog';
import AboutUs from './pages/AboutUs';
import ForgotPassword from './pages/ForgotPassword';

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <TailSpin
      visible={true}
      height="80"
      width="80"
      color="#808080"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
      />
    </div>
  );
};
const RenderLoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <img src={logo} loading="lazy" alt="Logo" className="mb-5 h-36 " />
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#0F52BA" // Blue color
        secondaryColor="#0F52BA" // Blue color
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
function App() {

  const [renderLoading, setRenderLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderLoading(false);
    }, 1300)

    return () => clearTimeout(timer)
  }, [])

  const { loginFlag, loading } = useDataContext();

  return (
   
    <div>
      {
        renderLoading ? <RenderLoadingScreen/> : 
        (
          <div >
        <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/forgetpassword' element={<ForgotPassword/>} />
        
        ({loading ? (
          <Route path="*" element={<LoadingScreen />} />
        ) : (
          <>  
            <Route path="/aboutUs" element={<> <FeedHeader/><AboutUs/></>}/>
            <Route path="/profile/:name" element={<> <FeedHeader/> <OtherUserProfile/> </>} />
            <Route path="/feed" element={<> <FeedHeader /> <Feed /></>} />
            <Route path="/inTalks/:name" element={<> <FeedHeader /> <ProfilePage /></>} />
            <Route path="/q&a" element={<> <FeedHeader /> <QAPage /></>} />
            <Route path='/notificaiton' element = {<>  <FeedHeader /> <NotificationPage/></>}/>
            <Route path='/feed/:blogId' element = {<> <FeedHeader/> <SingleBlog/> </>} />
            
          </>
        )})
      </Routes>
    </div>
        )
      }
    </div>
    
    
  );
}

export default App;
