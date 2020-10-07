<script>
    export let name;
    export let color;
    import "../../static/double-bounce.css";
    const spinkitSpinners = {
        "double-bounce": { className: "sk-double-bounce", divCount: 2 },
    };
    const spinnerInfo = spinkitSpinners[name] || spinkitSpinners["three-bounce"];
</script>

<style>
    :root {
        --sk-size: 80px;
        --sk-color: #333;
    }
    .position{
        position: absolute;
        line-height: 1.5;
    }
</style>

<div
    class="position sk-fade-in sk-fade-in {spinnerInfo['className']}"
    style="color: {color || '#000'};">
    {#each Array(spinnerInfo.divCount) as _, i}
        <div />
    {/each}
</div>