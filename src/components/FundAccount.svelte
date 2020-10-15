<script>
	import { onMount, getContext } from 'svelte'
	import { refreshTAUBalance, closeModal } from '../js/utils.js'
	import { currency, approvalAmount, maxSmackStamps  } from '../js/stores.js'
	import { config } from '../js/config'

	let timerID;

	const { lwc } = getContext('app_functions')

	$: txCost = parseFloat($maxSmackStamps / config.currentStampRatio).toFixed(2)

	onMount(() => {
		timerID = setTimeout(checkForFunds, 0)

	})

	const checkForFunds = () => {
		refreshTAUBalance().then(res => {
			if (res > (config.cost + config.txFee) && $approvalAmount > config.cost) closeModal()
			else {
				if (res < (config.cost + config.txFee)) timerID = setTimeout(checkForFunds, 2000)
				else {
					closeModal()
					lwc().getInfo()
				}
			}
		})
	}
</script>

<style>
	.flex-col{
		align-items: center;
		justify-content: space-evenly;
		height: 100%;
	}
	p{
		margin: 0;
		font-weight: 200;
		font-size: 0.7em;
	}
	h3{
		margin: 0 0 0.5rem;
		font-size: 0.8em;
		font-weight: 400;
	}
	.note{
		margin-top: 1rem;
	}

	.close{
		background: linear-gradient(to bottom, #fff8d1 5%, #ffdda6 100%);
		height: 31px;
		margin-top: 1rem;
    }

	@media (min-width: 480px) {
		h3 {
			font-size: 1em;
		}
		p{
			font-size: unset;
		}
	}
</style>

<div class="flex-col">
	<h3>Use your <strong>Lamden Wallet</strong> to transfer more {config.currencySymbol} to your <strong>Smack That!</strong> account.</h3>
	<p>Current accout balance is <strong>{`${parseFloat($currency).toFixed(2)} ${config.currencySymbol}`}</strong> </p>
    <p class="note">** Transfer additional {config.currencySymbol} for transaction fees (about <strong>{txCost} {config.currencySymbol}</strong> per smack) ** </p>
	<button class="close" on:click|preventDefault={() => closeModal()}>close</button> 
</div>