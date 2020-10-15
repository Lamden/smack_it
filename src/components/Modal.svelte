<script>
    import { tick } from 'svelte'
    import { scale, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import { showModal } from '../js/stores.js'

    import SendApproval from './SendApproval.svelte'
    import FundAccount from './FundAccount.svelte'
    import SmackeroosInfo from './SmackeroosInfo.svelte'
    
    const modals = { SendApproval, FundAccount, SmackeroosInfo }


    let show = false;
    $: modal = changeModal($showModal)
    $: currentModalName = undefined
    $: currentModal = modals[currentModalName]

    const changeModal = (info) => {
        console.log(info)
        if (!info.show && show) {
            closeModal()
            return
        }
        if (info.show && !show){
            currentModalName = $showModal.modalData.modal
            show = true
            return
        }
        if (info.show && show){
            if ($showModal.modalData.modal === currentModalName) return;
            else{
                show = false;
                changeToNew($showModal.modalData.model)
            }
        }
    }
    
    const changeToNew = async (modalName) => {
            console.log('changing?')
            console.log(modals[$showModal.modalData.modal])
            await tick()
            currentModalName = $showModal.modalData.modal
            console.log(currentModal)
            show = true
            
    }

    const closeModal = () => {
        show = false
        currentModalName = undefined
    }

</script>

<style>
    .container{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    .modal {
        position: relative;
        background: #673ab7;
        border-radius: 5px;
        box-shadow: 2px 6px 19px 0px rgba(0,0,0,0.29);
        z-index: 500;
        padding: 20px;
        margin: 0 auto;
        text-align: center;
        width: 100%;
        max-width: 660px;
    }
    .data{
        flex-grow: 1;
    }
</style>

<div class="container">
    <div class="flex-col modal"
        in:fly="{{delay: 0, duration: 600, x: 0, y: 90, opacity: 0.5, easing: quintOut}}"
        out:fly="{{delay: 0, duration: 300, x: 0, y: 90, opacity: 0.5, easing: quintOut}}">
        <div class="data">
            {#if show}
                <svelte:component this={currentModal} />
            {/if}
        </div>
    </div>
</div>

