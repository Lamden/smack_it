<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<style>
.bigRedButton {
    width: 200px;
    height: 180px;
    line-height: 200px;
    text-align: center;
    cursor: pointer;
    border-radius: 50%;
    background: #f74d4d;
    
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f74d4d), color-stop(100%, #f86569));
    
    background-image: -moz-gradient(linear, left top, left bottom, color-stop(0%, #f74d4d), color-stop(100%, #f86569));
    
    box-shadow: 0 15px #e24f4f;
}

.bigRedButton:active{
      box-shadow: 0 0 #e24f4f;
      transform: translate(0px, 15px);
      transform: transition( 0.1s all ease-out);
}
</style>

<div class="bigRedButton" on:click={() => dispatch('click')}></div>