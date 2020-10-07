import { writable } from 'svelte/store';

export const walletInstalled = writable('checking');
export const walletInfo = writable({});
export const userAccount = writable("");
export const autoTx = writable(false);
export const stampRatio = writable(1);

export const snackbars = writable([]);
export const currency = writable(0);
export const approvalAmount = writable(0);
export const showModal = writable({modalData: {}, show: false});
export const sending = writable(0);
export const currentPot = writable(0);