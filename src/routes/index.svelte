<script>
	import { onMount } from 'svelte'
	import BigRedButton from '../components/BigRedButton.svelte'
	import Spinner from '../components/Spinner.svelte';

	import { getContext } from 'svelte'
	import { showModal, sending, currency, approvalAmount, currentPot, currentBet  } from '../js/stores.js'
	import { checkForApproval, closeModal, refreshCurrentPot } from '../js/utils.js'
	import { config } from '../js/config.js'
	import { approvalRequest } from '../js/wallet_connection';

	const { sendTransaction, userHasFunds, lwc } = getContext('app_functions')
	let win, lose
	let audio = {win, lose}
	const messageDefault = "SMACK<br />ME"
	let message = messageDefault
	let bet;
	$: maxBet = Math.floor($currentPot * 0.08)

	onMount(() => {
		bet = localStorage.getItem('last_bet') ? localStorage.getItem('last_bet') : 1
		setBetValues(bet)
		let timer;
		refreshCurrentPot().then(() => {
			timer = setInterval(refreshCurrentPot, 1000)
		})

		return () => timer = null
	})

	const smack = () => {
		if (message === messageDefault){
			const transaction = {
				methodName: 'smack',
				networkType: approvalRequest.networkType,
				kwargs: {
					"bet_amount": parseInt(bet)
				}
			}
			sendTransaction(transaction, handleSmack)
		}
	}

	const handleSmack = async (detail) => {
		let txResults = detail.data
		sending.update(value => value - 1)
		if (!txResults.errors){
			if (txResults.txBlockResult.status === 0) {
				let smackResult = JSON.parse(txResults.txBlockResult.result.replaceAll("'", "\""))
				localStorage.setItem('last_bet', smackResult.bet);
				refreshCurrentPot();
				if( smackResult.status === 0) {
					setButtonMessage('NOPE', 3000)
					play('lose')
				}
				else {
					setButtonMessage(`WINNER!<br />${smackResult.won} TAU`, 7300)
					play('win')
				}
			}
		}
		setTimeout(lwc().getInfo, 1000)
	}

	const play = (result) => {
		audio[result].currentTime = 0
		audio[result].play()
	}

	const setButtonMessage = (text, timeout) => {
		message = text
		setTimeout(() => message = messageDefault, timeout)
	}

	const handleClick = () => {
		userHasFunds(bet).then(res => {
			if (res)  smack()
			else {
				setButtonMessage("NO FUNDS", 2000)
				play("broke")
			}
		})
	}
	const handleBetChange = () => {
		if (bet > maxBet) setBetValues (parseInt(maxBet))
		else setBetValues(parseInt(bet))
	}
	const setBetValues = (value) => {
		bet = parseInt(value)
		localStorage.setItem('last_bet', parseInt(value))
		currentBet.set(value)
	}
	const handleMaxBet = () => {
		bet = maxBet
		currentBet.set(maxBet)
	}
</script>

<style>
	h1, p {
		text-align: center;
		margin: 0 auto;
	}

	h2{
		margin-top: 3rem;
		font-size: 1.2em;
	}

	h1 {
		font-size: 1.7em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 1rem 0;
		color: yellow;
	}

	.subtitle{
		font-size: 0.8em;
		color: rgb(122, 122, 122);
	}

	.flex-col{
		justify-content: center;
		align-items: center;
	}

	.button-box{
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1.4;
		margin-top: 2rem;
	}

	.button-message{
		z-index: 10;
		text-align: center;
		font-size: 1.8em;
		width: 100%;
		color: rgb(252, 233, 233);
		font-weight: 800;
		line-height: 1.4;
	}

	.winner {
		animation-name: flash;
		animation-duration: 0.2s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		animation-play-state: running;
	}

	.win{
		color: yellowgreen;
	}

	.pay{
		color: yellow;
	}
	.costs{
		font-size: 1.3em;
	}

	input[type="number"]{
		padding: 2px 0 2px 4px;
		height: 30px;
		width: 75px;
		position: relative;
		top: -2px;
		background: transparent;
		border: 1px solid yellow;
		color: yellow;
		font-weight: bolder;
		font-size: smaller;
		border-radius: 2px;
		margin-left: 2px;
	}

	input[type="number"]:focus{
		 outline: none;
	}

	input[type="number"]::-webkit-outer-spin-button,
	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	button{
		height: 37px;
		margin-top: 1rem;
	}

	@keyframes flash {
		from {color: yellow;}
		to {color: rgb(81, 255, 0);}
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 2.3em;
		}

		h2, .subtitle{
			font-size: unset;
		}
	}

	@media (min-width: 560px) {
		h1 {
			font-size: 2.9em;
		}
	}

	@media (min-width: 755px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Smack That!</title>

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Smack That!" />
	<meta name="twitter:description" content="Smack and Win!" />
	<meta name="twitter:site" content="@lamdentau" />
	<meta name="twitter:creator" content="www.lamden.io" />
	<meta name="twitter:image" content="https://smackthat.lamden.io/logo-192.png" />
	<meta name="twitter:image:alt" content="https://smackthat.lamden.io/logo-192.png" />

	<meta property="og:url" content="https://smackthat.lamden.io" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="Smack That!" />
	<meta property="og:image" content="https://smackthat.lamden.io/logo-192.png" />
	<meta property="og:description" content="Smack and Win!" />
	<meta property="og:image:url" content="https://smackthat.lamden.io/logo-192.png" />
	<meta property="og:image:secure_url" content="https://smackthat.lamden.io/logo-192.png" />
	<meta property="og:image:width" content="192" />
	<meta property="og:image:height" content="192" />
	<meta property="og:image:type" content="image/png" />
</svelte:head>

<h1>Smack That Button!</h1>
<div class="flex-col">
	
	
	<p class="costs">Pay 
		<input type="number" bind:value={bet} min="1" step="1" pattern="\d*" on:change={handleBetChange}/>
		<strong class="pay">{config.currencySymbol} </strong>
		 to <strong>WIN </strong><strong class="win"> {bet * 2} {config.currencySymbol}</strong> </p>
	<button on:click={handleMaxBet} > BET MAX {maxBet} {config.currencySymbol}</button>
	

	<div class="flex-col button-box">
		<BigRedButton  on:click={handleClick}>
			{#if $sending > 0}
				<Spinner name="double-bounce" color="red" />
			{:else}
				<p class="button-message" class:winner={message.includes("WINNER")}>{@html message}</p>
			{/if}
		</BigRedButton>
		<h2>Current Pot {$currentPot} {config.currencySymbol}</h2>
		<p class="subtitle">48% chance to double your bet (max bet: 8% of POT) </p>
	</div>
</div>

<audio  src='audio/lose.mp3' volume=1 bind:this={audio["lose"]}><track kind="captions" /></audio>
<audio  src='audio/dings.mp3' volume=1 bind:this={audio["win"]}><track kind="captions" /></audio>
<audio  src='audio/broke.mp3' volume=1 bind:this={audio["broke"]}><track kind="captions" /></audio>