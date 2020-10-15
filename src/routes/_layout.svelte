<script>
	import { onMount, setContext } from 'svelte';
	import WalletController from 'lamden_wallet_controller';

	//Stores
	import { walletInstalled, walletInfo, userAccount, autoTx, showModal, approvalAmount, currency, sending, currentBet, maxSmackStamps } from '../js/stores.js';

	//Utils
	import { approvalRequest } from '../js/wallet_connection';
	import { checkForApproval, refreshTAUBalance, getSmackeroos } from '../js/utils'
	import { config } from '../js/config'

	//components
	import Nav from '../components/Nav.svelte';
	import Modal from '../components/Modal.svelte'

	export let segment;

	let lwc;
	let stampLimits = {}
	let errors = []

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
		fetch(`${config.blockExplorer}/api/stamps/${config.smartcontact}/smack`).then(res => res.json()).then(json => {
			stampLimits.smack = json
			maxSmackStamps.set(json.max)
			})
		fetch(`${config.blockExplorer}/api/stamps/currency/approve`).then(res => res.json()).then(json => stampLimits.approve = json)

		return () => {
			lwc.events.removeListener(handleWalletInfo)
			lwc.events.removeListener(handleTxResults)
		}
	})

	const handleWalletInfo = (info) => {
		autoTx.set(lwc.autoTransactions)
		userAccount.set(lwc.walletAddress)
		walletInfo.set(info)

		userHasFunds($currentBet)
	}

	function userHasFunds(bet_amount) {
		return new Promise((resolver) => {
			if ($userAccount){
				getSmackeroos()
				refreshTAUBalance().then(res => {
					console.log(res < (bet_amount + ($maxSmackStamps / config.currentStampRatio)))
					if(res < (bet_amount + ($maxSmackStamps / config.currentStampRatio))) {
						showModal.set({modalData: {modal: "FundAccount"}, show: true})
						return resolver(false)
					}
					else{
						checkForApproval().then(res => {
							if($approvalAmount < bet_amount ) {
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

	const handleTxResults = (detail) => {
		let txResults = detail.data
		if (txResults.resultInfo){
			if (txResults.resultInfo.type === "error"){
				errors = [txResults.resultInfo.title, ...txResults.resultInfo.errorInfo]
				return
			}
		}
		if (txResults.errors){
			if(txResults.errors[0] === "User closed Popup window") {
				sending.update(value => value - 1)
				return
			}
			if (txResults.errors.length > 0) errors = txResults.errors
			return
		}
		errors = [];
	}

	function sendTransaction (transaction, callback){
		transaction.stampLimit = stampLimits[transaction.methodName].max + 10
		//transaction.stampLimit = 80
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
	p{
		color: red;
		text-align: center;
		margin: 0 0 0.25rem;
	}
</style>

<Nav {lwc} {segment}/>

<main>
	<slot></slot>
</main>
{#each errors as error}
	<p>{error}</p>
{/each}

{#if $showModal.show}<Modal />{/if}