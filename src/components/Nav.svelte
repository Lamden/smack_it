<script>
	import WalletConnectButton from './WalletConnectButton.svelte'

	import { currency, userAccount, approvalAmount } from '../js/stores'
	
	export let segment;
	export let lwc;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
	.flex-row{
		justify-content: space-between;
		align-items: center;
	}
</style>

<nav class="flex-row">
	<ul>
		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">home</a></li>
		<li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">winners</a></li>
	</ul>

	{#if lwc}
		{#if $userAccount} 
			<p>{$userAccount}</p>
			<p>{$currency}</p>
			<p>{$approvalAmount}</p>
		{:else}
			<WalletConnectButton {lwc}/>
		{/if}
	{/if}
</nav>
