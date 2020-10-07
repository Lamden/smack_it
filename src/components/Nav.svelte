<script>
	import WalletConnectButton from './WalletConnectButton.svelte'

	import { currency, userAccount, approvalAmount, walletInfo } from '../js/stores'
	import { config } from '../js/config'
	
	export let lwc;

	let totalCost = config.cost + config.txFee
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 1rem 1rem;
	}

	.mobile{
		display: none;
	}

	.flex-col{
		align-items: flex-end;
	}
	.flex-col > p {
		line-height: 1;
		margin: 0 0 0.25rem ;
		text-align: right;
	}
	.account{
		min-width: 200px;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.currency{
		font-weight: 400;
	}
	.good-bal{
		color: #75ff75;
	}
	.bad-bal{
		color: rgb(255, 108, 108);
	}
	.approval-good{
		color: rgb(192, 192, 192);
	}

	@media (min-width: 480px) {
		.mobile{
			display: flex;
		}
	}
</style>

<nav class="flex-col mobile">
	{#if lwc}
		{#if $userAccount && !$walletInfo.locked} 
			<p 	class="account">
				account 
				<a href={`${config.blockExplorer}/addresses/${$userAccount}`} target="_blank" rel="noopener noreferrer">{$userAccount}</a>
			</p>
			<p 	class="currency" 
				class:good-bal={$currency >= totalCost}
				class:bad-bal={$currency < totalCost}
				> {`${$currency} ${config.currencySymbol}`}</p>
			<p 	class:approval-good={$approvalAmount >= config.cost}
				class:bad-bal={$approvalAmount < config.cost}> 
			{`(approval ${$approvalAmount} ${config.currencySymbol})`}
			</p>
		{:else}
			<WalletConnectButton {lwc}/>
		{/if}
	{/if}
</nav>
