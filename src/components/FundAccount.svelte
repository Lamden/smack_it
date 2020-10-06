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
			if (res > config.cost && $approvalAmount > config.cost) closeModal()
			else {
				if (res < config.cost) timerID = setTimeout(checkForFunds, 2000)
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
</style>

<div class="flex-col">
    <p>Each smack costs 10 TAU; your Smack It account balance is {$currency}</p>
	<p>Please open the Lamden Wallet and transfer TAU to your Smack It account!</p>
</div>