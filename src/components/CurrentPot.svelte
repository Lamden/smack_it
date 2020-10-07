<script>
    import { onMount, tick } from 'svelte'
    import { scale, fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { getCurrentPot } from '../js/utils'
    import { config } from '../js/config'

    let	refreshTimer
    let potWonTimer
    let value = 0
    let potWon = false
    let valueUp = false

	onMount(() => {
        potWasWon()
		//refresh current pot amount
		refreshTimer = setTimeout(updatePot, 0)

		return () => {
            refreshTimer = undefined
            potWonTimer = undefined
		}
    })

    const updatePot = async () => {
        let newValue = await getCurrentPot()
        if (newValue < value) potWasWon()
        if (newValue > value) valueIsGreater()

        value = newValue
        refreshTimer = setTimeout(updatePot, 1000)
    }

    const potWasWon = () => {
        potWon = true
        potWonTimer = setTimeout(() => potWon = false, 2000)
    }

    const valueIsGreater = async () => {
        valueUp = true;
        await tick()
        valueUp = false
    }
    
</script>

<style>
	.flex-row{
		font-size: 1.2em;
	}
    p {
        margin: 0;
        min-width: fit-content;
    }
	.winnings{
        color: yellow;
        width: 100%;
        margin-left: 8px;
	}
	.win{
		color: greenyellow;
    }
    .numbers{
        position: relative;
        width: 100px;
    }
    .pot-won{
        position: absolute;
        top: -15px;
        left: 7px;
        width: 100%;
        font-size: 0.8em;
        color: greenyellow;
    }
    .val-up{
        position: absolute;
        color: yellow;
        width: 100%;
        margin-left: 8px;
    }

    @media (min-width: 550px) {
		.flex-row{
		    font-size: 2em;
        }
        .numbers{
            width: 160px;
        }
    }

    @media (min-width: 480px) {
		.flex-row{
		    font-size: 1.5em;
        }
        .numbers{
            width: 125px;
        }
        .pot-won{
            top: -20px;
        }
    }
    

</style>

<div class="flex-row">
    <p>1 in 20 chance to <strong class="win">WIN</strong></p>
    <div class="numbers">

        {#if potWon}
            <p class="pot-won"
                in:fly="{{delay: 0, duration: 500, x: 90, y: 0, opacity: 0.0, easing: quintOut}}"
                out:fade="{{delay: 0, duration: 1000, opacity: 0.0, easing: quintOut}}">
                POT WON!
            </p>
        {/if}
        {#if valueUp}
            <p class="val-up"
                out:fly="{{delay: 0, duration: 1000, x: 0, y: -25, opacity: 0.0, easing: quintOut}}">
                {value}
            </p>
        {/if}
        <strong class="winnings">{value} {config.currencySymbol}</strong>
    </div>
</div>