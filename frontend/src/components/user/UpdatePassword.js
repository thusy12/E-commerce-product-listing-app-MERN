import { useEffect, useState } from "react";
import { clearAuthError, updatePassword as updatePasswordAction } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UpdatePassword(){
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const { error, isUpdated } = useSelector((state) => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);
        formData.append("confirmPassword", confirmPassword);
        dispatch(updatePasswordAction(formData));
    };

    useEffect(() => {
      if (isUpdated) {
        toast("Password Updated Successfully", {
          type: "success",
          position: "bottom-center",
        });

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        return;
      }

      if (error) {
        toast(error, {
          position: "bottom-center",
          type: error,
          onOpen: () => {
            dispatch(clearAuthError);
          },
        });
        return;
      }
    }, [isUpdated, error, dispatch]);

    return (
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password_field">Confirm New Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
}
