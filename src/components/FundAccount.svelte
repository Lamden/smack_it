<script>
	import { onMount, getContext } from 'svelte'
	import { refreshTAUBalance, closeModal } from '../js/utils.js'
	import { currency, approvalAmount  } from '../js/stores.js'
	import { config } from '../js/config'

	let timerID;

	const { lwc } = getContext('app_functions')

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
		margin: 0 0 1rem;
		font-size: 0.8em;
		font-weight: 400;
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
	<h3>Use the <strong>Lamden Wallet</strong> to transfer more {config.currencySymbol} to your <strong>Smack That Account</strong>!</h3>
    <p>Each SMACK costs <strong>{config.cost} {config.currencySymbol} + tx fees</strong>  (roughly {config.txFee} {config.currencySymbol}) </p>
	<p>Your Smack It account balance is <strong>{`${$currency} ${config.currencySymbol}`}</strong> </p>
</div>