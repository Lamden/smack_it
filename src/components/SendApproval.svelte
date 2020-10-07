<script>
    import { getContext } from 'svelte'
	import { showModal, sending  } from '../js/stores.js'
	import { checkForApproval, closeModal } from '../js/utils.js'
	import { config } from '../js/config.js'

    const { sendTransaction } = getContext('app_functions')

	let amount;

	const approveAmount = () => {
		const transaction = {
			contractName: 'currency',
			methodName: 'approve',
			networkType: 'testnet',
			kwargs: {
                amount: parseFloat(amount),
                to: config.smartcontact
            }
		}
		sendTransaction(transaction, handleApproveTx)
	}

	const handleApproveTx = async (txResults) => {
		sending.update(value => value - 1)
        if (txResults.txBlockResult.status === 0) {
        	await checkForApproval().then((value) => {
                if (value >= 10) closeModal()
            })
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

</style>

<div class="flex-col">
    <p>This game needs permission to spend your {config.currencySymbol}.</p>
	<form id="approve" class="flex-col" on:submit|preventDefault={approveAmount}>
		<label for="amount">How much can it spend? </label>
		<div class="flex-row">
			<input id="amount" type="text" bind:value={amount}/>
        	<input type="submit" disabled={$sending > 0} value={`Approve ${config.currencySymbol}`} form="approve" />
		</div>
	</form>
</div>