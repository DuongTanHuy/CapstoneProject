import { ActionDelete, ActionEdit } from "components/actions";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRole, userStatus } from "untils/constants";

const UserTable = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (onSnapshot) => {
      const result = [];
      onSnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(result);
    });
  }, []);

  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="approved">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="pending">Pending</LabelStatus>;
      case userStatus.BAN:
        return <LabelStatus type="un-approved">Rejected</LabelStatus>;
      default:
        break;
    }
  };

  const renderLabelRole = (role) => {
    switch (role) {
      case userRole.USER:
        return "User";
      case userRole.ADMIN:
        return "Admin";
      default:
        break;
    }
  };

  const renderUserItems = (user) => {
    return (
      <tr key={user.id}>
        <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
        <td>
          <div className="flex items-center gap-x-3">
            <img
              src={`${user.avatar || "/img-upload.png"}`}
              alt=""
              className="w-[66px] h-[55px] rounded object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{user.fullName}</h3>
              <time className="text-sm text-gray-500">
                {new Date(user.createAt?.seconds * 1000).toLocaleDateString()}
              </time>
            </div>
          </div>
        </td>
        <td>{user.userName}</td>
        <td>{user.email}</td>
        <td>{renderLabelStatus(Number(user?.status))}</td>
        <td>{renderLabelRole(Number(user.role))}</td>
        <td>
          <div className="flex items-center gap-x-3">
            <ActionEdit
              onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
            ></ActionEdit>
            <ActionDelete></ActionDelete>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>User Name</th>
            <th>Email Address</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((user) => renderUserItems(user))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
