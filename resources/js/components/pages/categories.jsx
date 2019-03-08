import React, { Component } from "react";
import Form from "../common/form";
import { ToastContainer, toast } from "react-toastify";
import { getItems, setItem } from "../../services/collectionServices";
import { assignObjectPaths } from "../../utils/functions";

class Categories extends Form {
    state = {
        data: [],
        errors: [],
        categories: [],
        categoriesDefault: []
    };

    async componentDidMount() {
        const data = await getItems("categories/articles");
        let categoriesIn = data.data;
        let categoriesOut = [];
        assignObjectPaths(categoriesIn, categoriesOut);
        let categories = [...categoriesOut];
        let categoriesDefault = [...categoriesOut];
        this.setState({ categories, categoriesDefault });
    }

    shouldComponentUpdate(nextProps, nextState) {
        /* console.log(JSON.stringify(this.state.categories));
        console.log(JSON.stringify(this.state.categoriesDefault));
        if (JSON.stringify(this.state.categories) != JSON.stringify(nextState.categories)) {
            if (JSON.stringify(this.state.categories) == JSON.stringify(this.state.categoriesDefault)) {
                return false;
            } else {
                return false;
            }
        } else {
            return true;
        }*/
        return false;
    }

    render() {
        const { categories, categoriesDefault } = this.state;

        return (
            <form onSubmit={this.handleSubmit} className="pb-5">
                <div className="row l">
                    <div className="col-12 px-5 pt-4 ml-3">
                        <ToastContainer />
                        <h6 className="mt-4 mb-1 text-secondary">home / categorie</h6>
                        <h4 className="mb-4">Gestione categorie</h4>
                    </div>
                    <div className="col-12 px-5 pt-4 ml-0">
                        <div className="col-12">{this.renderDropdownTreeSelect("categories", categories, false)}</div>
                    </div>
                </div>
            </form>
        );
    }
}

export default Categories;
