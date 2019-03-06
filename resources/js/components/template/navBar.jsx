import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../../services/authService";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GroupIco from "@material-ui/icons/Group";
import FolderIcon from "@material-ui/icons/Folder";
import BlogIcon from "@material-ui/icons/SpeakerNotes";
import FaceIcon from "@material-ui/icons/Face";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import "../../App.css";

const navBarItems = [
    { label: "Utenti", path: "/users", icon: <GroupIco /> },
    { label: "Blog", path: "/blog", icon: <BlogIcon /> }
];

const NavLinkStyle = {
    textDecoration: "none"
};

class NavBar extends Component {
    state = {};

    componentDidMount() {}

    handleLogout() {
        console.log("logout");
        logout();
        window.location = "/login";
    }

    getSelectedItem = item => {
        const path = window.location.href.split("/").slice(-1)[0];
        return item.path === path;
    };

    render() {
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
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                            >
                                <Avatar
                                    onClick={this.handleLogout}
                                    alt="Remy Sharp"
                                    src={user.picture.data.url}
                                    className={classes.bigAvatar + " c-pointer"}
                                />
                            </Grid>
                        ) : (
                            <FaceIcon
                                onClick={this.handleLogout}
                                className="c-pointer"
                                tooltip="Logout"
                            />
                        )}
                    </div>
                    <div
                        className="mt-1 mb-4 c c-pointer"
                        onClick={this.handleLogout}
                    >
                        {user.first_name != undefined &&
                            user.first_name + " " + user.last_name}
                    </div>
                    <Divider />
                    <div className="p-4">
                        {navBarItems.map(item => (
                            <NavLink
                                to={item.path}
                                style={NavLinkStyle}
                                key={item.label}
                            >
                                <ListItem
                                    button
                                    selected={this.getSelectedItem(item)}
                                >
                                    <ListItemIcon className="m-0">
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        className="m-0"
                                        primary={item.label}
                                    />
                                </ListItem>
                            </NavLink>
                        ))}
                    </div>
                </List>
            </Drawer>
        );
    }
}

export default NavBar;
