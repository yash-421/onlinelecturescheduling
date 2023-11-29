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
  Alert,
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
  const [allInstructors, setAllIntructors] = useState([]);
  const [allcourses, setAllcourses] = useState([]);
  const [allAssign, setAllAssign] = useState([]);
  const [toast, setToast] = useState({
    success: true,
    text: "",
    isOpen: false,
  });

  const handleSubmit = (
    values: any,
    formikHelpers: any
  ) => {
    // Your assignment submission logic goes here
    console.log(values);

    // Close the modal
    setOpen(false);

    axios.post("https://onlinelectureschedulingserver.onrender.com/" + "admin/assignCourseToInstructor", values).then(
      (data) => {
        setToast({
          text: data.data.message,
          isOpen: true,
          success: data.data.success,
        });
        formikHelpers.resetForm();
        setOpen(false);
        getAllAssign();
      },
      (err) => {
        console.log(err.response);

        setToast({
          text: err?.response?.data?.message,
          isOpen: true,
          success: false,
        });
      }
    );

    // Simulate an asynchronous operation
    setTimeout(() => {
      // Reset the form and set submitting to false
      formikHelpers.resetForm();
      formikHelpers.setSubmitting(false);
    }, 1000);
  };

  const getAllAssign = () => {
    axios
      .post("https://onlinelectureschedulingserver.onrender.com/" + "admin/getAllAssignCourses", {})
      .then((data) => {
        console.log(data.data.data);

        setAllAssign(data.data.data);
        console.log(allcourses);
      });
  };
  const getAllCourse = () => {
    axios
      .post("https://onlinelectureschedulingserver.onrender.com/" + "admin/getAllCourses", {})
      .then((data) => {
        console.log(data.data.data);

        setAllcourses(data.data.data);
        console.log(allcourses);
      });
  };

  const getAllInstructors = () => {
    axios
      .post("https://onlinelectureschedulingserver.onrender.com/" + "admin/getAllInstructors", {})
      .then((data) => {
        console.log(data.data.data);

        setAllIntructors(data.data.data);
        console.log(allInstructors);
      });
  };


  useEffect(() => {
    getAllCourse();
    getAllInstructors();
    getAllAssign();
  }, []);

  const assignmentValidation = Yup.object().shape({
    instructor: Yup.string().required("*Instructor is required"),
    course: Yup.string().required("*Course is required"),
    date: Yup.string().required("*Date is required"),
  });

  return (
    <AdminLayout title="Assign Courses">
      <Paper
        sx={{ width: "100%", overflow: "hidden" }}
        className="p-10 border-[1px] shadow-none rounded-lg"
      >
        <div className="content flex justify-between mb-7 px-5">
          <Typography variant="h5" component="h1">
            Assign Lecture
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            <FaPlus className="text-xl mr-1" /> Assign
          </Button>
        </div>

        <TableContainer className="border-[1px]">
          <Table stickyHeader aria-label="sticky table">
            <TableHead className="bg-primary">
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Instructor</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allAssign.map((assignment, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{(assignment as any).instructor.name as any}</TableCell>
                  <TableCell>{(assignment as any).course.name}</TableCell>
                  <TableCell>{new Date((assignment as any).date).getDate().toString()+" - "+   (new Date((assignment as any).date).getMonth()+1).toString()+" - "+ new Date((assignment as any).date).getFullYear().toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Assign Course */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="z-[9999999999] overflow-auto"
      >
        <Box className="bg-white md:max-w-[700px] sm:max-w-[100%] w-[500px] absolute left-1/2 top-10 -translate-x-1/2  rounded-xl">
          <div className="modal-header flex justify-between w-full p-5">
            <Typography component="h5" variant="h6">
              Assign Lecture
            </Typography>
            <Button
              variant="text"
              className="text-2xl"
              onClick={() => setOpen(false)}
            >
              <LiaTimesSolid />
            </Button>
          </div>
          <Divider />
          <Formik
            initialValues={{ instructor: "", course: "", date: "", batch: "" }}
            validationSchema={assignmentValidation}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              isValid,
              touched,
              errors,
              values,
              setFieldValue,
            }) => (
              <Form className="flex w-full justify-start p-5 items-center">
                <Box className="flex w-full flex-col items-start">
                  <FormControl className="w-full">
                    <FormGroup>
                      <span className="text-sm">Instructor </span>

                      <FormControl className="my-2">
                        <InputLabel id="demo-simple-select-helper-label">
                          Instructor
                        </InputLabel>
                        <Select
                          id="instructor"
                          name="instructor"
                          label="instructor"
                          size="small"
                          className="z-[99999999999999999999999999999]"
                          value={values.instructor}
                          onChange={(e) =>
                            setFieldValue("instructor", e.target.value)
                          }
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {allInstructors.length > 0 &&
                            allInstructors.map((data) => (
                              <MenuItem key={(data as any)._id} value={(data as any)._id}>
                                {(data as any).name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <span className="text-sm">Course </span>

                      <FormControl className="my-2">
                        <InputLabel id="demo-simple-select-helper-label">
                          Course
                        </InputLabel>
                        <Select
                          id="course"
                          name="course"
                          label="course"
                          size="small"
                          className="z-[99999999999999999999999999999]"
                          value={values.course}
                          onChange={(e) =>
                            setFieldValue("course", e.target.value)
                          }
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {allcourses.length > 0 &&
                            allcourses.map((data) => (
                              <MenuItem key={(data as any)._id} value={(data as any)._id}>
                                {(data as any).name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>

                      <span className="text-sm">Date </span>
                      <Field
                        as={TextField}
                        name="date"
                        size="small"
                        type="date"
                        error={touched.date && Boolean(errors.date)}
                        helperText={touched.date && errors.date}
                        className="my-3"
                      />
                      <span className="text-sm">Batch</span>
                      <Field
                        as={TextField}
                        name="batch"
                        size="small"
                        type="text"
                        error={touched.batch && Boolean(errors.batch)}
                        helperText={touched.batch && errors.batch}
                        className="mt-5"
                        label="Batch Name"
                      />
                    </FormGroup>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || !isValid}
                      className="mt-2 self-center"
                    >
                      Assign
                    </Button>
                  </FormControl>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      {toast.isOpen && (
        <Alert
          variant="filled"
          severity={toast.success ? "success" : "error"}
          className=" fixed top-5 right-5 z-[99999999999999999999999999999999999999999999999999999] "
          onClose={() => {
            setToast((values) => ({ ...values, isOpen: false }));
          }}
        >
          {toast.text}
        </Alert>
      )}{" "}
    </AdminLayout>
  );
};

export default AssignCourse;
