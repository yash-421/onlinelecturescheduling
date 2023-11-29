"use client";
import AdminLayout from "@/app/shared/adminShared";
import {
  Paper,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Box,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  TextField,
  Autocomplete,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FormikHelpers, Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import * as Yup from "yup";
import axios from "axios";

interface AssignmentValues {
  instructor: string;
  course: string;
  date: string;
}

const AssignCourse = () => {
  const [open, setOpen] = useState(false);
  const [assignments, setAssignments] = useState<AssignmentValues[]>([]);
  const [allAssign, setAllAssign] = useState([]);

  const getAllAssign = () => {
    axios
      .post("https://onlinelectureschedulingserver.onrender.com/" + "admin/getAllAssignCourses", {
        instructor: sessionStorage.getItem("instructor"),
      })
      .then((data) => {
        setAllAssign(data.data.data);
      });
  };

  useEffect(() => {
    getAllAssign();
  }, []);

  return (
    <AdminLayout title="Assign Courses">
      <Paper
        sx={{ width: "100%", overflow: "hidden" }}
        className="p-10 border-[1px] shadow-none rounded-lg"
      >
        <div className="content flex justify-between mb-7 px-5">
          <Typography variant="h5" component="h1">
            My Lecture
          </Typography>
          {/* <Button variant="contained" onClick={() => setOpen(true)}>
            <FaPlus className="text-xl mr-1" /> Assign
          </Button> */}
        </div>

        <TableContainer className="border-[1px]">
          <Table stickyHeader aria-label="sticky table">
            <TableHead className="bg-primary">
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Batch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allAssign.map((assignment, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{(assignment as any).course.name}</TableCell>
                  <TableCell>
                    {new Date((assignment as any).date).getDay() +
                      " - " +
                      new Date((assignment as any).date).getMonth() +
                      " - " +
                      new Date((assignment as any).date).getFullYear()}
                  </TableCell>
                  <TableCell>{(assignment as any)?.batch} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </AdminLayout>
  );
};

export default AssignCourse;
