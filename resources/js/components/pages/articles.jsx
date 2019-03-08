import React, { Component } from "react";
import TableData from "../common/tableData";

class Users extends Component {
    state = {
        columns: [
            { path: "title", label: "Titolo", align: "l", format: "text" },
            { path: "status", label: "Stato", align: "l", format: "text" }
        ],
        editedUser: {}
    };

    render() {
        const { columns } = this.state;
        const { history } = this.props;

        return (
            <TableData
                pageTitle="Articoli"
                collectionName="articles"
                path="articole"
                itemLabel="articolo"
                columns={columns}
                history={history}
            />
        );
    }
}

export default Users;
