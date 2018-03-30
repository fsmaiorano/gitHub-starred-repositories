import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as GithubActions } from 'store/ducks/github';

import './github.scss';

import doOrderBy from 'lodash/orderBy';

import api from 'shared/api/api';
import GithubRepository from './GithubRepository';
import { Input, FloatButton, OrderBy, IconButtons, Filter } from 'shared/template';

class Github extends Component {

    static propTypes = {
        github: PropTypes.shape({
            filter: PropTypes.string,
            orderBy: PropTypes.string,
            isLoading: PropTypes.bool,
            repositories: PropTypes.arrayOf(PropTypes.shape),
        }),
    }

    state = {
        sort: 'asc',
        username: '',
        activeFilter: '',
        activeOrderBy: '',
        listRepositories: [],
    }

    searchByUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    doSearch = async () => {
        const { username } = this.state;
        this.newSearch();
        if (username.length > 1)
            this.props.getStarredRepositoriesRequest(username);
    }

    newSearch = () => {
        this.props.setOrderBy("");
        this.props.setFilter("");
        this.setState({ activeFilter: "", activeOrderBy: "", listRepositories: [] });
    }

    applyFilter = (filter, orderBy, repositories) => {
        const filteredList = repositories.filter(f => f.language === filter);
        this.setState({ listRepositories: filteredList, activeFilter: filter });
        this.applyOrderBy(orderBy, filteredList);
    }

    applyOrderBy = (orderBy, repositories) => {
        const { sort } = this.state;
        const newSort = sort === 'asc' ? 'desc' : 'asc'
        const orderedList = orderBy !== "" ? doOrderBy(repositories, [repo => repo[`${orderBy}`.toLocaleLowerCase()]], [newSort]) : doOrderBy(repositories, [repo => repo.id], [newSort]);
        this.setState({ listRepositories: orderedList, activeOrderBy: orderBy, sort: newSort });
    }

    handleFilters = (orderBy, filter, repositories, listRepositories) => {
        const { activeFilter, activeOrderBy } = this.state;

        if (filter !== activeFilter) {
            const setFilter = filter !== "" ? filter : activeFilter;
            if (setFilter != "")
                this.applyFilter(setFilter, orderBy, repositories);
        }

        if (orderBy !== activeOrderBy) {
            const list = listRepositories.length > 0 ? listRepositories : repositories;
            const setOrderBy = orderBy !== "" ? orderBy : activeOrderBy;
            if (setOrderBy !== "")
                this.applyOrderBy(setOrderBy, list);
        }
    }

    doSort = () => {
        const { listRepositories, activeOrderBy } = this.state;
        const { repositories } = this.props;

        const showRepositories = listRepositories.length > 0 ? listRepositories : repositories;

        this.applyOrderBy(activeOrderBy, showRepositories);
    }

    render() {
        const { activeFilter, activeOrderBy, listRepositories } = this.state;
        const { repositories, filter, orderBy, languages, error } = this.props;

        if (activeFilter !== filter || activeOrderBy !== orderBy)
            this.handleFilters(orderBy, filter, repositories, listRepositories);

        const showRepositories = this.state.listRepositories.length > 0 ? this.state.listRepositories : repositories;


        return (
            <div>
                <div >
                    <Input onTyping={() => this.searchByUsername} label="Repository" type="text" />
                    <FloatButton color="primary" label="Search" icon="search" click={this.doSearch} />
                </div>
                {
                    error ? (
                        <div className="error-message">
                            <p>{error}&nbsp;<i class="material-icons">sentiment_dissatisfied</i></p>
                        </div>
                    ) :
                        (
                            <div>
                                <div>
                                    {
                                        showRepositories && showRepositories.length > 0 ? (
                                            <div>
                                                <OrderBy activeOrderBy={activeOrderBy}/>
                                                <Filter activeFilter={activeFilter} filters={languages} />
                                                <IconButtons click={this.doSort} />
                                            </div>) : ""
                                    }
                                </div>
                                <div className="container">
                                    {
                                        showRepositories && showRepositories.length > 0 && showRepositories.map(repo => (
                                            <GithubRepository key={repo.id} repository={repo} />
                                        ))
                                    }
                                </div>
                            </div>
                        )
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    error: state.github.error,
    filter: state.github.filter,
    orderBy: state.github.orderBy,
    languages: state.github.languages,
    repositories: state.github.repositories,
});

const mapDispatchToProps = dispatch => bindActionCreators(GithubActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Github);
