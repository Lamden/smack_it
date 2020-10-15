<script>
    import { onMount, tick } from 'svelte'
    import { goto } from '@sapper/app';
	import { closeModal, getDevRewards, getDevRewardsSupply } from '../js/utils.js'
	import { smackeroos  } from '../js/stores.js'
    import { config } from '../js/config'

    let devRewards
    let tauPrice
    let supply

    $: sharePer = !supply || !devRewards ? 0 : parseFloat(($smackeroos / supply)*100).toFixed(2)
    $: worthInTAU = !supply || !devRewards ? 0 : parseFloat(devRewards * sharePer).toFixed(4)

    onMount(() => {
        let timer;
        refreshDevRewards()
        setSupply()
        timer = setInterval(refreshDevRewards, 1000)

        return () => timer = null
    })

    const refreshDevRewards = async () => {
        devRewards = await getDevRewards()
    }

    const setSupply = async () => supply = await getDevRewardsSupply()

    const handleRedeemClick = async () => {
        closeModal()
        await tick()
        goto('/redeem')
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
    
    strong{
       color: rgb(95, 202, 238);
    }

	button{

		height: 37px;
        margin: 1rem 10px 0;
        
    }

    .close{
        background: linear-gradient(to bottom, #fff8d1 5%, #ffdda6 100%);
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
	<h3>You have <strong>{$smackeroos ? parseFloat($smackeroos).toFixed(4) : 0 } SMACKEROOS!</strong></h3>
    <p>Each LOSS mints you SMACKEROOS which you can redeem for a share in the developer rewards.</p>
    <p>Dev Pool Total: {parseFloat(devRewards).toFixed(4)} {config.currencySymbol}</p>
    <p>SMACKEROOS Supply: {parseFloat(supply).toFixed(4)} Your Share: {sharePer}% ({worthInTAU} {config.currencySymbol})</p>
    <div class="flex-row">
        <button class="close" on:click={() => closeModal()}>close</button> 
        <button on:click={handleRedeemClick}>redeem</button>
    </div>
</div>