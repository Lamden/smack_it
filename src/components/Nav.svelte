<script>
	import WalletConnectButton from './WalletConnectButton.svelte'

	import { currency, userAccount, approvalAmount, walletInfo, smackeroos, currentBet, showModal  } from '../js/stores'
	import { config } from '../js/config'
	
	export let lwc;

	const handleSmakeroosClick = () => {
		showModal.set({modalData: {modal: "SmackeroosInfo"}, show: true})
	}
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
		max-width: 200px;
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
		color: #b6ffb6;
	}
	.smackeroos{
		color: rgb(95, 202, 238);
		text-decoration: underline;
		cursor: pointer;
	}

	.smackeroos:hover{
		color: rgb(255, 0, 255);
		text-decoration: none;
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
				Wallet Account 
				<a href={`${config.blockExplorer}/addresses/${$userAccount}`} target="_blank" rel="noopener noreferrer">{$userAccount}</a>
			</p>
			<div>
				<span class="currency" 
						class:good-bal={$currency >= $currentBet}
						class:bad-bal={$currency < $currentBet}> 
						{`${parseFloat($currency).toFixed(2)} ${config.currencySymbol}`}
				</span>
				<span 	class:approval-good={$approvalAmount >= $currentBet}
						class:bad-bal={$approvalAmount < $currentBet}> 
						{`(${$approvalAmount} approved)`}
				</span>
			</div>
			<p class="smackeroos" on:click={handleSmakeroosClick}>
				{`SMACKEROOS ${parseFloat($smackeroos).toFixed(8)}`}
			</p>

		{:else}
			<WalletConnectButton {lwc}/>
		{/if}
	{/if}
</nav>
