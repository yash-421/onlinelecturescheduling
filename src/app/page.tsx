"use client";
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik, FormikValues } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import * as Yup from "yup";
import axios from "axios";

const Admin = () => {
  const [credentials, setCredential] = useState({ email: "", password: "" });
  const loginValidation = Yup.object().shape({
    email: Yup.string()
      .email("*Please enter valid email")
      .required("*Email is required"),
    password: Yup.string().required("*Password is required"),
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

  const router = useRouter();

  let [showpassword, setShowPassword] = useState("password");

  const login = async (values: FormikValues, { resetForm }: any) => {

   axios.post(
      "https://onlinelectureschedulingserver.onrender.com/" + "admin/login",
      values
    ).then((data)=>{
      setToast({
        text: data.data.message,
        isOpen: true,
        success: data.data.success,
      });

      setTimeout(() => {
        sessionStorage.setItem('type',data.data.type)
        if (data.data.type=='admin') {
          router.push('admin')
        }else{
          sessionStorage.setItem('instructor',data.data.id)
          router.push('/instructor')
        }
      },0);
      resetForm();
    },err=>{
      console.log(err);
      
      setToast({
        text: err.response.data.message,
        isOpen: true,
        success: err.response.data.success,
      });
    })
    


    // if (values) {
    //   router.push("admin");
    // }
  };
  return (
    <Grid
      container
      className="flex justify-center items-center h-screen bg-back"
    >
      <Grid item lg={4} md={8} sm={8} xs={10}>
        <Card className="p-5 shadow-none">
          <CardContent>
            <Formik
              initialValues={credentials}
              validationSchema={loginValidation}
              onSubmit={login}
            >
              {({ isValid, errors, touched, isSubmitting }) => (
                <Form>
                  <FormControl>
                    <Typography
                      variant="h6"
                      className="font-semibold"
                      component="h1"
                    >
                      Welcome Back
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      className="font-light text-gray-400"
                      component="p"
                    >
                      Login to your account
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Field
                            size="small"
                            as={TextField}
                            type="email"
                            label="Email"
                            variant="outlined"
                            className="m-2"
                            name="email"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <MdEmail />
                                </InputAdornment>
                              ),
                            }}
                          />
                        }
                        label="Email"
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.email && errors.email && (
                        <Typography color="error" variant="caption">
                          {errors.email}
                        </Typography>
                      )}
                      <FormControlLabel
                        control={
                          <Field
                            size="small"
                            as={TextField}
                            type={showpassword}
                            label="Password"
                            variant="outlined"
                            className="m-2"
                            name="password"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <Button
                                    onClick={() =>
                                      showpassword == "password"
                                        ? setShowPassword("text")
                                        : setShowPassword("password")
                                    }
                                    className="min-w-0 w-full p-0 text-gray-400"
                                    variant="text"
                                  >
                                    {showpassword == "password" ? (
                                      <FaEye className="cursor-pointer" />
                                    ) : (
                                      <FaEyeSlash className="cursor-pointer" />
                                    )}
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        }
                        label="Password"
                        className="flex mx-0 flex-col-reverse items-start my-2"
                      />
                      {touched.password && errors.password && (
                        <Typography color="error" variant="caption">
                          {errors.password}
                        </Typography>
                      )}

                      <Button
                        className="float-left self-start ml-2 bg-primary"
                        variant="contained"
                        disabled={!isValid}
                        type="submit"
                      >
                        Login
                      </Button>
                    </FormGroup>
                  </FormControl>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Grid>
      {toast.isOpen && (
        <Alert
          variant="filled"
          severity={toast.success ? "success" : "error"}
          className=" fixed top-5 right-5 "
          onClose={()=>{setToast((values)=>({ ...values,isOpen:false}))}}
        >
          {toast.text}
        </Alert>
      )}
    </Grid>
  );
};

export default Admin;
