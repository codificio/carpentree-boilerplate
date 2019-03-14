import http from "./httpService";
import { apiUrl, locale } from "../config.json";
import { httpHeaders } from "../utils/functions";
import { toast } from "react-toastify";

const apiUrlAdmin = apiUrl + "/api/admin/";

const emptyFilters = {
    currentPage: 1,
    sortColumn: { path: "id", order: "asc" }
};

export async function getItems(collectionName, filters) {
    const userEndpoint = apiUrlAdmin + collectionName;
    let url = userEndpoint + "?locale=" + locale;
    if (filters) {
        const { currentPage, searchQuery } = filters;
        const { path, order } = filters.sortColumn;
        let sort = path;
        if (order == "desc") {
            sort = "-" + sort;
        }
        let url = userEndpoint + "?page=" + currentPage + "&sort=" + sort + "&locale=" + locale;
        if (searchQuery) {
            url += "&filter[query]=" + searchQuery;
        }
    }
    try {
        const { data } = await http.get(url, httpHeaders());
        let dataToReturn = { ...data };
        if (typeof dataToReturn === "undefined" || typeof dataToReturn.data === "undefined") {
            throw new Exception();
        }
        if (filters) {
            dataToReturn.sortColumn = filters.sortColumn;
        }
        return dataToReturn;
    } catch (error) {
        toast.error("Errore nel recuperare la lista [" + collectionName + "]. Ricaricare la pagina o contattare l'assistenza", { position: toast.POSITION.BOTTOM_CENTER });
        return { data: [] };
    }
}

export async function setItem(path, data) {
    const userEndpoint = apiUrlAdmin + path;
    try {
        if (data.id > 0) {
            await http.patch(userEndpoint, data, httpHeaders());
        } else {
            await http.post(userEndpoint, data, httpHeaders());
        }
        return true;
    } catch (error) {
        console.log("error setItem", error);
        return false;
    }
}

export async function getItem(path, id) {
    const userEndpoint = apiUrlAdmin + path;
    try {
        const { data } = await http.get(userEndpoint + "/" + id + "?locale=" + locale, httpHeaders());
        //console.log("getItem - data", data);
        return data;
    } catch (error) {
        console.log("getItem error", error);
    }
}

export async function deleteItem(path, id) {
    const userEndpoint = apiUrlAdmin + path;
    try {
        const { data } = await http.delete(userEndpoint + "/" + id, httpHeaders());
        //  console.log("Data", data);
    } catch (error) {
        console.log("error", error);
    }
}
