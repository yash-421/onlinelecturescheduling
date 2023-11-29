"use client";

import AdminLayout from "@/app/shared/adminShared";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Pagination,
  Button,
  Typography,
  Box,
  Modal,
  Backdrop,
  Fade,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  TextField,
  styled,
  Alert,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import { FaPlus, FaRegEdit, FaTimes } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { MdDelete, MdFileUpload } from "react-icons/md";
import * as Yup from "yup";
import axios from "axios";

interface Values {
  name: string;
  image: File | null;
}

const Instructor = () => {
  const [open, setOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateValue, setUpdateValue] = useState({
    name: "",
    email: "",
    courseId: "",
  });
  const [allInstructor, setALlInstructors] = useState([]);
  const [instructorId, setinstructorId] = useState("");
  const [toast, setToast] = useState({
    success: true,
    text: "",
    isOpen: false,
  });

  const handleSubmit = (values: any, FormikHelper: any) => {
    axios.post("http://localhost:4000/" + "admin/addInstructor", values).then(
      (data) => {
        setToast({
          text: data.data.message,
          isOpen: true,
          success: data.data.success,
        });

        setOpen(false);
        getAllInstructors();
      },
      (err) => {
        console.log(err);

        setToast({
          text: err.response.data.message,
          isOpen: true,
          success: err.response.data.success,
        });
      }
    );
    setOpen(false);
    setTimeout(() => {
      // Reset the form and set submitting to false
      FormikHelper.resetForm();
      FormikHelper.setSubmitting(false);
    }, 1000);
  };

  const handleUpdate = (values: any, FormikHelper: any) => {
    axios.post("http://localhost:4000/" + "admin/updateInstructor", values).then(
      (data) => {
        setToast({
          text: data.data.message,
          isOpen: true,
          success: data.data.success,
        });
        setOpen(false);
        getAllInstructors();
      },
      (err) => {
        console.log(err);

        setToast({
          text: err.response.data.message,
          isOpen: true,
          success: err.response.data.success,
        });
      }
    );
    setUpdateModal(false);
    setTimeout(() => {
      // Reset the form and set submitting to false
      FormikHelper.resetForm();
      FormikHelper.setSubmitting(false);
    }, 1000);
  };

  const handleDelete = () => {
    axios
      .post("http://localhost:4000/" + "admin/deleteInstructor", {
        instructorId: instructorId,
      })
      .then(
        (data) => {
          setToast({
            text: data.data.message,
            isOpen: true,
            success: data.data.success,
          });
          setDeleteModal(false);
          getAllInstructors();
        },
        (err) => {
          console.log(err);

          setToast({
            text: err.response.data.message,
            isOpen: true,
            success: err.response.data.success,
          });
        }
      );
  };

  const getAllInstructors = () => {
    axios
      .post("http://localhost:4000/" + "admin/getAllInstructors", {})
      .then((data) => {
        console.log(data);
        setALlInstructors(data.data.data);
      });
  };

  useEffect(() => {
    let hideToast = setTimeout(() => {
      setToast((value) => {
        return { ...value, isOpen: false };
      });
    }, 4000);
    return () => {
      clearTimeout(hideToast);
    };
  }, [toast]);

  useEffect(() => {
    getAllInstructors();
  }, []);

  const addFormValidation = Yup.object().shape({
    name: Yup.string().required("*Instructor name is required"),
    email: Yup.string().required("*Email name is required"),
    password: Yup.string().required("*Password is required"),
  });

  const updateFormValidation = Yup.object().shape({
    name: Yup.string().required("*Category name is required"),
    email: Yup.string().required("*Email name is required"),
    password: Yup.string(),
  });

  return (
    <AdminLayout title="Category">
      <Paper
        sx={{ width: "100%", overflow: "hidden" }}
        className="p-10 border-[1px] shadow-none rounded-lg"
      >
        <div className="content flex justify-between mb-7 px-5">
          <Typography variant="h5" component="h1">
            Instructors
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            <FaPlus className="text-xl mr-1" /> Add
          </Button>
        </div>

        <TableContainer className="border-[1px]">
          <Table stickyHeader aria-label="sticky table">
            <TableHead className="bg-primary">
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Instructor Name </TableCell>
                <TableCell>Instructor Email </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allInstructor.length > 0 &&
                allInstructor.map((data, key) => (
                  <TableRow key={key}>
                    <TableCell>{key + 1} </TableCell>
                    <TableCell>{data.name} </TableCell>
                    <TableCell>{data.email} </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Typography
                          component="a"
                          variant="subtitle1"
                          onClick={() => {
                            setUpdateModal(true);
                            setUpdateValue({
                              name: data.name,
                              email: data.email,
                              instructorId: data._id,
                            });
                          }}
                        >
                          <FaRegEdit className=" cursor-pointer text-xl mx-1" />
                        </Typography>
                        <Typography
                          component="a"
                          variant="subtitle1"
                          onClick={() => {
                            setDeleteModal(true);
                            setinstructorId(data._id);
                          }}
                        >
                          <MdDelete className=" cursor-pointer text-xl mx-1" />
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Pagination
          count={10}
          color="primary"
          className=" mt-5 w-full flex justify-center "
          variant="outlined"
          shape="rounded"
        /> */}
      </Paper>

      {/* Add Category */}
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
              Add Intsructor
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
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={addFormValidation}
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
                      <FormControlLabel
                        control={
                          <Field
                            className="mt-2"
                            as={TextField}
                            name="name"
                            size="small"
                            label="Instructor"
                          />
                        }
                        label={"Instructor Name"}
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.name && errors.name && (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          {errors.name}
                        </Typography>
                      )}
                      <FormControlLabel
                        control={
                          <Field
                            className="mt-2"
                            as={TextField}
                            name="email"
                            size="small"
                            label="Email"
                            type="email"
                          />
                        }
                        label={"Intructors Email"}
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.email && errors.email && (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          {errors.email}
                        </Typography>
                      )}
                      <FormControlLabel
                        control={
                          <Field
                            className="mt-2"
                            as={TextField}
                            name="password"
                            size="small"
                            label="Password"
                            type="password"
                          />
                        }
                        label={"Instructors Password"}
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.password && errors.password && (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          {errors.password}
                        </Typography>
                      )}
                    </FormGroup>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || !isValid}
                      className="mt-2 self-center"
                    >
                      Submit
                    </Button>
                  </FormControl>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Update Category  */}

      <Modal
        open={updateModal}
        onClose={() => setUpdateModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="z-[9999999999] overflow-auto"
      >
        <Box className="bg-white md:max-w-[700px] sm:max-w-[100%] w-[500px] absolute left-1/2 top-10 -translate-x-1/2  rounded-xl">
          <div className="modal-header flex justify-between w-full p-5">
            <Typography component="h5" variant="h6">
              Update Instructor
            </Typography>
            <Button
              variant="text"
              className="text-2xl"
              onClick={() => setUpdateModal(false)}
            >
              <LiaTimesSolid />
            </Button>
          </div>
          <Divider />
          <Formik
            initialValues={updateValue}
            validationSchema={updateFormValidation}
            onSubmit={handleUpdate}
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
                      <FormControlLabel
                        control={
                          <Field
                            className="mt-2"
                            as={TextField}
                            name="name"
                            size="small"
                            label="Instructor"
                          />
                        }
                        label={"Instructor Name"}
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.name && errors.name && (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          {errors.name}
                        </Typography>
                      )}
                      <FormControlLabel
                        control={
                          <Field
                            className="mt-2"
                            as={TextField}
                            name="email"
                            size="small"
                            label="Email"
                            type="email"
                          />
                        }
                        label={"Intructors Email"}
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.email && errors.email && (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          {errors.email}
                        </Typography>
                      )}
                      <FormControlLabel
                        control={
                          <Field
                            className="mt-2"
                            as={TextField}
                            name="password"
                            size="small"
                            label="Password"
                            type="password"
                          />
                        }
                        label={"Instructors Password"}
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.password && errors.password && (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          {errors.password}
                        </Typography>
                      )}
                    </FormGroup>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || !isValid}
                      className="mt-2 self-center"
                    >
                      Update
                    </Button>
                  </FormControl>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Delete Modal */}

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="z-[9999999999] overflow-auto"
      >
        <Box className="bg-white md:max-w-[700px] sm:max-w-[100%] w-[500px] absolute left-1/2 top-10 -translate-x-1/2  rounded-xl">
          <div className="modal-header flex justify-between w-full p-5">
            <Typography component="h5" variant="h6">
              Delete Category
            </Typography>
            <Button
              variant="text"
              className="text-2xl"
              onClick={() => setDeleteModal(false)}
            >
              <LiaTimesSolid />
            </Button>
          </div>
          <Divider />

          <Typography variant="h6" component="h5" className="my-5 px-5">
            Are your sure want to delete ?
          </Typography>
          <Divider />

          <div className="buttons w-full flex justify-end my-5">
            <Button
              className="mx-2"
              variant="contained"
              color="secondary"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="mx-2"
              variant="contained"
              color="primary"
              onClick={handleDelete}
            >
              Confirm
            </Button>
          </div>
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
      )}
    </AdminLayout>
  );
};

export default Instructor;
