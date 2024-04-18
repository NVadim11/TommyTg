import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { adminApi } from './services';
import { authApi } from './services/auth';
import { phpApi } from './services/phpService';

const root = combineReducers({
	// Add the generated reducer as a specific top-level slice
	[authApi.reducerPath]: authApi.reducer,
	[phpApi.reducerPath]: phpApi.reducer,
	[adminApi.reducerPath]: adminApi.reducer,
});

export const store = configureStore({
	reducer: root,
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat([
			authApi.middleware,
			phpApi.middleware,
			adminApi.middleware,
		]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
