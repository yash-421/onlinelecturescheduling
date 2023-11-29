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
  Pagination,
  Modal,
  Box,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  TextField,
  Alert,
  styled,
} from "@mui/material";
import { FormikHelpers, Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import { useEffect, useState } from "react";
import { FaPlus, FaRegEdit, FaTimes } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { MdDelete, MdFileUpload } from "react-icons/md";
import * as Yup from "yup";
import axios from "axios";

interface CourseValues {
  name: string;
  level: string;
  description: string;
  image: File | null;
}

const Course = () => {
  const [open, setOpen] = useState(false);
  const [allcourses, setAllcourses] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [updateValue, setUpdateValue] = useState({
    name: "",
    level: "",
    description: "",
    image: null,
    imagesrc:'',
    courseId:""
  });
  const [toast, setToast] = useState({
    success: true,
    text: "",
    isOpen: false,
  });

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
    getAllCourse();
  }, []);

  const handleSubmit = (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    let formData = new FormData();
    Object.entries(values).forEach(([key, value]:[any,any]) => {
      formData.append(key, value);
    });

    axios.post("http://localhost:4000/" + "admin/addCourse", formData).then(
      (data) => {
        setToast({
          text: data.data.message,
          isOpen: true,
          success: data.data.success,
        });
        resetForm();
        setOpen(false);
        getAllCourse();
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
    setSubmitting(false);
  };

  const getAllCourse = () => {
    axios
      .post("http://localhost:4000/" + "admin/getAllCourses", {})
      .then((data) => {
        console.log(data);
        setAllcourses(data.data.data);
      });
  };

  const handleUpdate = (
    values:any,
    formikHelpers:any
  ) => {
    // Your course update logic goes here
    let formData = new FormData();
    Object.entries(values).forEach(([key, value]: [string,  any]) => {
      formData.append(key, value);
    });

    axios.post("http://localhost:4000/" + "admin/updateCourse", formData).then(
      (data) => {
        setToast({
          text: data.data.message,
          isOpen: true,
          success: data.data.success,
        });
        setOpen(false);
        getAllCourse();
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
      formikHelpers.resetForm();
      formikHelpers.setSubmitting(false);
    }, 1000);
  };

  const handleDelete=()=>{
    axios.post("http://localhost:4000/" + "admin/deleteCourse", {courseId:deleteCourseId}).then(
      (data) => {
        setToast({
          text: data.data.message,
          isOpen: true,
          success: data.data.success,
        });
        setDeleteModal(false)
        getAllCourse();
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
  }

  const ImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFormValue: any
  ) => {
    if (e.currentTarget.files) {
      const fileInput = e.currentTarget.files[0];
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(fileInput.type)) {
        setToast((values) => ({
          isOpen: true,
          text: "This File Type is not Allowed",
          success: false,
        }));
        return;
      }
      setFormValue("image", fileInput);
      setUpdateValue((data)=>({...data,imagesrc:URL.createObjectURL(fileInput)}))
    }
  };

  const addCourseValidation = Yup.object().shape({
    name: Yup.string().required("Course Name is required"),
    level: Yup.string().required("Course Level is required"),
    description: Yup.string().required("Course Description is required"),
    image: Yup.mixed().required("Category image is required"),
  });

  const updateCourseValidation = Yup.object().shape({
    name: Yup.string().required("*Course name is required"),
    level: Yup.string().required("*Course level is required"),
    description: Yup.string().required("*Course description is required"),
    imagesrc: Yup.string().required("*Course description is required"),
  });

  return (
    <AdminLayout title="Courses">
      <Paper
        sx={{ width: "100%", overflow: "hidden" }}
        className="p-10 border-[1px] shadow-none rounded-lg"
      >
        <div className="content flex justify-between mb-7 px-5">
          <Typography variant="h5" component="h1">
            Courses
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
                <TableCell>Course Name</TableCell>
                <TableCell>Course Level</TableCell>
                <TableCell>Course Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allcourses.length > 0 &&
                allcourses?.map((data, key) => (
                  <TableRow key={key}>
                    <TableCell>{key + 1} </TableCell>
                    <TableCell>{(data as { name: string }).name}</TableCell>
                    <TableCell>{(data as { level: string }).level}</TableCell>
                    <TableCell> {(data as { description: string }).description} </TableCell>
                    <TableCell>
                      <img
                        src={(data as { image: string }).image}
                        alt="Course Logo"
                        className="w-[100px] h-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Typography
                          component="a"
                          variant="subtitle1"
                          onClick={() => {
                            setUpdateModal(true);
                            setUpdateValue({
                                imagesrc: (data as { image: string }).image,
                                level: (data as { level: string }).level,
                                description: (data as { description: string }).description,
                                courseId: (data as { _id: string })._id,
                                image:null,
                                name:(data as { name: string }).name
                            });
                        }}
                        >
                          <FaRegEdit className="cursor-pointer text-xl mx-1" />
                        </Typography>
                        <Typography
                          component="a"
                          variant="subtitle1"
                          onClick={() => {setDeleteModal(true); setDeleteCourseId((data as { _id: string })._id)}}
                        >
                          <MdDelete className="cursor-pointer text-xl mx-1" />
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
          className="mt-5 w-full flex justify-center "
          variant="outlined"
          shape="rounded"
        /> */}
      </Paper>

      {/* Add Course */}
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
              Add Course
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
            initialValues={{
              name: "",
              level: "",
              description: "",
              image: null,
            }}
            validationSchema={addCourseValidation}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              isValid,
              setFieldValue,
              values,
              touched,
              errors,
            }) => (
              <Form className="flex w-full justify-start p-5 items-center">
                <FormControl className="w-full">
                  <FormGroup>
                    {["name", "level", "description"].map((field, key) => (
                      <React.Fragment key={key}>
                        <FormControlLabel
                          key={field}
                          control={
                            <Field
                              as={TextField}
                              name={field}
                              size="small"
                              label={`Course ${
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }`}
                              className="mt-2"
                            />
                          }
                          label={`Course ${
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }`}
                          className="flex mx-0 flex-col-reverse items-start my-2"
                        />

                        {touched[field as keyof CourseValues] &&
                          errors[field as keyof CourseValues] && (
                            <Typography
                              color="error"
                              variant="caption"
                              component="p"
                            >
                              {errors[field as keyof CourseValues]}
                            </Typography>
                          )}
                      </React.Fragment>
                    ))}
                    <FormControlLabel
                      control={
                        values.image === null ? (
                          <Button
                            component="label"
                            variant="contained"
                            startIcon={<MdFileUpload />}
                          >
                            Upload file
                            <input
                              type="file"
                              accept="image/*"
                              name="image"
                              onChange={(e) => ImageUpload(e, setFieldValue)}
                              style={{ display: "none" }}
                            />
                          </Button>
                        ) : (
                          <div className=" relative mt-2">
                            <img
                              src={URL.createObjectURL(values.image)}
                              alt="Selected Image"
                              className="ml-3 h-[100px] w-[100px]"
                            />
                            <FaTimes
                              className="absolute -right-4 text-2xl -top-3 text-red-600"
                              onClick={() => setFieldValue("image", null)}
                            />
                          </div>
                        )
                      }
                      label={"Category image"}
                      className="flex mx-0 flex-col-reverse items-start my-2"
                    />
                    <ErrorMessage
                      name="image"
                      component={() => (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          Category image is required
                        </Typography>
                      )}
                    />
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
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Update Course */}
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
              Update Course
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
            validationSchema={updateCourseValidation}
            onSubmit={handleUpdate}
          >
            {({
              isSubmitting,
              isValid,
              setFieldValue,
              values,
              touched,
              errors,
            }) => (
              <Form className="flex w-full justify-start p-5 items-center">
                <FormControl className="w-full">
                  <FormGroup>
                    {["name", "level", "description"].map((field, key) => (
                      <React.Fragment key={key}>
                        <FormControlLabel
                          key={field}
                          control={
                            <Field
                              as={TextField}
                              name={field}
                              size="small"
                              label={`Course ${
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }`}
                              className="mt-2"
                            />
                          }
                          label={`Course ${
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }`}
                          className="flex mx-0 flex-col-reverse items-start my-2"
                        />

                        {touched[field as keyof CourseValues] &&
                          errors[field as keyof CourseValues] && (
                            <Typography
                              color="error"
                              variant="caption"
                              component="p"
                            >
                              {errors[field as keyof CourseValues]}
                            </Typography>
                          )}
                      </React.Fragment>
                    ))}
                    <FormControlLabel
                      control={
                        values.image === null && updateValue.imagesrc=="" ? (
                          <Button
                            component="label"
                            variant="contained"
                            startIcon={<MdFileUpload />}
                          >
                            Upload file
                            <input
                              type="file"
                              accept="image/*"
                              name="image"
                              onChange={(e) => ImageUpload(e, setFieldValue)}
                              style={{ display: "none" }}
                            />
                          </Button>
                        ) : (
                          <div className=" relative mt-2">
                            <img
                              src={
                                updateValue.imagesrc 
                              }
                              alt="Selected Image"
                              className="ml-3 h-[100px] w-[100px]"
                            />
                            <FaTimes
                              className="absolute -right-4 text-2xl -top-3 text-red-600"
                              onClick={() => {
                                setFieldValue("image", null);
                                setUpdateValue((data)=>({...data,imagesrc:""}))
                            }}
                            />
                          </div>
                        )
                      }
                      label={"Category image"}
                      className="flex mx-0 flex-col-reverse items-start my-2"
                    />
                    <ErrorMessage
                      name="image"
                      component={() => (
                        <Typography
                          color="error"
                          variant="caption"
                          component="p"
                        >
                          Category image is required
                        </Typography>
                      )}
                    />
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
              Delete Course
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
            Are you sure you want to delete this course?
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
            <Button className="mx-2" variant="contained" color="primary" onClick={handleDelete}>
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

export default Course;
