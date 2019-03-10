import React, { Component } from "react";
import Form from "../common/form";
import { locale } from "../../config.json";
import { ToastContainer, toast } from "react-toastify";
import { getItems, setItem } from "../../services/collectionServices";
import { assignCategoriesPaths } from "../../utils/functions";
import FileBrowser, { Icons } from "react-keyed-file-browser";
import slugify from "react-slugify";

class Categories extends Form {
    state = {
        data: [],
        errors: [],
        files: []
    };

    async componentDidMount() {
        const data = await getItems("categories/articles");
        console.log("data", data);
        let categoriesIn = data.data;
        let categoriesOut = [];
        assignCategoriesPaths(categoriesIn, categoriesOut);
        let files = [...categoriesOut];
        this.setState({ files });
    }

    handleOnActionButtonClick = (item, actionButton) => {
        console.log(item, actionButton);
    };

    handleCreateFolder = async key => {
        console.log(key);

        const nodes = key.split("/");
        const newElementName = nodes[nodes.length - 2];
        nodes.pop();
        nodes.pop();
        const father = nodes.join("/") + "/";
        console.log("father", father);

        let newCategory = {};
        const { files } = this.state;
        Object.keys(files).forEach(j => {
            if (files[j].key === father) {
                newCategory.locale = locale;
                newCategory.attributes = {};
                newCategory.attributes.type = "categories";
                newCategory.attributes.slug = slugify(newElementName);
                newCategory.attributes.name = newElementName;
                newCategory.attributes.description = "";
                newCategory.relationships = {};
                newCategory.relationships.parent = {};
                newCategory.relationships.parent.data = {};
                newCategory.relationships.parent.data.id = files[j].id;
            }
        });

        try {
            await setItem("categories", newCategory);
        } catch (error) {
            console.log("error", error);
        }

        this.setState(state => {
            state.files = state.files.concat([
                {
                    key: key
                }
            ]);
            return state;
        });
    };

    handleRenameFolder = (oldKey, newKey) => {
        const newFiles = [];
        this.state.files.map(file => {
            if (file.key.substr(0, oldKey.length) === oldKey) {
                newFiles.push({
                    ...file,
                    key: file.key.replace(oldKey, newKey)
                });
            } else {
                newFiles.push(file);
            }
        });
        this.setState({ files: newFiles });
    };

    handleDeleteFolder = folderKey => {
        this.setState(state => {
            const newFiles = [];
            state.files.map(file => {
                if (file.key.substr(0, folderKey.length) !== folderKey) {
                    newFiles.push(file);
                }
            });
            state.files = newFiles;
            return state;
        });
    };

    render() {
        const { files } = this.state;

        return (
            <form onSubmit={this.handleSubmit} className="pb-5">
                <div className="row l">
                    <div className="col-12 px-5 pt-4 ml-3">
                        <ToastContainer />
                        <h6 className="mt-4 mb-1 text-secondary">home / categorie</h6>
                        <h4 className="mb-4">Gestione categorie</h4>
                    </div>
                    <div className="col-12 px-5 pt-4 ml-0">
                        <FileBrowser
                            files={files}
                            icons={Icons.FontAwesome(4)}
                            onCreateFolder={this.handleCreateFolder}
                            onCreateFiles={this.handleCreateFiles}
                            onMoveFolder={this.handleRenameFolder}
                            onRenameFolder={this.handleRenameFolder}
                            onDeleteFolder={this.handleDeleteFolder}
                        />
                    </div>
                </div>
            </form>
        );
    }
}

export default Categories;
