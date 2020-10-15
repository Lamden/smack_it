<script>
    import { onMount } from 'svelte'
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let lwc ;

    $: installed = false;
    $: connected = false;
    $: locked = false;

    let storeURL = "https://chrome.google.com/webstore/detail/lamden-wallet-browser-ext/fhfffofbcgbjjojdnpcfompojdjjhdim"

    onMount(() => {
        setState()
		lwc.events.on('newInfo', setState)
        lwc.events.on('installed', (res) => installed = res)

		return () => {
			lwc.events.removeListener(setState)
		}
	})

    const setState = () => {
        installed = lwc.installed
        connected = lwc.approved
        locked = lwc.locked
    }

    const openLink = (url) => {
        if (!installed) window.open(storeURL, '_blank');
	}

</script>

<style>
    a, button {
        box-shadow: 0px 1px 0px 0px #fff6af;
        background:linear-gradient(to bottom, #ffec64 5%, #ffab23 100%);
        background-color:#ffec64;
        border-radius:6px;
        border:1px solid #ffaa22;
        display:inline-block;
        cursor:pointer;
        color:#333333;
        font-family:Arial;
        font-size:15px;
        font-weight:bold;
        padding:6px 24px;
        text-decoration:none;
        text-shadow:0px 1px 0px #ffee66;
        height: 37px;
    }
    button:disabled{
        background: linear-gradient(to bottom, #ff5bb07d 5%, #ef027d7d 100%);
        color: #e8e8e8;
    }
    a, button:hover {
        background:linear-gradient(to bottom, #ffab23 5%, #ffec64 100%);
        background-color:#ffab23;
    }
    a, button:active {
        position:relative;
        top:1px;
    }
</style>



{#if !installed}
    <a href="https://chrome.google.com/webstore/detail/lamden-wallet-browser-ext/fhfffofbcgbjjojdnpcfompojdjjhdim"
       target="_blank"
       rel="noopener noreferrer">Install Lamden Wallet</a>
{:else}
     {#if locked}
        <button on:click={() => location.reload()}>Wallet Locked</button>
    {:else}
         {#if !connected}
            <button on:click={() => lwc.sendConnection()}> Connect to Wallet</button>
         {/if}
    {/if}
{/if}





