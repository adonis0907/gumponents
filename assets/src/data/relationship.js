/**
 * Data Store.
 */

import wp from 'wp';
import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';

const { registerStore } = wp.data;

const DEFAULT_STATE = {
	posts: [],
	taxonomies: [],
};

const { apiFetch } = wp;

const actions = {

	setPosts( posts ) {
		return {
			type: 'SET_POSTS',
			items: posts,
		};
	},

	getPosts( postIds, postTypes ) {
		return {
			type: 'GET_POSTS',
			ids: postIds,
			postTypes,
		};
	},

	setTaxonomies( taxonomies ) {
		return {
			type: 'SET_TAXONOMIES',
			items: taxonomies,
		};
	},

	getTaxonomies( postIds ) {
		return {
			type: 'GET_TAXONOMIES',
			ids: postIds,
		};
	},

};

registerStore( 'gumponents/relationship', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_POSTS':
				return {
					...state,
					posts: unionWith( state.posts, action.items, isEqual ),
				};
			case 'SET_TAXONOMIES':
				return {
					...state,
					taxonomies: unionWith( state.taxonomies, action.items, isEqual ),
				};
		}
		return state;
	},

	actions,

	selectors: {

		getPosts( state, ids ) {
			const posts = [];
			ids.forEach( ( id ) => {
				const post = state.posts.find( ( post ) => post.id === id );
				if ( post ) {
					posts.push( post );
				}
			} );
			return posts;
		},

		getTaxonomies( state, ids ) {
			const taxonomies = [];
			ids.forEach( ( id ) => {
				const taxonomy = state.taxonomies.find( ( taxonomy ) => taxonomy.id === id );
				if ( taxonomy ) {
					taxonomies.push( taxonomy );
				}
			} );
			return taxonomies;
		},

	},

	controls: {
		GET_POSTS( { ids, postTypes } ) {
			if ( 'string' === typeof postTypes ) {
				postTypes = [ postTypes ];
			}

			return apiFetch( {
				path: '/gumponents/relationship/v1/posts/initialize',
				data: {
					type: 'post',
					items: ids,
					post_types: postTypes,
				},
				method: 'post',
			} );
		},

		GET_TAXONOMIES( { ids } ) {
			return apiFetch( {
				path: '/gumponents/relationship/v1/taxonomies/initialize',
				data: {
					items: ids,
				},
				method: 'post',
			} );
		},
	},

	resolvers: {
		* getPosts( ids, postTypes ) {
			if ( 0 === ids.length ) {
				return;
			}
			const posts = yield actions.getPosts( ids, postTypes );
			return actions.setPosts( posts );
		},

		* getTaxonomies( ids ) {
			if ( 0 === ids.length ) {
				return;
			}
			const taxonomies = yield actions.getTaxonomies( ids );
			return actions.setTaxonomies( taxonomies );
		},
	},
} );
