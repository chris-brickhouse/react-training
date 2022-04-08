import React from 'react';

export default class WishList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoaded: false,
            wishList: []
        };
        this.childRef = React.createRef(null);
    }

    componentDidMount() {
        fetch("https://gacapp.net/api/wishlists")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isDataLoaded: true,
                        wishList: result
                    });
                    //localStorage.setItem("wishList", JSON.stringify(this.state.wishList));
                    console.log(this.state)
                },
                (error) => {
                    this.setState({
                        isDataLoaded: false,
                        error
                    });
                }
        )
        
    }

    handleCallback = (data) => {
        this.setState({ isDataLoaded: true, wishList: data.wishList });
    }

    addItem = () => {
        let newList = { id: 0, title: document.getElementById('newTitle').value, isComplete: false };
        this.updateItem(newList);
        document.getElementById('newTitle').value = '';
    };

    updateItem = (data) => {
        console.log(data)
        fetch('https://gacapp.net/api/wishlists/' + data.id, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            console.log("Request complete! response:", res);
            this.setState({ wishList: res, isDataLoaded: true });
        });
    };

    deleteItem = (data) => {
        fetch('https://gacapp.net/api/wishlists/delete/' + data.id)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        wishList: result,
                        isDataLoaded: true
                    });
                    //localStorage.setItem("wishList", JSON.stringify(this.state.wishList));
                },
                (error) => {
                    this.setState({
                        isDataLoaded: true,
                        error
                    });
                }
            );
    };

    render() {
        return (
            <div className="list-group mx-auto mt-3 text-start list-group-flush border">
                <div className="list-group-item list-group-item-dark text-dark fw-bold"><i className="fa-solid fa-list-check me-1"></i> My WishList - {this.state.wishList.length} items - {(this.state.wishList || []).filter(x => x.isComplete === true).length} completed</div>
                <div className="list-group-item bg-light">
                    <div className="row">
                        <div className="col">
                            <input id="newTitle" className="form-control" type="text" />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-dark" onClick={this.addItem}><i className="fa-solid fa-plus fa-fw me-1"></i> Add</button>
                        </div>
                    </div>
                </div>
                <div className="scrolling-list">
                    
                    {!this.state.isDataLoaded ? <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>: null}
                    {this.state.isDataLoaded ? <WishListItems updateItem={this.updateItem} wishList={this.state.wishList} deleteItem={this.deleteItem}></WishListItems> : null }
                </div>
            </div>
        )
    }
}

export class WishListItems extends React.Component {

    handleClick = (event) => {
        let item = this.props.wishList.filter(x => x.id === parseInt(event.target.value))[0];
        item.isComplete = event.target.checked;
        this.props.updateItem(item);
    }

    handleDelete = (id) => {
        this.props.deleteItem({ id: id });
    }

    render() {
        return (
            (this.props.wishList || []).map((list) =>
                <div key={list.id} className="list-group-item needs-hand list-group-item-action d-flex justify-content-between align-items-center" >
                    <label>
                        <input className="form-check-input me-3" type="checkbox" value={list.id} aria-label="..." onChange={this.handleClick} checked={list.isComplete} />
                        <span className={list.isComplete ? "text-decoration-line-through" : ""}>{list.title}</span>

                    </label>
                    <span onClick={() => this.handleDelete(list.id)}><i className="fa-solid fa-trash-can fa-fw"></i></span>
                </div>
            )
        )
    }
}
