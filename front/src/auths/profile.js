import { Col, Row, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import _ from "lodash";
import { loadLoggedUser, saveProfileChanges } from "../reduxStore/actions/auth";
import { useHistory } from "react-router";

const Profile = ({ match }) => {
  const dispatch = useDispatch();
  const hist = useHistory();
  // const { user: unmodified } = useSelector((state) => state.authReducer);
  const {
    user: unmodified,
    saving_profile,
    saving_profile_error,
  } = useSelector((state) => state.authReducer);

  const [user, setUser] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    let modifiedItems = {};
    for (let key in user)
      if (user[key] !== unmodified[key]) modifiedItems[key] = user[key];
    if (_.isEqual({}, modifiedItems) === false)
      await dispatch(
        saveProfileChanges(
          modifiedItems,
          unmodified._id,
          _.capitalize(unmodified.role),
          hist
        )
      );
    else alert("no changes to save!");
  };

  useEffect(async () => {
    if (unmodified === null) {
      dispatch(loadLoggedUser(hist))
        .then((res) => setUser(res))
        .catch((err) => {});
    }
    setUser(unmodified);
  }, []);

  return (
    <div className="profile">
      <h3>Profile</h3>
      <hr />
      {user && (
        <div className="profile-data">
          <Form.Group>
            <Form.Label style={{ float: "left" }}>Name</Form.Label>
            <Form.Control
              value={user.name}
              onChange={handleChange}
              name="name"
            />
          </Form.Group>
          <Form.Label style={{ float: "left" }}>Gender</Form.Label>
          <Form.Control as="select" name="gender" onChange={handleChange}>
            <option value={user.gender}>{user.gender}</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Control>
          <Form.Label style={{ float: "left" }}>Date of Birth</Form.Label>
          <Form.Control
            value={user.dob}
            type="date"
            name="dob"
            required
            onChange={handleChange}
          />
          <Form.Label style={{ float: "left" }}>Email </Form.Label>
          <Form.Control
            placeholder={user.email}
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <Form.Label style={{ float: "left" }}>Phone</Form.Label>
          <Form.Control
            type="tel"
            value={user.phone}
            name="phone"
            onChange={handleChange}
            maxLength={10}
          />
          {saving_profile_error && (
            <p className="auth-error">{saving_profile_error?.message}</p>
          )}

          {saving_profile ? (
            <Button disabled={true} onClick={(e) => saveChanges(e)}>
              Saving...
            </Button>
          ) : _.isEqual(user, unmodified) ? (
            <Button disabled={true}>Save Changes</Button>
          ) : (
            <Button onClick={(e) => saveChanges(e)}>Save Changes</Button>
          )}
        </div>
      )}
    </div>
  );
};
export default Profile;
