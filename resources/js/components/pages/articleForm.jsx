import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { getItems, getItem, setItem } from "../../services/collectionServices";
import { ToastContainer, toast } from "react-toastify";
import SpinnerLoading from "../common/spinnerLoading";
import slugify from "react-slugify";
import { assignObjectPaths } from "../../utils/functions";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Typography from "@material-ui/core/Typography";
import Input from "../common/input";

const collectionFatherName = "home";

const emptyArticle = {
    title: "",
    body: "",
    excerpt: "",
    status: ""
};

class ArticleForm extends Form {
    state = {
        data: { ...emptyArticle },
        errors: {},
        statuses: [],
        categories: [],
        categoriesSelected: [],
        loading: true,
        submitButtonLabel: "",
        selectCheckBoxesOpen: false
    };

    schema = {
        title: Joi.string()
            .required()
            .label("Titolo"),
        body: Joi.string()
            .required()
            .label("Testi"),
        excerpt: Joi.string()
            .required()
            .label("Estratto del testo"),
        status: Joi.string()
            .required()
            .label("Stato")
    };

    async componentDidMount() {
        // Recupero stati
        this.setState({
            statuses: [{ id: "draft", name: "DRAFT" }, { id: "published", name: "PUBLISHED" }]
        });

        // Recupero le categorie
        const data = await getItems("categories/articles");
        let categoriesIn = data.data;
        let categoriesOut = [];
        assignObjectPaths(categoriesIn, categoriesOut);
        this.setState({ categories: categoriesOut });

        // Recupero il record da editare
        if (this.props.match.params.id > 0) {
            let dbItem = await getItem("articles", this.props.match.params.id);
            let article = dbItem.data.attributes;
            article.id = dbItem.data.id;
            //data.locale = dbItem.data.locale;
            //data.lucky_number = getMetaValue(dbItem.data, "lucky_number");

            console.log("Article # " + this.props.match.params.id, article);

            this.setState({
                data: article,
                loading: false,
                submitButtonLabel: "Salva modifiche all'articolo"
            });
        } else {
            this.setState({ loading: false, submitButtonLabel: "Salva nuovo articolo" });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.state.categoriesSelected) != JSON.stringify(nextState.categoriesSelected)) {
            return false;
        } else {
            return true;
        }
    }

    handleCancel = () => {
        this.props.history.push("/" + collectionFatherName);
    };

    handleSelectCheckBoxesOpenClose = () => {
        let { selectCheckBoxesOpen } = this.state;
        selectCheckBoxesOpen = !selectCheckBoxesOpen;
        this.setState({ selectCheckBoxesOpen });
    };

    handleChangeQuillBody = value => {
        const data = { ...this.state.data };
        data.body = value;
        this.setState({ data });
    };

    handleChangeQuillExcerpt = value => {
        const data = { ...this.state.data };
        data.excerpt = value;
        this.setState({ data });
    };

    handleCreateNewCategory = () => {
        this.props.history.push("/categories");
        // window.location = "/categories";
    };

    handleMediaUploaded = () => {
        console.log("Uploaded");
    };

    doSubmit = async () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) {
            toast.error("Sono stati riscontrati degli errori di compilazione", {
                position: toast.POSITION.BOTTOM_CENTER
            });
            return;
        }

        this.setState({ loading: true });
        const data = { ...this.state.data };
        let dataToSend = {};
        dataToSend.id = data.id;

        // Attributes
        dataToSend.attributes = { ...data };
        dataToSend.attributes.slug = slugify(dataToSend.attributes.title);

        // Relationships
        dataToSend.relationships = {};

        // Categories
        dataToSend.relationships.categories = {};
        dataToSend.relationships.categories.data = [...this.state.categoriesSelected];

        // Meta
        dataToSend.relationships.meta = {};
        dataToSend.relationships.meta.data = [];
        /*dataToSend.relationships.meta.data.push({
        attributes: { key: "lucky_number", value: data.lucky_number }
      });*/

        try {
            await setItem("articles", dataToSend);
            let toastMessage = "Articolo aggiornato con successo";
            if (data.id == 0) {
                toastMessage = "Articolo creato con successo";
            }
            toast.success(toastMessage, {
                position: toast.POSITION.BOTTOM_CENTER
            });
            this.setState({ loading: false });
            //this.props.history.push("/" + collectionFatherName);
        } catch (error) {
            Object.keys(error.response.data.errors).forEach(function(key) {
                toast.error(key + ": " + error.response.data.errors[key][0], {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });
            toast.error("Errore salvataggio dati. Verifica i dati inseriti, riprova o contatta l'assistenza", { position: toast.POSITION.BOTTOM_CENTER });
        }
    };

    render() {
        const { data, statuses, categories, loading } = this.state;
        return (
            <div className="row l">
                <div className="col-12 px-5 pt-4 ml-3">
                    <ToastContainer />
                    <h6 className="mt-4 mb-1 text-secondary">home / blog</h6>
                    {loading && <h4 className="mb-4">Articolo</h4>}
                    {!loading && <h4 className="mb-4">{data.id == 0 ? "Nuovo articolo" : "Modifica articolo # " + data.id}</h4>}
                </div>
                {loading && <SpinnerLoading />}
                {!loading && (
                    <form onSubmit={this.handleSubmit} className="pb-5">
                        <div className="row">
                            <div className="col-xs-12 col-lg-6 px-5">
                                <div className="row m-0">
                                    <div className="col-12">{this.renderInput("title", "Titolo")}</div>
                                    <div className="col-12">
                                        <Input type="text" value={slugify(data.title)} label="Slug" />
                                    </div>
                                    <div className="col-12">{this.renderQuill("body", "Testo")}</div>
                                    <div className="col-12">{this.renderQuill("excerpt", "Estratto del testo")}</div>
                                    <div className="col-12">{this.renderMediaUploader("")}</div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-lg-6 px-5 borderLeftThiny">
                                <div className="row m-0">
                                    <div className="col-12">{this.renderSelect("status", "Stato", statuses, "single")}</div>
                                    <div className="col-12 ">
                                        <Typography className="mt-2" variant="subheading" color="textSecondary" gutterBottom>
                                            <span className="c-pointer float-right">
                                                aggiungi nuova categoria
                                                <AddBoxIcon onClick={this.handleCreateNewCategory} />
                                            </span>
                                        </Typography>
                                        {this.renderDropdownTreeSelect("categories", categories)}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-lg-12 pt-5 c">{this.renderSubmitButton("Salva modifiche alla'rticolo", true, "")}</div>
                        </div>
                    </form>
                )}
            </div>
        );
    }
}

export default ArticleForm;
