<script>
    import { getContext, onMount } from 'svelte'
	import { showModal, sending, currentBet, approvalAmount } from '../js/stores.js'
	import { checkForApproval, closeModal } from '../js/utils.js'
	import { config } from '../js/config.js'
	import { approvalRequest } from '../js/wallet_connection';

    const { sendTransaction } = getContext('app_functions')

	let amount = $currentBet - $approvalAmount;

	onMount(() => console.log({currentBet:$currentBet, approvalAmount: $approvalAmount}))

	const approveAmount = () => {
		const transaction = {
			contractName: 'currency',
			methodName: 'approve',
			networkType: approvalRequest.networkType,
			kwargs: {
                amount: parseFloat(amount),
                to: config.smartcontact
            }
		}
		sendTransaction(transaction, handleApproveTx)
	}

	const handleApproveTx = async (detail) => {
		let txResults = detail.data
		sending.update(value => value - 1)
		if (!txResults.errors){
			if (txResults.txBlockResult.status === 0) {
				await checkForApproval().then((value) => {
					if (value >= $currentBet) closeModal()
				})
			}
		}
    }

</script>

<style>
	.flex-col{
		align-items: center;
		justify-content: space-evenly;
		height: 100%;
	}
	p{
		margin: 0 0 0.5rem;
	}
	label{
		margin-bottom: 0.5rem;
	}
	input[type="submit"] {
		height: 31px;
		margin-left: 10px;
	}

	input[type="text"]{
		text-align: right;
		width: 145px;
		padding-right: 10px;
	}
    .close{
		background: linear-gradient(to bottom, #fff8d1 5%, #ffdda6 100%);
		height: 31px;
		margin-top: 1rem;
    }
</style>

<div class="flex-col">
    <p>This game needs permission to spend your {config.currencySymbol}.</p>
	<form id="approve" class="flex-col" on:submit|preventDefault={approveAmount}>
		<label for="amount">Enter at as much, or more, as you want to bet. </label>
		<div class="flex-row">
			<input id="amount" type="text" bind:value={amount}/>
        	<input type="submit" disabled={$sending > 0} value={`Approve ${config.currencySymbol}`} form="approve" />
		</div>
	</form>
	<button class="close" on:click|preventDefault={() => closeModal()}>close</button> 
</div>