import { ActionDelete } from "components/actions";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { deleteUser } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { userRole, userStatus } from "untils/constants";

const UserTable = () => {
  const [userList, setUserList] = useState([]);

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

  const handleDeleteUser = (user) => {
    const colRef = doc(db, "users", user?.id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        await deleteUser(user);
        Swal.fire("Deleted!", "An account has been deleted.", "success");
      }
    });
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
              className="w-[60px] h-[60px] rounded-full object-cover"
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
            {/* truyen tham so vao handle thi phai goi trong mot arow function */}
            <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
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
