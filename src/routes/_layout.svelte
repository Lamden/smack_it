<script>
	import { onMount, setContext } from 'svelte';
	import WalletController from 'lamden_wallet_controller';

	//Stores
	import { walletInstalled, walletInfo, userAccount, autoTx, showModal, approvalAmount, currency } from '../js/stores.js';

	//Utils
	import { approvalRequest } from '../js/wallet_connection';
	import { checkForApproval, refreshTAUBalance } from '../js/utils'
	import { config } from '../js/config'

	//components
	import Nav from '../components/Nav.svelte';
	import Modal from '../components/Modal.svelte'
	import SendApproval from '../components/SendApproval.svelte'
	import FundAccount from '../components/FundAccount.svelte'

	export let segment;

	let lwc;

	setContext('app_functions', {
		sendTransaction,
		lwc: () => lwc,
		userHasFunds
	})

	onMount(() => {
		lwc = new WalletController(approvalRequest)
		//lwc = new WalletController()
		lwc.events.on('newInfo', handleWalletInfo)
		lwc.events.on('txStatus', handleTxResults)

		lwc.walletIsInstalled()
				.then(installed => {
					if (installed) walletInstalled.set('installed')
					else walletInstalled.set('not-installed')
				})

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
					console.log('taubal: '+ res)
					if(res < config.cost) {
						showModal.set({modalData: {modal: FundAccount}, show: true})
						return resolver(false)
					}
					else{
						checkForApproval().then(res => {
							console.log('approval: '+ res)
							if($approvalAmount < config.cost ) {
								showModal.set({modalData: {modal: SendApproval}, show: true})
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
		lwc.sendTransaction(transaction, callback)
	}
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {lwc} {segment}/>

<main>
	<slot></slot>
</main>

{#if $showModal.show}<Modal />{/if}