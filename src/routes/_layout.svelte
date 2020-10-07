<script>
	import { onMount, setContext } from 'svelte';
	import WalletController from 'lamden_wallet_controller';

	//Stores
	import { walletInstalled, walletInfo, userAccount, autoTx, showModal, approvalAmount, currency, sending } from '../js/stores.js';

	//Utils
	import { approvalRequest } from '../js/wallet_connection';
	import { checkForApproval, refreshTAUBalance } from '../js/utils'
	import { config } from '../js/config'

	//components
	import Nav from '../components/Nav.svelte';
	import Modal from '../components/Modal.svelte'

	export let segment;

	let lwc;
	let stampLimits = {}

	setContext('app_functions', {
		sendTransaction,
		lwc: () => lwc,
		userHasFunds
	})

	onMount(() => {
		lwc = new WalletController(approvalRequest)
		lwc.events.on('newInfo', handleWalletInfo)
		lwc.events.on('txStatus', handleTxResults)

		lwc.walletIsInstalled()
				.then(installed => {
					if (installed) walletInstalled.set('installed')
					else walletInstalled.set('not-installed')
				})

		// Get stamp costs for the methods we will call
		fetch(`${config.blockExplorer}/api/stamps/${config.smartcontact}/smack`).then(res => res.json()).then(json => stampLimits.smack = json)
		fetch(`${config.blockExplorer}/api/stamps/currency/approve`).then(res => res.json()).then(json => stampLimits.approve = json)

		return () => {
			lwc.events.removeListener(handleWalletInfo)
			lwc.events.removeListener(handleTxResults)
		}
	})

	const handleWalletInfo = (info) => {
		console.log(info)
		autoTx.set(lwc.autoTransactions)
		userAccount.set(lwc.walletAddress)
		walletInfo.set(info)

		userHasFunds();
	}

	function userHasFunds() {
		return new Promise((resolver) => {
			if ($userAccount){
				refreshTAUBalance().then(res => {
					if(res < config.cost) {
						showModal.set({modalData: {modal: "FundAccount"}, show: true})
						return resolver(false)
					}
					else{
						checkForApproval().then(res => {
							if($approvalAmount < config.cost ) {
								showModal.set({modalData: {modal: "SendApproval"}, show: true})
								return resolver(false)
							}
							else return resolver(true)
						});
					}
				})
			}
			else resolver(false)
		})
	}

	const handleTxResults = (results) => {/*
		let errors = processTxResults(results)
		if (errors.length > 0) {
			if (errors[0].includes('have not been approved for')) lwc.sendConnection(approvalRequest, true)
		}*/
	}

	function sendTransaction (transaction, callback){
		transaction.stampLimit = stampLimits[transaction.methodName].max
		sending.update(value => value + 1)
		lwc.sendTransaction(transaction, callback)
	}
</script>

<style>
	main {
		position: relative;
		max-width: 65em;
		padding: 2em;
		margin: 0 auto;
	}
</style>

<Nav {lwc} {segment}/>

<main>
	<slot></slot>
</main>

{#if $showModal.show}<Modal />{/if}