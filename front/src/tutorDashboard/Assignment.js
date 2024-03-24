import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import MySpinner from "../Utils/Spinner";
import { useHistory } from "react-router";
import Eval from "./EvaluateModal";
import { useDispatch, useSelector } from "react-redux";
import { loadLoggedUser } from "../reduxStore/actions/auth";

export default function Classroom({ match }) {
  const { user, loading: userLoading } = useSelector(
    (state) => state.authReducer
  );
  const dispatch = useDispatch();
  const hist = useHistory();

  const [evaluate, setEvaluate] = useState(false);
  const [toEvaluate, setToEvaluate] = useState({
    AID: match.params.id,
    SID: null,
    assignment: null,
    userid: "",
  });

  const [assignmentS, setAssignmentS] = useState([]);

  useEffect(() => {
    if (user === null) dispatch({ type: loadLoggedUser(hist) });
    const getAssignment = async () => {
      const { data } = await axios.get(
        `/asn/assignment/${match.params.id}/get`
      );
      setAssignmentS(data.doneby);
      console.log("data", data);
      console.log("reqs", data.studentRequests);
    };
    getAssignment();
  }, []);

  async function evaluateAssignment(assignment, SID) {
    setToEvaluate({
      ...toEvaluate,
      assignment: assignment,
      SID,
    });
    console.log("assign => ", toEvaluate);
    setEvaluate(true);
  }

  const submissionArray = assignmentS.map((cr) => (
    <tr
      style={{
        background: cr.evaluated ? "green" : " red",
        color: "white",
        fontWeight: "bolder",
      }}
    >
      <td>{cr.student.name}</td>
      <td>{cr.student.email}</td>
      <td>{cr.student.phone}</td>
      <td>
        {cr.evaluated ? (
          <div>score : {cr.score}</div>
        ) : (
          <div
            onClick={() =>
              evaluateAssignment(cr.file.fileURL || "", cr.student._id)
            }
          >
            <b style={{ cursor: "pointer", color: "purple" }}>Evaluate Now</b>
          </div>
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      {userLoading ? (
        <MySpinner />
      ) : (
        <>
          <div id="heading">Assignment Submissions</div>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Evaluated</th>
              </tr>
            </thead>
            <tbody>{submissionArray}</tbody>
          </Table>
        </>
      )}

      <Eval
        show={evaluate}
        onHide={() => setEvaluate(false)}
        assignment={toEvaluate}
        userid={user ? user._id : null}
      />
    </div>
  );
}
