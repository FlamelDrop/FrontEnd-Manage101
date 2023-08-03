/* eslint-disable import/prefer-default-export */
import { applyMiddleware, createStore, compose, AnyAction, Store } from 'redux';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import crypto from 'src/services/crypto';
import rootReducer, { rootPersist, authPersist } from './root.reducer';
import storage from 'redux-persist/lib/storage'; // import { AsyncStorage as storage} from 'react-native'
import createSaga from 'redux-saga';
import rootSaga from './root.saga';

// Encrypt
const cryptoTransform = createTransform(
  (ibs) => {
    return ibs ? crypto.encrypt(JSON.stringify(ibs)) : ibs;
  },
  (obs) => {
    return obs ? JSON.parse(crypto.decrypt(`${obs}`)) : obs;
  },
  { whitelist: authPersist },
);

// PersistConfig
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: rootPersist,
  transforms: [cryptoTransform],
};

// Saga
const sagaMidleware = createSaga();

// https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMidleware));

// store
export const store: Store<any, AnyAction> = createStore(persistReducer(rootPersistConfig, rootReducer), enhancer);

// persistStore
export const persistor = persistStore(store);

// Kick off the root saga
sagaMidleware.run(rootSaga);
