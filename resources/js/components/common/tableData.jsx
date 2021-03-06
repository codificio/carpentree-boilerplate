import React, { Component } from "react";
import Pagination from "../common/pagination";
import SearchBox from "../common/searchBox";
import { MsgYesNo } from "../common/dialogs";
import { getItems, deleteItem } from "../../services/collectionServices";
import Table from "../common/table";
import _ from "lodash";
import Typography from "@material-ui/core/Typography";
import { collectionsPageSize } from "../../config.json";
import SearchIcon from "@material-ui/icons/Search";
import Cloud from "@material-ui/icons/Cloud";
import Cached from "@material-ui/icons/Cached";
import SpinnerLoading from "../common/spinnerLoading";
import { ToastContainer, toast } from "react-toastify";

const msgYesNoData = {
    open: false,
    title: "",
    text: "",
    item: {}
};

class TableData extends Component {
    state = {
        pageTitle: "",
        collectionName: "",
        itemLabel: "",
        collection: {
            name: "???",
            currentPage: 1,
            sortColumn: { path: "id", order: "asc" },
            data: [],
            meta: {
                total: 0,
                per_page: collectionsPageSize
            }
        },
        pageLoading: true,
        searchQuery: "",
        columns: [],
        editedRecord: {},
        popperShows: {
            edit: true,
            delete: true
        },
        msgYesNoData
    };

    async componentDidMount() {
        const { searchQuery, collection } = this.state;
        const { columns, collectionName, pageTitle, itemLabel } = this.props;
        this.setState({ columns, collectionName, pageTitle, itemLabel });
        const filters = { ...collection, data: [], searchQuery };
        try {
            const collectionFiltered = await getItems(collectionName, filters);

            /* let collectionForTableData = {};
            collectionForTableData.data = [];
            for (let i = 0; i < collectionFiltered.data.length; i++) {
                const collectionItem = collectionFiltered.data[i];
                let tableDataItem = {};
                tableDataItem = { ...collectionItem.attributes };
                tableDataItem.id = collectionItem.id;
                tableDataItem.locale = collectionItem.locale;
                collectionForTableData.data.push(tableDataItem);
            }
            console.log("collectionForTableData", collectionForTableData);
            console.log("collectionFiltered", collectionFiltered);*/

            this.setState({
                collection: collectionFiltered,
                pageLoading: false
            });
        } catch (ex) {
            console.log(ex.response.data.errors.message);
            toast.error(ex.response.data.errors.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    }

    handleDelete = item => {
        this.setState({
            msgYesNoData: {
                open: true,
                title: "Eliminazione recprd",
                text: "Confermi l'eliminazione del record '" + item.name + "'?",
                item
            }
        });
    };

    handleMsgYesNoClickYes = async () => {
        const { path } = this.props;
        const { collection, msgYesNoData } = this.state;
        const item = msgYesNoData.item;
        const collectionUpdated = { ...collection };
        collectionUpdated.data = collectionUpdated.data.filter(i => i.id !== item.id);
        this.setState({ collection: collectionUpdated });
        this.setState({ msgYesNoData: { open: false } });
        await deleteItem(path, item.id);
    };

    handleMsgYesNoClickNo = () => {
        this.setState({ msgYesNoData: { open: false } });
    };

    handleEdit = editedRecord => {
        this.props.history.push("/" + this.props.collectionName + "/" + editedRecord.id);
    };

    handlePageChange = async currentPage => {
        const { collectionName } = this.state;
        const filters = { ...this.state.collection, data: [], currentPage };
        const collection = await getItems(collectionName, filters);
        this.setState({ collection });
    };

    handleSort = async sortColumn => {
        const { collectionName } = this.state;
        const filters = { ...this.state.collection, data: [], sortColumn };
        const collection = await getItems(collectionName, filters);
        this.setState({ collection });
    };

    handleSearch = async searchQuery => {
        const { collectionName } = this.state;
        const filters = { ...this.state.collection, data: [], searchQuery };
        const collection = await getItems(collectionName, filters);
        this.setState({ searchQuery });
        this.setState({ collection });
    };

    handleNew = () => {
        this.props.history.push("/" + this.state.collectionName + "/0");
    };

    render() {
        const { collection, pageTitle, itemLabel, pageLoading } = this.state;
        const { total: totalItems, per_page: pageSize, current_page: currentPage } = collection.meta;
        const { sortColumn } = collection;
        const { popperShows, searchQuery } = this.state;
        const { title, text, open } = this.state.msgYesNoData;

        return (
            <div>
                <ToastContainer />
                <MsgYesNo title={title} text={text} open={open} onMsgYesNoClickYes={this.handleMsgYesNoClickYes} onMsgYesNoClickNo={this.handleMsgYesNoClickNo} />
                <div className="col-12 pt-3">
                    <h2 className="text-secondary c">{pageTitle}</h2>
                </div>
                <div className="row bg-white px-3 py-3">
                    {!pageLoading && (
                        <div className="col-4">
                            <SearchBox value={searchQuery} onChange={this.handleSearch} />
                        </div>
                    )}
                    {!pageLoading && (
                        <div className="col-8">
                            <Typography variant="body1" gutterBottom align="right">
                                {totalItems} record visualizzati.
                            </Typography>
                        </div>
                    )}
                    {pageLoading && <SpinnerLoading />}
                    {collection.data.length === 0 && !pageLoading && (
                        <div className="col-12 c my-4 text-danger">
                            {searchQuery === "" ? <Cloud className="mr-2" /> : <SearchIcon className="mr-2" />}
                            {searchQuery === "" ? "Nessun record nel database..." : "Il filtro di ricerca impostato non ha restituito risultati..."}
                        </div>
                    )}
                    {collection.data.length > 0 && (
                        <div className="col-12">
                            <Table
                                data={collection.data}
                                sortColumn={sortColumn}
                                popperShows={popperShows}
                                onLike={this.handleLike}
                                onDelete={this.handleDelete}
                                onEdit={this.handleEdit}
                                onSort={this.handleSort}
                                columns={this.state.columns}
                            />
                            {totalItems && <Pagination itemsCount={totalItems} pageSize={pageSize} currentPage={currentPage} onPageChange={this.handlePageChange} />}
                        </div>
                    )}
                </div>
                {!pageLoading && (
                    <div className="col-12 c">
                        <hr />
                        <button className="btn btn-secondary" onClick={this.handleNew}>
                            {"Nuovo " + itemLabel}
                        </button>
                        <hr />
                    </div>
                )}
            </div>
        );
    }
}

export default TableData;
