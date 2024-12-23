import { BsGripVertical } from "react-icons/bs";
import AssignmentControls from "./AssignmentControls";
import { MdOutlineAssignment } from "react-icons/md";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import AssignmentLessonControlButtons from "./AssignmentLessonControlButtons";
import { deleteAssignment, setAssignments } from "./reducer";
import * as courseClient from "../client";
import * as assignmentClient from "./client";
import { useEffect } from "react";

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const removeAssignment = async (assignmentId: string) => {
    await assignmentClient.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };
  const fetchAssignments = async () => {
    const assignments = await courseClient.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  };
  useEffect(() => {
    fetchAssignments();
  }, []);
  return (
    <div id="wd-assignments">
      <AssignmentControls /><br /><br /><br /><br />
      <ul id="wd-modules" className="list-group rounded-0">
        <li className="wd-module list-group-item p-0 mb-5 fs-5 border border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            <b>ASSIGNMENTS</b>
            <AssignmentControlButtons />
          </div>
          <ul id="wd-lessons" className="list-group rounded-0">
            {assignments.map((a: any) => (
                <li className="wd-lesson list-group-item p-3 ps-1 d-flex justify-content-between" style={{ width: "100%" }}>
                  <div className="align-content-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <MdOutlineAssignment className="text-success me-2 fs-3" />
                  </div>
                  <div className="flex-grow-1 px-2">
                    {currentUser.role === "FACULTY" ? (
                      <a className="wd-assignment-link link-dark text-decoration-none"
                        href={`#/Kanbas/Courses/${cid}/Assignments/${a._id}`}>
                        <b>{a.title}</b>
                      </a>
                    ) : (
                      <b>{a.title}</b>
                    )}
                    <p>
                      <span className="text-danger">Multiple Modules </span>
                      <b> Not available until </b>
                      {new Date(a.available.replace(/-/g, '\/').replace(/T.+/, '')).toDateString().split(' ').slice(1).join(' ')}
                      &nbsp;| <b>Due</b> {new Date(a.due.replace(/-/g, '\/').replace(/T.+/, '')).toDateString().split(' ').slice(1).join(' ')}
                      &nbsp;| {a.points || 0} pts
                    </p>
                  </div>
                  <div className="align-content-center justify-content-end">
                    <AssignmentLessonControlButtons
                      assignmentName={a.title}
                      assignmentId={a._id}
                      deleteAssignment={(assignmentId) => {
                        removeAssignment(assignmentId)
                      }}
                    />
                  </div>
                </li>))
            }
          </ul>
        </li>
      </ul>
    </div>
  );
}
