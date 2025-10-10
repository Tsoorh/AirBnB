const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './Stay.service.local'
import { stayService as remote } from './Stay.service.remote'

function getEmptyStay() {
	return {
        _id: '',
		vendor: makeId(),
		speed: getRandomIntInclusive(80, 240),
		msgs: [],
	}
}

function getDefaultFilter() {
    return {
        txt: '',
        minSpeed: '',
        sortField: '',
        sortDir: '',
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
