import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDataContext } from "../DataContext";

export default function NotificationPage() {
  const navigate = useNavigate();
  const {
    setNewNotificationCount,
    notifications,
    updateNotifications,
    loginFlag,
    formatTimeDifference,
  } = useDataContext();

  useEffect(() => {
    updateNotifications(); //make call to make the notifications as read if()
    setNewNotificationCount(0);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      navigate(`/feed/${notification.post}`);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  return (
    <div className=" laptop:mt-16 mt-9">
      {loginFlag ? (
        <div className="min-h-screen bg-customGray">
          <div className="mt-1 flex flex-col items-center w-full">
            <div className="bg-white w-full max-w-2xl p-4 rounded-lg shadow-md">
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`rounded border-b p-2 ${
                      !notification.read ? "bg-blue-50" : ""
                    } cursor-pointer`}
                  >
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={notification.fromUser.profilePicture}
                          alt="profile pic"
                          loading="lazy"
                          className="h-10 w-10 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${notification.fromUser.name}`, {
                              state: { userId: notification.fromUser },
                            });
                          }}
                        />
                        <span className="text-stone-900">
                          {notification.message}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimeDifference(new Date(notification.createdAt))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Login Required</p>
            <p className="text-gray-700 mb-4">
              Please log in to access this page.
            </p>
            <Link to="/" className="text-blue-500 hover:underline">
              Go to Login Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
