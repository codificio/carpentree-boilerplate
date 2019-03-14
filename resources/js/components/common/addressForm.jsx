import React from "react";
import Joi from "joi-browser";
import Form from "./form";
import { getItems, getItem, setItem } from "../../services/collectionServices";
import { ToastContainer, toast } from "react-toastify";
import { transformDataReactToLaravel } from "../../utils/functions";

const collectionFatherName = "addresses";

class AddressForm extends Form {
    state = {
        data: {
            id: 0,
            types: [],
            referent_name: "",
            company_name: "",
            address: "",
            street_number: "",
            postal_code: "",
            city: ""
        },
        errors: [],
        addressTypes: [],
        loading: false
    };

    componentDidMount = () => {
        const addressTypes = [
            { id: 0, type: "types", attributes: { name: "House" } },
            { id: 1, type: "types", attributes: { name: "Business" } },
            { id: 2, type: "types", attributes: { name: "Shipping" } },
            { id: 3, type: "types", attributes: { name: "Billing" } }
        ];
        this.setState({ addressTypes });
        console.log("types", this.state.addressTypes);
    };

    schema = {
        id: Joi.number(),
        referent_name: Joi.string()
            .required()
            .label("Nome referente"),
        company_name: Joi.string()
            .required()
            .label("Presso c/o"),
        address: Joi.string()
            .required()
            .label("Indirizzo"),
        street_number: Joi.string()
            .required()
            .label("Civico"),
        postal_code: Joi.string()
            .required()
            .label("C.A.P."),
        city: Joi.string()
            .required()
            .label("Comune"),
        types: Joi.array()
            .required()
            .label("Tipi")
    };

    doSubmit = async () => {
        const errors = this.validate();
        console.log(errors);
        this.setState({ errors: errors || {} });
        if (errors) {
            toast.error("Sono stati riscontrati degli errori di compilazione", {
                position: toast.POSITION.BOTTOM_CENTER
            });
            return;
        }

        this.setState({ loading: true });

        const { data } = this.state;
        const dataToSend = transformDataReactToLaravel(data);

        try {
            const setItemSucceded = await setItem(collectionFatherName, dataToSend);
            this.setState({ loading: false });
            if (setItemSucceded) {
                let toastMessage = "Dati aggiornati con successo";
                if (data.id == 0) {
                    toastMessage = "Elemento creato con successo";
                }
                toast.success(toastMessage, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
                this.props.history.push("/user:" + this.props.location.state.user.id);
            } else {
                toast.error("Errore salvataggio dati. Verifica i dati inseriti, riprova o contatta l'assistenza", { position: toast.POSITION.BOTTOM_CENTER });
            }
        } catch (error) {
            toast.error("Errore dal server. Verifica i dati inseriti, riprova o contatta l'assistenza", { position: toast.POSITION.BOTTOM_CENTER });
        }
    };

    render() {
        const { data, addressTypes } = this.state;
        const { user } = this.props.location.state;

        return (
            <div className="row l">
                <div className="col-12 px-5 pt-4 ml-3">
                    <ToastContainer />
                    <h6 className="mt-4 mb-1 text-secondary">home / utenti / indirizzi</h6>
                    <h4 className="mb-4">
                        {data.id == 0 ? "Nuovo indirizzo" : "Modifica indirizzo"}
                        {user.id > 0 && (
                            <a href={"/users/" + user.id} className="ml-2">
                                <strong>
                                    {user.first_name} {user.last_name}
                                </strong>
                            </a>
                        )}
                    </h4>
                </div>
                <div className="col-12 px-5">
                    <div className="row m-0">
                        <div className="col-6 l pr-4">
                            <form onSubmit={this.handleSubmit} className="pb-5">
                                <div className="row m-0 mt-2">
                                    <div className="col-12 pl-0">{this.renderSelect("types", "Tipi indirizzo", addressTypes, "multiple")}</div>
                                    <div className="col-12 pl-0">{this.renderInput("referent_name", "Nome referente")}</div>
                                    <div className="col-12 pl-0">{this.renderInput("company_name", "Presso c/o")}</div>
                                    <div className="col-12 pl-0">{this.renderInput("address", "Indirizzo")}</div>
                                    <div className="col-6  pl-0">{this.renderInput("street_number", "Civico")}</div>
                                    <div className="col-6">{this.renderInput("postal_code", "C.A.P.")}</div>
                                    <div className="col-12 pl-0">{this.renderInput("city", "Comune")}</div>
                                    <div className="col-12 pl-0 mt-4">{this.renderSubmitButton("Salva modifiche all'indirizzo", true, "float-left")}</div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddressForm;
