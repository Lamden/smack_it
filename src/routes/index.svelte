<script>
	import BigRedButton from '../components/BigRedButton.svelte'
	import Spinner from '../components/Spinner.svelte';
	import CurrentPot from '../components/CurrentPot.svelte';

	import { getContext } from 'svelte'
	import { showModal, sending, currency, approvalAmount  } from '../js/stores.js'
	import { checkForApproval, closeModal } from '../js/utils.js'
	import { config } from '../js/config.js'

	const { sendTransaction, userHasFunds, lwc } = getContext('app_functions')
	let win, lose
	let audio = {win, lose}
	const messageDefault = "SMACK<br />ME"
	let message = messageDefault
	$: spinsLeft = calcSpinsLeft($currency, $approvalAmount)

	const calcSpinsLeft = (curr, approval) => {
		if (approval <= curr){
			if (approval < config.cost) return 0;
			else return Math.floor(approval / config.cost)
		}else{
			if (curr < config.cost) return 0;
			else return Math.floor(curr / config.cost)	
		}
	}

	const smack = () => {
		if (message === messageDefault){
			const transaction = {
				methodName: 'smack',
				networkType: 'testnet',
				kwargs: {}
			}
			sendTransaction(transaction, handleSmack)
		}
	}

	const handleSmack = async (txResults) => {
		sending.update(value => value - 1)
        if (txResults.txBlockResult.status === 0) {
			if(txResults.txBlockResult.result === "None") {
				setButtonMessage('NOPE', 3000)
				play('lose')
			}
			else {
				setButtonMessage(`WINNER!<br />${txResults.txBlockResult.result} TAU`, 7300)
				play('win')
			}
		}
		console.log("calling get info")
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
		userHasFunds().then(res => {
			if (res)  smack()
			else {
				setButtonMessage("YOU'RE<br />BROKE", 2000)
				play("broke")
			}
		})
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

	@keyframes flash {
		from {color: yellow;}
		to {color: rgb(81, 255, 0);}
	}

	.fees{
		color: rgb(122, 122, 122);
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
</svelte:head>

<h1>Smack That Button!</h1>
<div class="flex-col">
	
	
	<CurrentPot />
	<p class="subtitle"><strong>100%</strong> community driven. <strong>0%</strong> house edge.</p>

	<div class="flex-col button-box">
		<BigRedButton  on:click={handleClick}>
			{#if $sending > 0}
				<Spinner name="double-bounce" color="red" />
			{:else}
				<p class="button-message" class:winner={message.includes("WINNER")}>{@html message}</p>
			{/if}
		</BigRedButton>
		<h2>Smacks Available {spinsLeft}</h2>
		<p class="fees subtitle"><strong>{`${config.cost} ${config.currencySymbol} + tx fees `}</strong> per smack.</p>

	</div>
</div>

<audio  src='audio/lose.mp3' volume=1 bind:this={audio["lose"]}><track kind="captions" /></audio>
<audio  src='audio/dings.mp3' volume=1 bind:this={audio["win"]}><track kind="captions" /></audio>
<audio  src='audio/broke.mp3' volume=1 bind:this={audio["broke"]}><track kind="captions" /></audio>