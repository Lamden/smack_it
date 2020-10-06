<script>
    import { getContext } from 'svelte'
	import { showModal  } from '../js/stores.js'
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
            },
            stampLimit: 50
		}
		sendTransaction(transaction, handleApproveTx)
	}

	const handleApproveTx = async (txResults) => {
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
</style>

<div class="flex-col">
    <p>We want to play a fun game with you but you need to let us spend your TAU.</p>
	<form id="approve" class="flex-col" on:submit|preventDefault={approveAmount}>
		<label for="amount">How much would you like to allow us to spend? </label>
		<input id="amount" type="text" bind:value={amount}/>
        <input type="submit" value="Approve TAU" form="approve" />
	</form>
</div>