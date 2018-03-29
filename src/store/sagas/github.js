import api from 'shared/api/api';
import { mapKeys } from 'lodash/mapKeys';
import { call, put, select } from 'redux-saga/effects';
import { Creators as GithubActions } from 'store/ducks/github';

export function* getStarredRepositoriesRequest(action) {
    try {
        const response = yield call(api.get, `/users/${action.payload.username}/starred`);

        const repositories = response.data.map(function (item) {
            return Object.assign({}, item, { name: item.name.toLowerCase() });
        });

        yield put(GithubActions.getStarredRepositoriesSuccess([...repositories]));
    } catch (error) {
        yield put(GithubActions.getStarredRepositoriesError('A error occurred on load the repository.'));
    }
};

export function* setOrderBy(action) {
    try {
        yield put(GithubActions.setOrderBySuccess(action.payload.orderBy));
    } catch (err) {
        yield put(GithubActions.setOrderByError('A error occurred on set order by.'));
    }
}

export function* setFilter(action) {
    try {
        yield put(GithubActions.setFilterSuccess(action.payload.filter));
    } catch (err) {
        yield put(GithubActions.setFilterError('A error occurred on set filter.'));
    }
}