import Moment from "moment";
import setValue from "set-value";
import { SSL_OP_NETSCAPE_CHALLENGE_BUG } from "constants";
Moment.locale("it");

export function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export function getProgressCompleted(loaded, total) {
    return Math.round((loaded / total) * 100);
}

export function dateTimeToDate(originalDate) {
    let date = new Date(originalDate);
    date = Moment(date).format("DD MMM Y");
    if (date == "Invalid date") {
        date = "";
    }
    return date;
}

export function httpHeaders() {
    var token = localStorage.getItem("token");
    var config = {
        headers: { Authorization: "Bearer " + token }
    };
    return config;
}

export function getMetaValue(data, key) {
    if (!data.relationships.meta.data) {
        return "";
    }
    for (let i = 0; i < data.relationships.meta.data.length; i++) {
        if (data.relationships.meta.data[i].attributes.key == key) {
            return data.relationships.meta.data[i].attributes.value;
            break;
        }
    }
    return "";
}

export function CL(a, b, c, d, e, f) {
    console.log(a, b, c, d, e, f);
}

/*export function assignObjectPaths(objIn, objOut, stack) {
    if (objIn == undefined) {
        return [];
    }
    Object.keys(objIn).forEach(k => {
        const node = objIn[k];
        let obj = {};
        obj.id = node.id;
        obj.label = node.attributes.name;
        obj.path = stack;
        if (node.relationships.parent == null) {
            objOut.push(obj);
        } else {
            Object.keys(objOut).forEach(j => {
                if (objOut[j].id == node.relationships.parent.data.id) {
                    if (typeof objOut[j].children === "undefined") {
                        objOut[j].children = [];
                    }
                    objOut[j].children.push(obj);
                }
            });
        }
    });
}*/

export function assignObjectPaths(objIn, objOut) {
    if (objIn == undefined) {
        return [];
    }

    Object.keys(objIn).forEach(k => {
        const node = objIn[k];
        let obj = {};
        obj.id = node.id;
        obj.label = node.attributes.name;
        obj.path = 0;
        if (node.relationships.parent == null) {
            objOut[k] = obj;
            //console.log("Path", obj.path);
        } else {
            Object.keys(objOut).forEach(j => {
                if (objOut[j].id == node.relationships.parent.data.id) {
                    if (typeof objOut[j].children === "undefined") {
                        objOut[j].children = [];
                    }
                    obj.path = j + ".children." + +Object.keys(objOut[j].children).length;
                    //console.log("Path", obj.path);
                    setValue(objOut, obj.path, obj);
                } else {
                    if (typeof objOut[j].children !== "undefined") {
                        Object.keys(objOut[j].children).forEach(i => {
                            if (objOut[j].children[i].id == node.relationships.parent.data.id) {
                                if (typeof objOut[j].children[i].children === "undefined") {
                                    objOut[j].children[i].children = [];
                                }
                                obj.path = j + ".children." + i + ".children." + Object.keys(objOut[j].children[i].children).length;
                                //console.log("Path", obj.path);
                                setValue(objOut, obj.path, obj);
                            } else {
                                if (typeof objOut[j].children[i].children !== "undefined") {
                                    Object.keys(objOut[j].children[i].children).forEach(s => {
                                        if (objOut[j].children[i].children[s].id == node.relationships.parent.data.id) {
                                            if (typeof objOut[j].children[i].children[s].children === "undefined") {
                                                objOut[j].children[i].children[s].children = [];
                                            }
                                            obj.path = j + ".children." + i + ".children." + s + ".children." + Object.keys(objOut[j].children[i].children[s].children).length;
                                            //console.log("Path", obj.path);
                                            setValue(objOut, obj.path, obj);
                                        } else {
                                            if (typeof objOut[j].children[i].children[s].children !== "undefined") {
                                                Object.keys(objOut[j].children[i].children[s].children).forEach(t => {
                                                    if (objOut[j].children[i].children[s].children[t].id == node.relationships.parent.data.id) {
                                                        if (typeof objOut[j].children[i].children[s].children[t].children === "undefined") {
                                                            objOut[j].children[i].children[s].children[t].children = [];
                                                        }
                                                        obj.path =
                                                            j +
                                                            ".children." +
                                                            i +
                                                            ".children." +
                                                            s +
                                                            ".children." +
                                                            t +
                                                            ".children." +
                                                            Object.keys(objOut[j].children[i].children[s].children[t].children).length;
                                                        // console.log("Path", obj.path);
                                                        setValue(objOut, obj.path, obj);
                                                    } else {
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}

export function goAssignObjectPaths(obj, stack) {
    Object.keys(obj).forEach(k => {
        const node = obj[k];
        if (typeof node === "object") {
            node.path = stack ? `${"children"}.${k}` : k;
            assignObjectPaths(node, node.path);
        }
    });
}
