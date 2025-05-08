import dotenv from 'dotenv'
dotenv.config()

import { makeAccessTokenFactory, Scope, ChatsApi, Configuration, Chat } from '../src'

/**
 * Example
 * 
 * fetch chats with different filters
 */

const run = async() => {
	const { REFRESH_TOKEN, TEAM_ID, ACCOUNT_ID } = process.env
	if(!REFRESH_TOKEN || !TEAM_ID || !ACCOUNT_ID) {
		throw new Error('refresh token or team id not specified')
	}

	const getAccessToken = makeAccessTokenFactory({
		request: {
			refreshToken: REFRESH_TOKEN,
			// get access to read chats
			scopes: [Scope.ChatsAccessAll]
		}
	})

	const { token: accessToken } = await getAccessToken(TEAM_ID)
	
	const chatsApi = new ChatsApi(new Configuration({ accessToken }))

	let cursor: string | undefined = undefined
	const chats: Chat[] = []
	do {
		const { data } = await chatsApi
			.chatsGetByAccount({ accountId: ACCOUNT_ID, page: cursor, count: 50 })
		cursor = data.nextPageCursor
		chats.push(...data.items)
	} while(cursor)

	console.log(`got ${chats.length} chats`)
}

run()