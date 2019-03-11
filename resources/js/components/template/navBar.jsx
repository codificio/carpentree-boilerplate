import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../../services/authService";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GroupIco from "@material-ui/icons/Group";
import TocIcon from "@material-ui/icons/Toc";
import GrainIcon from "@material-ui/icons/Grain";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import BlogIcon from "@material-ui/icons/SpeakerNotes";
import FaceIcon from "@material-ui/icons/Face";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import "../../App.css";

const navBarItems = [
    { label: "Utenti", path: "/users", icon: <GroupIco />, nestedItems: "" },
    {
        label: "Blog",
        path: "/blog",
        icon: <BlogIcon />,
        nestedItems: [
            <ListItem key="Articles" button>
                <ListItemIcon className="m-0">
                    <BlogIcon />
                </ListItemIcon>
                <ListItemText className="m-0" primary="Articles" />
            </ListItem>
        ]
    }
];

const NavLinkStyle = {
    textDecoration: "none"
};

class NavBar extends Component {
    state = {
        blogItemOpen: false
    };

    componentDidMount() {}

    handleLogout() {
        console.log("logout");
        logout();
        window.location = "/login";
    }

    handleClickBlogItem = () => {
        let { blogItemOpen } = this.state;
        blogItemOpen = !blogItemOpen;
        this.setState({ blogItemOpen });
        console.log(this.state);
    };

    getSelectedItem = item => {
        const path = window.location.href.split("/").slice(-1)[0];
        return item.path === path;
    };

    render() {
        const { blogItemOpen } = this.state;
        const { classes, user } = this.props;

        return (
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <List>
                    <div className="p-3 c">
                        <img src={require("../../logo.png")} className="w-25" />
                    </div>
                    <Divider />
                    <div className="mt-4 c">
                        {user.facebook === true && user.picture != undefined ? (
                            <Grid container justify="center" alignItems="center">
                                <Avatar onClick={this.handleLogout} alt="Remy Sharp" src={user.picture.data.url} className={classes.bigAvatar + " c-pointer"} />
                            </Grid>
                        ) : (
                            <FaceIcon onClick={this.handleLogout} className="c-pointer" tooltip="Logout" />
                        )}
                    </div>
                    <div className="mt-1 mb-4 c c-pointer" onClick={this.handleLogout}>
                        {user.first_name != undefined && user.first_name + " " + user.last_name}
                    </div>
                    <Divider />
                    <div className="p-4">
                        <NavLink to="/users" style={NavLinkStyle} key="Utenti" activeClassName="active">
                            <ListItem button onClick={this.handleClickBlogItem}>
                                <ListItemIcon className="m-0">
                                    <GroupIco />
                                </ListItemIcon>
                                <ListItemText className="m-0" primary="Utenti" />
                            </ListItem>
                        </NavLink>
                        <ListItem button onClick={this.handleClickBlogItem}>
                            <ListItemIcon className="m-0">
                                <BlogIcon />
                            </ListItemIcon>
                            <ListItemText primary="Blog" />
                            {blogItemOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={blogItemOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <NavLink to="/articles" style={NavLinkStyle} activeClassName="active">
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon className="m-0">
                                            <TocIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Articoli" />
                                    </ListItem>
                                </NavLink>
                                <NavLink to="/categories" style={NavLinkStyle} activeClassName="active">
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon className="m-0">
                                            <GrainIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Categorie" />
                                    </ListItem>
                                </NavLink>
                            </List>
                        </Collapse>
                    </div>
                </List>
            </Drawer>
        );
    }
}

export default NavBar;
