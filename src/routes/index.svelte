<script>
	import BigRedButton from '../components/BigRedButton.svelte'

	import { getContext } from 'svelte'
	import { showModal  } from '../js/stores.js'
	import { checkForApproval, closeModal } from '../js/utils.js'
	import { config } from '../js/config.js'

	const { sendTransaction, userHasFunds } = getContext('app_functions')
	let win, lose
	let audio = {win, lose}

	const smack = () => {
		const transaction = {
			methodName: 'smack',
			networkType: 'testnet',
			kwargs: {},
            stampLimit: 50
		}
		sendTransaction(transaction, handleSmack)
	}

	const handleSmack = async (txResults) => {
		console.log(txResults)
        if (txResults.txBlockResult.status === 0) {

			if(txResults.txBlockResult.result === "None") {
				console.log('lose')
				play('lose')
			}
			else {
				console.log('win')
				play('win')
			}
        }
	}
	const play = (result) => {
		console.log(result)
		console.log(audio)
		console.log(audio[result])
		audio[result].currentTime = 0
		audio[result].play()
	}

	const handleClick = () => {
		userHasFunds().then(res => {
			console.log(res)
			if (res)  smack()
		})
	}
</script>

<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	.flex-col{
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Smack That!</title>
</svelte:head>

<div class="flex-col">
	<h1>Smack That Button!</h1>
	<p>1 in 10 win 20 TAU per smack</p>
	<p>100% community driven. 0% house edge.</p>
	<BigRedButton on:click={handleClick} />
</div>
<audio  src='audio/lose.mp3' volume=1 bind:this={audio["lose"]}/>
<audio  src='audio/dings.mp3' volume=1 bind:this={audio["win"]}/>