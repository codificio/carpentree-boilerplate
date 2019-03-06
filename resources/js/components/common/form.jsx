import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Password from "./password";
import CheckBox from "./checkBox";
import Select from "./select";
import SelectMaterial from "@material-ui/core/Select";
import InputMaterial from "@material-ui/core/Input";
import Datetime from "./datetime";
import Button from "@material-ui/core/Button";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ReactQuill from "react-quill";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

class Form extends Component {
    state = {
        data: {},
        errors: {},
        selectCheckBoxesOpen: false
    };

    // Funzione che valida il form servendosi dello schema qui sotto definito con la libreria Joi
    validate = () => {
        // Chiedo a Joi di validare l'oggetto data in base allo schema di vincoli
        const options = { abortEarly: false }; // Questa mettila sempre e fregatene
        const { error } = Joi.validate(this.state.data, this.schema, options);
        // Se il risultato non da errori esco con null
        if (!error) return null;

        // Ora ciclo un array del risultato di Joi che si trova dentro error.eror.details
        // E riempio l'array errors con il nome del campo che trovo dentro path[0] ed il relativo messaggio dallo schema che trovo dentro item.message
        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    // Questo medoto valida il simgolo campo
    validateProperty = ({ name, value }) => {
        if (name !== undefined) {
            // Creo un oggetto che contenga il solo campo da validare con il suo valore
            const obj = { [name]: value };

            // Creo uno schema che contenga il solo campo da validare
            const schema = { [name]: this.schema[name] };

            // Valido l'oggetto. In questo caso non metto opzioni abortEarly perchè defidero che abortisca presto
            const { error } = Joi.validate(obj, schema, {});
            return error ? error.details[0].message : null;
        }
    };

    // Questa handle tratta il submit
    handleSubmit = e => {
        // Evitiamo il caricamento spontaneo della pagina del classico onSubmit dei form html
        e.preventDefault();

        // Validazione del form
        const errors = this.validate();
        // Importante ad errors metto errors solo se esistono errori altrimento metto un oggetto vuoto
        // Se non faccio questo va in errore il form
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.doSubmit();
    };

    handleCheckBoxChange = ({ currentTarget: item }, checked) => {
        const itemToValidate = { name: item.name, value: checked };
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(itemToValidate);
        if (errorMessage) errors[itemToValidate.name] = errorMessage;
        else delete errors[itemToValidate.name];

        const data = { ...this.state.data };
        data[itemToValidate.name] = itemToValidate.value;
        this.setState({ data, errors });
    };

    // Questa handle aggiorna il teso dell'input dato dallo state e lo scrive dentro l'input
    handleChange = ({ currentTarget: item }) => {
        // Qui implemeto la validazione del campo durante la digitazione
        // Se item.id non esiste è perchè sono su una SELECT Material che non restituisce il nome
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(item);
        if (errorMessage) errors[item.id] = errorMessage;
        else delete errors[item.id];

        const data = { ...this.state.data };
        data[item.id] = item.value;

        this.setState({ data, errors });
    };

    handleSpecialControlsChange = e => {
        const errors = { ...this.state.errors };
        const data = { ...this.state.data };
        data[e.target.name] = e.target.value;
        this.setState({ data, errors });
    };

    // A parte il label per il resto il login button è interamente riutilizzabile quindi lo metto qui dentro
    renderSubmitButton(label, defaultValidated = false, pull = "", width = "") {
        return (
            <Button
                variant="contained"
                size="medium"
                color="primary"
                disabled={this.validate() != null && !defaultValidated}
                className={pull}
                onClick={this.doSubmit}
            >
                {label}
            </Button>
        );
    }

    renderButton(label, color, size, className = "", handle) {
        return (
            <Button
                variant="outlined"
                size={size}
                color={color}
                className={className + " ml-3"}
                onClick={handle}
            >
                {label}
            </Button>
        );
    }

    renderCancelButton(label, defaultValidated = false, pull = "") {
        return (
            <Button
                variant="contained"
                size="medium"
                color="default"
                disabled={this.validate() != null && !defaultValidated}
                className={pull}
                onClick={this.handleCancel}
            >
                {label}
            </Button>
        );
    }

    renderQuill(name, label) {
        const { data, errors } = this.state;

        return (
            <div className="py-2">
                <Typography
                    variant="subheading"
                    color="textSecondary"
                    gutterBottom
                >
                    {label}
                </Typography>
                <div
                    className="mt-2 p-4"
                    style={{ backgroundColor: "#fafafa" }}
                >
                    <div className="bg-white">
                        <ReactQuill
                            theme="snow"
                            value={data[name]}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderSelectCheckBoxes(name, label, options) {
        const { data, errors } = this.state;
        return (
            <div className="py-2">
                <Typography
                    variant="subheading"
                    color="textSecondary"
                    gutterBottom
                >
                    {label}
                </Typography>
                <div
                    className="mt-2 p-4"
                    style={{ backgroundColor: "#fafafa" }}
                >
                    <Button
                        variant="outlined"
                        color="default"
                        title="edita"
                        onClick={this.handleSelectCheckBoxesOpenClose}
                    >
                        <PlaylistAddCheckIcon />
                    </Button>
                    <Dialog
                        disableBackdropClick
                        disableEscapeKeyDown
                        open={this.state.selectCheckBoxesOpen}
                    >
                        <DialogTitle>{label}</DialogTitle>
                        <DialogContent style={{ width: "600px" }}>
                            <form>
                                <FormControl>
                                    <InputLabel htmlFor="select-multiple-checkbox">
                                        {label}
                                    </InputLabel>
                                    <SelectMaterial
                                        style={{ width: "555px" }}
                                        multiple
                                        value={data[name]}
                                        onChange={this.handleChange}
                                        input={
                                            <InputMaterial id="select-multiple-checkbox" />
                                        }
                                        renderValue={selected =>
                                            selected.join(", ")
                                        }
                                        MenuProps={MenuProps}
                                    >
                                        {options.map(option => (
                                            <MenuItem
                                                key={option.id}
                                                value={option.id}
                                            >
                                                <Checkbox
                                                    style={{
                                                        marginLeft:
                                                            option.level * 20
                                                    }}
                                                    checked={
                                                        data[name].indexOf(
                                                            option.id
                                                        ) > -1
                                                    }
                                                />
                                                <ListItemText
                                                    primary={option.name}
                                                />
                                            </MenuItem>
                                        ))}
                                    </SelectMaterial>
                                </FormControl>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.handleSelectCheckBoxesOpenClose}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={this.handleSelectCheckBoxesOpenClose}
                                color="primary"
                            >
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }

    renderSelect(name, label, options, multiple) {
        const { data, errors } = this.state;
        return (
            <Select
                name={name}
                value={data[name]}
                label={label}
                options={options}
                multiple={multiple === "multiple"}
                onChange={this.handleSpecialControlsChange}
                error={errors[name]}
            />
        );
    }

    renderInput(name, label, type, errorDisabled = false) {
        const { data, errors } = this.state;

        return (
            <Input
                type={type}
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
                errorDisabled={errorDisabled}
            />
        );
    }

    renderPassword(name, label) {
        const { data, errors } = this.state;

        return (
            <Password
                type="password"
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderCheckBox(name, label) {
        const { data, errors } = this.state;
        return (
            <CheckBox
                name={name}
                label={label}
                onChange={this.handleCheckBoxChange}
                error={errors[name]}
            >
                {label}
            </CheckBox>
        );
    }

    renderDateTime(name, label, type, errorDisabled) {
        const { data, errors } = this.state;
        return (
            <Datetime
                id={name}
                name={name}
                label={label}
                onChange={this.handleSpecialControlsChange}
            />
        );
    }
}

export default Form;
