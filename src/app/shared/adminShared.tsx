import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaFolder, FaFolderOpen, FaUser } from "react-icons/fa";
import { GrWorkshop } from "react-icons/gr";
import { useRouter } from "next/navigation";

const AdminLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(290);
  const [isMobile, setIsMobile] = useState(false);
  const [type, setType] = useState("Admin");
  const router=useRouter()

  const navigateTo=(path:string)=>{
    router.push(path)
  }

  const isSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );
  useEffect(() => {
    setIsMobile(isSmScreen);
    setOpen(!isSmScreen);
  }, [isSmScreen]);

  useEffect(() => {
    sessionStorage.getItem("type") == "admin"
      ? setType("Admin")
      : setType("Instructor");
  });

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleToggleButtonClick = () => {
    setDrawerWidth((prevWidth) => (prevWidth === 0 ? 290 : 0));
  };

  const list = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <MdDashboard />,
      page: "dashboard",
    },
    {
      name: "Coures",
      link: "/admin/courses",
      icon: <FaFolder />,
      page: "category",
    },
    {
      name: "Instructor",
      link: "/admin/instructors",
      icon: <FaUser />,
      page: "subcategory",
    },
    {
      name: "Assign",
      link: "/admin/assign",
      icon: <FaUser />,
      page: "subcategory",
    },
  ];

  const drawer = (
    <div className="mt-[85px]">
      <div className="relative text-center">
        <img
          src="/admin.png"
          alt="adminlogo"
          className="border-4 rounded-full border-primary mx-auto w-[90px] "
        />
        <div className="badge absolute top-[70px] right-0 left-0 ">
          <span className="bg-primary p-0.5 px-1 shadow-2xl text-xxs rounded-lg text-white">
            {type}
          </span>
        </div>
      </div>
      <Typography
        variant="subtitle2"
        className="text-lg uppercase text-center my-5"
        component="h5"
      >
        {type} Dashboard{" "}
      </Typography>
      <Divider className=" border-[2px] bg-primary" />
      {type == "Admin" && (
        <List className="mt-2 p-5">
          {list.map((text, index) => (
            <ListItem
              key={index}
              disablePadding
              className=" hover:bg-secondary rounded-lg group "
              onClick={()=>navigateTo(text.link)}
            >
              <ListItemButton className="text-gray-600 text-xl  group-hover:text-white">
                <ListItemIcon className="group-hover:text-white">
                  {text.icon}
                </ListItemIcon>
                <ListItemText
                  primary={text.name}
                  primaryTypographyProps={{ className: " font-medium" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {
        type != "Admin" &&  (
          <List className="mt-2 p-5">
            <ListItem
              disablePadding
              className=" hover:bg-secondary rounded-lg group bg-primary "
            >
              <ListItemButton className="text-xl  text-white">
                <ListItemIcon className="text-white">
                  {<GrWorkshop /> }
                </ListItemIcon>
                <ListItemText
                  primary={"My Work"}
                  primaryTypographyProps={{ className: " font-medium" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )
      }

    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          height: "74px",
          zIndex: 10555,
        }}
        className="flex flex-row items-center justify-between"
      >
        <Toolbar className="w-[290px] flex justify-between items-center p-0 pl-2">
          <img
            src="/logo.png"
            className="object-contain h-[60px] w-32 "
            alt=""
          />
          {isMobile && (
            <Button
              size="small"
              className="text-3xl text-white"
              onClick={handleDrawerToggle}
            >
              <IoMenu />
            </Button>
          )}
          {!isMobile && (
            <Button
              size="small"
              className="text-3xl text-white"
              onClick={handleToggleButtonClick}
            >
              <IoMenu />
            </Button>
          )}
        </Toolbar>
        <Button variant="contained" className=" mr-5" onClick={()=>{sessionStorage.clear();navigateTo('/')}}  >
          {" "}
          <IoIosLogOut className="text-2xl mr-2" /> Log Out
        </Button>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
        className={`${
          isMobile ? "hidden" : "block"
        } transition-all duration-500 ease-linear`}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={open}
          onClose={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
        marginTop={"85px"}
        className="p-10"
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
