import React, { Component } from "react";
import Form from "../common/form";
import { locale } from "../../config.json";
import { ToastContainer, toast } from "react-toastify";
import { getItems, setItem, deleteItem } from "../../services/collectionServices";
import { assignCategoriesPaths } from "../../utils/functions";
import FileBrowser, { Icons } from "react-keyed-file-browser";
import slugify from "react-slugify";
import SpinnerLoading from "../common/spinnerLoading";

class Categories extends Form {
    state = {
        data: [],
        errors: [],
        files: []
    };

    async loadCategories() {
        const data = await getItems("categories/articles");
        let categoriesIn = data.data;
        let categoriesOut = [];
        assignCategoriesPaths(categoriesIn, categoriesOut);
        let files = [...categoriesOut];
        this.setState({ files, data: data.data });
        console.log("files", files, "data", data);
    }

    async componentDidMount() {
        this.loadCategories();
    }

    handleCreateFolder = key => {
        console.log("handleCreateFolder", key);
        const nodes = key.split("/");
        const newElementName = nodes[nodes.length - 2];
        nodes.pop();
        nodes.pop();
        const father = nodes.join("/") + "/";

        let newCategory = {};
        const { files } = this.state;
        Object.keys(files).forEach(j => {
            if (files[j].key === father) {
                newCategory.locale = locale;
                newCategory.attributes = {};
                newCategory.attributes.type = "articles";
                newCategory.attributes.slug = slugify(newElementName);
                newCategory.attributes.name = newElementName;
                newCategory.attributes.description = "";
                newCategory.relationships = {};
                newCategory.relationships.parent = {};
                newCategory.relationships.parent.data = {};
                newCategory.relationships.parent.data.id = files[j].id;
            }
        });

        this.writeNewCategory(newCategory);
    };

    async writeNewCategory(newCategory) {
        try {
            await setItem("categories", newCategory);
            this.loadCategories();
        } catch (error) {
            console.log("error", error);
        }
    }

    handleRenameFolder = async (oldKey, newKey) => {
        //console.log("handleRenameFolder", oldKey, newKey);

        // Per prima cosa cerco di capire se è un semplice rename o un move quindi risalgo ai PADRI delle due Key
        const vOld = oldKey.split("/");
        vOld.pop();
        vOld.pop();
        const vNew = newKey.split("/");
        vNew.pop();
        vNew.pop();

        // Ricostruisco l'oggetto da inviare al server
        let categorySource = this.getCategoryByKey(oldKey);
        let categoryUpdated = {};
        categoryUpdated.locale = locale;
        categoryUpdated.attributes = {};
        categoryUpdated.attributes.type = "articles";
        categoryUpdated.attributes.slug = slugify(categorySource.attributes.slug);
        categoryUpdated.attributes.name = categorySource.attributes.name;
        categoryUpdated.attributes.description = "";
        categoryUpdated.relationships = {};
        categoryUpdated.relationships.parent = {};
        categoryUpdated.relationships.parent.data = {};

        const newFiles = [];
        this.state.files.map(file => {
            if (file.key.substr(0, oldKey.length) === oldKey) {
                newFiles.push({
                    ...file,
                    key: file.key.replace(oldKey, newKey)
                });

                if (vOld.join("/") !== vNew.join("/")) {
                    // MOVE
                    console.log("CATEGORY TO MOVE", vNew.join("/") + "/");
                    let categoryFather = this.getCategoryByKey(vNew.join("/") + "/");
                    if (categoryFather === {}) {
                        categoryFather = null;
                    }
                    categoryUpdated.relationships.parent.data.id = categoryFather.id;
                } else {
                    // RENAME
                    const v = newKey.split("/");
                    categoryUpdated.attributes.name = v[v.length - 2];
                    categoryUpdated.relativeKey = slugify(v[v.length - 2]);
                }
            } else {
                newFiles.push(file);
            }
        });

        try {
            await setItem("categories", categoryUpdated);
        } catch (error) {
            console.log("error", error);
        }

        this.setState({ files: newFiles });
    };

    handleDeleteFolder = async folderKey => {
        //console.log("handleDeleteFolder", folderKey);
        let categoryToDelete = this.getCategoryByKey(folderKey);
        const newFiles = [];
        this.state.files.map(file => {
            if (file.key.substr(0, folderKey.length) !== folderKey) {
                newFiles.push(file);
            }
        });

        try {
            await deleteItem("categories", categoryToDelete.id);
        } catch (error) {
            console.log("error", error);
        }

        this.setState({ files: newFiles });
    };

    getCategoryByKey(key) {
        console.log("getCategoryByKey 1", key);
        const { data } = this.state;
        const { files } = this.state;
        let categoryId = 0;
        let category = {};
        Object.keys(files).forEach(j => {
            if (files[j].key === key) {
                categoryId = files[j].id;
            }
        });
        Object.keys(data).forEach(j => {
            if (data[j].id === categoryId) {
                category = { ...data[j] };
            }
        });
        return category;
    }

    render() {
        const { files } = this.state;

        return (
            <div className="row l">
                <div className="col-12 px-5 pt-4 ml-3">
                    <ToastContainer />
                    <h6 className="mt-4 mb-1 text-secondary">home / categorie</h6>
                    <h4 className="mb-4">Gestione categorie</h4>
                </div>
                <div className="col-12 px-5 pt-4 ml-0">
                    {files.length === 0 && <SpinnerLoading />}
                    {files.length > 0 && (
                        <FileBrowser
                            files={files}
                            icons={Icons.FontAwesome(4)}
                            onCreateFolder={this.handleCreateFolder}
                            onMoveFolder={this.handleCreateFolder}
                            onRenameFolder={this.handleRenameFolder}
                            onDeleteFolder={this.handleDeleteFolder}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Categories;
