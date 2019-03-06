import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getItems, getItem, setItem } from "../../services/collectionServices";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import SpinnerLoading from "../common/spinnerLoading";

const collectionFatherName = "blog";

const emptyArticle = {
    title: "",
    slug: "",
    body: "",
    excerpt: "",
    status: "",
    categories: []
};

const categoriesFake = [
    { id: 0, fatherId: 0, name: "SPORT" },
    { id: 1, fatherId: 0, name: "CUCINA" },
    { id: 2, fatherId: 1, name: "PRIMI" },
    { id: 3, fatherId: 2, name: "Spaghetti" },
    { id: 4, fatherId: 2, name: "Lasagne" },
    { id: 5, fatherId: 2, name: "Zuppe" },
    { id: 6, fatherId: 1, name: "SECONDI" },
    { id: 7, fatherId: 1, name: "CONTORNI" },
    { id: 8, fatherId: 0, name: "MUSICA" },
    { id: 9, fatherId: 8, name: "ROCK" },
    { id: 10, fatherId: 9, name: "PROGRESSIVE" },
    { id: 11, fatherId: 10, name: "Genesis" },
    { id: 12, fatherId: 10, name: "Yes" },
    { id: 13, fatherId: 10, name: "King Crimson" },
    { id: 14, fatherId: 9, name: "METAL" },
    { id: 15, fatherId: 14, name: "Metallica" },
    { id: 16, fatherId: 14, name: "Anthrax" },
    { id: 17, fatherId: 14, name: "Iron Maiden" },
    { id: 18, fatherId: 8, name: "REGGAE" },
    { id: 19, fatherId: 18, name: "Bob Marley" }
];

class UserForm extends Form {
    state = {
        data: { ...emptyArticle },
        errors: {},
        statuses: [],
        categories: [],
        loading: false,
        submitButtonLabel: "",
        selectCheckBoxesOpen: false
    };

    schema = {
        title: Joi.string()
            .required()
            .label("Titolo"),
        slug: Joi.string()
            .required()
            .label("Slug"),
        body: Joi.string()
            .required()
            .label("Testi"),
        excerpt: Joi.string()
            .required()
            .label("Estratto del testo"),
        status: Joi.string()
            .required()
            .label("Stato"),
        categories: Joi.array()
            .required()
            .label("Categorie")
    };

    indentCategories(startCategories) {
        if (startCategories == undefined) {
            return;
        }
        try {
            let categories = [...startCategories];
            categories.map((category, i) => {
                categories[i].level = -1;
            });
            categories.map((category, i) => {
                if (category.fatherId == 0) {
                    categories[i].level = 0;
                } else {
                    let a = categories[category.fatherId].level + 1;
                    categories[i].level = a;
                }
            });
            this.setState({ categories });
        } catch (error) {}
    }

    async componentDidMount() {
        // Recupero stati
        this.setState({
            statuses: [{ id: 0, name: "DRAFT" }, { id: 1, name: "PUBLISHED" }]
        });

        // Recupero le categorie
        this.indentCategories(categoriesFake);
        /* const data = await getItems("categories");
        const categories = data.data;
        this.setState({ categories });*/

        // Recupero l'utente
        if (this.props.match.params.id > 0) {
            const data = await getItem(
                collectionFatherName,
                this.props.match.params.id
            );
            data = user.data.attributes;
            data.id = user.data.id;
            data.locale = user.data.locale;
            //data.lucky_number = getMetaValue(user.data, "lucky_number");

            data.categories = [];
            for (
                let i = 0;
                i < user.data.relationships.categories.data.length;
                i++
            ) {
                data.categories.push(
                    user.data.relationships.categories.data[i].id
                );
            }
            this.setState({
                data,
                loading: false,
                submitButtonLabel: "Salva modifiche all'articolo"
            });
        } else {
            this.setState({ submitButtonLabel: "Salva nuovo articolo" });
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

    doSubmit = async () => {
        this.setState({ loading: true });
        const { data } = this.state;
        let dataToSend = {};
        dataToSend.id = data.id;
        dataToSend.locale = data.locale;

        // Attributes
        dataToSend.attributes = { ...data };

        // Relationships
        dataToSend.relationships = {};

        // Meta
        dataToSend.relationships.meta = {};
        dataToSend.relationships.meta.data = [];
        /*dataToSend.relationships.meta.data.push({
        attributes: { key: "lucky_number", value: data.lucky_number }
      });*/

        // Roles
        dataToSend.relationships.roles = {};
        dataToSend.relationships.roles.data = [];
        for (let i = 0; i < data.roles.length; i++) {
            dataToSend.relationships.roles.data.push({ id: data.roles[i] });
        }

        try {
            await setItem(collectionFatherName, dataToSend);
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
            console.log("e", error.response.status);
            toast.error(
                "Errore salvataggio dati. Verifica i dati inseriti, riprova o contatta l'assistenza",
                { position: toast.POSITION.BOTTOM_CENTER }
            );
        }
    };

    render() {
        const {
            data,
            statuses,
            categories,
            loading,
            submitButtonLabel,
            selectCheckBoxesOpen
        } = this.state;
        return (
            <div className="row c">
                <div className="col-12">
                    <ToastContainer />
                    <h1 className="mb-4 text-secondary">
                        {data.id == 0 ? "Nuovo articolo" : "Modifica articolo"}
                    </h1>
                </div>
                {loading && <SpinnerLoading />}
                {!loading && (
                    <div className="col-12 bg-white p-5">
                        <div className="row m-0">
                            <div className="col-12 l">
                                <form
                                    onSubmit={this.handleSubmit}
                                    className="pb-5"
                                >
                                    <div className="row m-0">
                                        <div className="col-12">
                                            {this.renderInput(
                                                "title",
                                                "Titolo"
                                            )}
                                        </div>
                                        <div className="col-12">
                                            {this.renderInput("slug", "* Slug")}
                                        </div>
                                        <div className="col-12">
                                            {this.renderQuill("body", "Testo")}
                                        </div>
                                        <div className="col-12">
                                            {this.renderQuill(
                                                "excerpt",
                                                "Estratto del testo"
                                            )}
                                        </div>
                                        <div className="col-12">
                                            {this.renderSelect(
                                                "status",
                                                "Stato",
                                                statuses,
                                                "single"
                                            )}
                                        </div>
                                        <div className="col-12">
                                            {this.renderSelectCheckBoxes(
                                                "categories",
                                                "Categorie",
                                                categories
                                            )}
                                        </div>
                                        <div className="col-12 mt-5">
                                            {this.renderSubmitButton(
                                                submitButtonLabel,
                                                true,
                                                "float-left"
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default UserForm;
