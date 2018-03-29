import { all, takeLatest } from 'redux-saga/effects';

import { Types as GithubTypes } from 'store/ducks/github';
import { getStarredRepositoriesRequest, setOrderBy, setFilter } from './github';

export default function* rootSaga() {
  return yield all([
    takeLatest(GithubTypes.GET_STARRED_REPOSITORIES, getStarredRepositoriesRequest),
    takeLatest(GithubTypes.SET_ORDERBY, setOrderBy),
    takeLatest(GithubTypes.SET_FILTER, setFilter),
  ]);
}
