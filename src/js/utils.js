import Lamden from 'lamden-js'
import { config } from './config.js'
import { get } from 'svelte/store'
import { userAccount, approvalAmount, showModal, currency, smackeroos, currentPot } from "./stores";

let API = new Lamden.Masternode_API({hosts: config.masternodes})

export const refreshTAUBalance = async () => {
    const res = await API.getCurrencyBalance(get(userAccount))
    currency.set(res)
    return parseInt(res.toNumber())
}

export const checkForApproval = () => {
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

export const refreshCurrentPot = async () => {
    const res = await API.getCurrencyBalance(config.smartcontact)
    if (res.toNumber() != get(currentPot)) currentPot.set(res)
    return res
}

export const getSmackeroos = async () => {
    const res = await API.getVariable(config.devContract, 'balances', get(userAccount))
    let value = res || '0'
    if (value.__fixed__) value = value.__fixed__
    let bnValue = Lamden.Encoder('bigNumber', value)
    if (bnValue !== get(smackeroos)) smackeroos.set(bnValue)
    smackeroos.set(bnValue)
    return bnValue
}

export const getDevRewards = async () => {
    const res = await API.getCurrencyBalance(config.devContract)
    return res
}
export const getDevRewardsSupply = async () => {
    const res = await API.getVariable(config.devContract, 'supply')
    let value = res || '0'
    if (value.__fixed__) value = value.__fixed__
    let bnValue = Lamden.Encoder('bigNumber', value)
    return bnValue
}

export const closeModal = () => showModal.set({modalData: {}, show: false})
