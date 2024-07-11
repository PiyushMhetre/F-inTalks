import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create a new context
const DataContext = createContext();

// Custom hook to use the data context
export const useDataContext = () => useContext(DataContext);

// Data provider component
export const DataProvider = ({ children }) => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [allQA, setAllQA] = useState([]);
  const [userId, setUserId] = useState(null); // Initialize userId to null or empty
  const [userBlogs, setUserBlogs] = useState([]);
  const [userQnAs, setUserQnAs] = useState([]);
  const [loading, setLoading] = useState(true); //this is for loading time for fetching data
  const navigate = useNavigate();
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [newNotificationFlag, setNewNotificationFlag] = useState(false);
  const [loginFlag, setLoginFlag] = useState(false);
  const [blogNotificationFlag, setBlogNotificationFlag] = useState(false);
  //user info variables
  const [name, setName] = useState();
  const [company, setCompany] = useState();
  const [linkedin, setLinkedin] = useState();
  const [college, setCollege] = useState();
  const [userProfile, setUserProfile] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const currentPath = window.location.pathname;
  const feedPathPattern = /^\/feed\/[^/]+$/; //  expression to match /feed/:blogId

  const userInfo = {
    name,
    company,
    linkedin,
    college,
    userId,
    userProfile,
    setUserProfile,
    savedPosts,
  };
  const userInfoSetter = {
    setName,
    setCollege,
    setCompany,
    setNotifications,
    setUserProfile,
    setLinkedin,
    setUserId,
  };

  const sentCookie = async () => {
    console.log("sending cookie");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_ROUTE}/protected`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // If successful response, set userId and navigate to /feed
        const id = response.data.userId;
        setName(response.data.info.name);
        setCollege(response.data.info.college);
        setCompany(response.data.info.company);
        setLinkedin(response.data.info.linkedin);
        setUserProfile(response.data.info.profilePicture);
        setNotifications(response.data.info.notifications.reverse());
        setUserId(id);
        setSavedPosts(response.data.info.savedPosts);
        setLoginFlag(true);
        if (feedPathPattern.test(currentPath)) {
          // If current path matches /feed/:blogId, navigate to the specific blog post
          navigate(currentPath);
        } else {
          // Otherwise, navigate to the general feed
          navigate("/feed");
        }
      } else if (response.status === 999) {
        // Handle other status code, e.g., unauthorized
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching cookie:", error);
    }
  };

  //notification counr 
  useEffect(() => {
    const unreadCount = notifications.filter(
      (notification) => !notification.read
    ).length;
    setNewNotificationCount(unreadCount);
    if (unreadCount > 0) {
      setNewNotificationFlag(true);
    }
  }, [notifications]);

  useEffect(() => {
    sentCookie();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_ROUTE}/getBlogs`,
        {
          withCredentials: true,
        }
      );
      const { Blogs } = response.data;

      // Filter blogs and Q&A based on type
      const filteredBlogs = Blogs.filter((blog) => blog.type === "blog");
      const filteredQA = Blogs.filter((blog) => blog.type === "qna");

      // Filter user-specific blogs and Q&A if userId is available

      // Set allBlogs and allQA state based on filtered data
      setAllBlogs(filteredBlogs.reverse());
      setAllQA(filteredQA.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //filtering userBlogs when we get the id and Allblogs
  useEffect(() => {
    if (userId && allBlogs) {
      const userFilteredBlogs = allBlogs.filter(
        (blog) => blog.author._id === userId && blog.type === "blog"
      );
      const userFilteredQnAs = allQA.filter(
        (blog) => blog.author._id === userId && blog.type === "qna"
      );
      setUserBlogs(userFilteredBlogs);
      setUserQnAs(userFilteredQnAs);
    }
  }, [userId, allBlogs]);

  //websocket connection
  useEffect(() => {
    if (loginFlag) {
      const token = localStorage.getItem("token");
      const ws = new WebSocket(`wss://intalks.co.in/socket?token=${token}`);

      if (!token) {
        console.log("Token not found in local storage");
        return;
      }

      try {
        ws.onopen = () => {
          console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
          const messageObject = JSON.parse(event.data);
          const message = messageObject.message;

          if (message === "WebSocket connection established") {
            // This message is not a notification, so do nothing
            return;
          }

          //we are setting the new coming post here only if the user is online 
          if (messageObject.type === "newBlog") {
            setBlogNotificationFlag(true);
            if(messageObject.post.type === 'blog'){
              // console.log("blog from noti",messageObject.post)
              setAllBlogs((preBlogs) => [
              messageObject.post,
              ...preBlogs
              ])
            }
            else{
              setAllQA((allqas) => [
                 messageObject.post,
                 ...allqas
              ])
            }
            
          }

          const notification = messageObject;
          // console.log("noti", messageObject);

          setNewNotificationFlag(true);
          setNotifications((prevNotifications) => [
            notification,
            ...prevNotifications,
          ]);
          setNewNotificationCount((prevCount) => {
            const newCount = prevCount + 1;
            return newCount;
          });
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        return () => {
          ws.close();
        };
      } catch (error) {
        console.error("Error establishing WebSocket connection:", error);
      }
    }
  }, [loginFlag]);


  //marking notifications as read 
  const updateNotifications = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_ROUTE}/notification`,
        {
          data: userId,
        }
      );
      if (response.status === 200) {
        setNewNotificationFlag(0);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  function formatTimeDifference(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s `;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y`;
}
  // Context value to be provided
  const contextValue = {
    allBlogs,
    allQA,
    userId,
    setAllBlogs,
    setAllQA,
    fetchData,
    userBlogs,
    userQnAs,
    setUserBlogs,
    setUserQnAs,
    loginFlag,
    setLoginFlag,
    loading,
    sentCookie,
    newNotificationCount,
    setNewNotificationCount,
    notifications,
    newNotificationFlag,
    setNewNotificationFlag,
    setNotifications,
    updateNotifications,
    userInfo,
    userInfoSetter,
    blogNotificationFlag,
    setBlogNotificationFlag,
    setSavedPosts,
    savedPosts,
    userProfile,
    formatTimeDifference,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
