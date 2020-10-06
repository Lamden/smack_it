import Lamden from 'lamden-js'
import { config } from './config.js'
import { get } from 'svelte/store'
import { currency, userAccount, approvalAmount, showModal } from "./stores";

let API = new Lamden.Masternode_API({hosts: config.masternodes})

export const refreshTAUBalance = async () => {
    const res = await API.getCurrencyBalance(get(userAccount))
    currency.set(res)
    return parseInt(res.toNumber())
}

export const checkForApproval = () => {
    console.log(`${API.host}/contracts/currency/balances?key=${get(userAccount)}:${config.smartcontact}`)
    return fetch(`${API.host}/contracts/currency/balances?key=${get(userAccount)}:${config.smartcontact}`)
        .then(res => res.json())
        .then(json => {
            let value = json.value || '0'
            if (value.__fixed__) value = value.__fixed__
            let bnValue = Lamden.Encoder('bigNumber', value)
            if (bnValue !== get(approvalAmount)) approvalAmount.set(bnValue)
            return bnValue
        })
        .catch(e => console.log(e.message))
}

export const closeModal = () => showModal.set({modalData: {}, show: false})
