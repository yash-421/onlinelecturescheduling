"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../shared/adminShared";
import { Typography, Grid, Card, CardContent, Box } from "@mui/material";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import axios from "axios";


const page = () => {

  const [count,setcount]=useState({instructors:0, courses:0})

  useEffect(() => {
    axios
      .post("https://onlinelectureschedulingserver.onrender.com" + "admin/dashboard", {})
      .then((data) => {
        console.log(data);
        setcount({instructors:data.data.instructors,courses:data.data.courses});
      });
  
  }, [])
  

  return (
    <AdminLayout title={""}>
      <div>
        <Typography
          variant="h4"
          className="mb-4 font-semibold filter"
          component="h1"
        >
          Dashboard
        </Typography>
        <Grid container spacing={3}>
         
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                className={` text-white bg-primary`}
              >
                <CardContent className=" flex items-center">
                  <MdOutlineProductionQuantityLimits className="mr-2 text-2xl" />
                  <Box component="div">
                    <Typography
                      className=" flex items-center"
                      variant="h6"
                      component="div"
                    >
                      Instructors
                    </Typography>
                    <Typography>Count: {count.instructors}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                className={` text-white bg-secondary`}
              >
                <CardContent className=" flex items-center">
                  <MdOutlineProductionQuantityLimits className="mr-2 text-2xl" />
                  <Box component="div">
                    <Typography
                      className=" flex items-center"
                      variant="h6"
                      component="div"
                    >
                      Courses
                    </Typography>
                    <Typography>Count: {count.courses}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
        </Grid>
      </div>
    </AdminLayout>
  );
};

export default page;
