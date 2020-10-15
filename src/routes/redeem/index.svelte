<script>
    import { config } from '../../js/config.js'
</script>

<style>
    h1, h2{
        text-align: center;
    }
    img{
        display: flex;
        margin: 3rem auto 0;
    }
    strong{
        color: yellowgreen;
    }
    p{
        text-align: center;
    }
    div{
        width: fit-content;
        margin: 0 auto;
    }
    a{
        color: yellow;
        font-size: 1.8em;
        font-weight: 200;
    }
    a:hover{
        color: yellowgreen;
    }
    .info{
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid grey;
    }
    .info > p{
        text-align: left;
    }
    span.smackeroo{
        color: rgb(95, 202, 238);
    }
    span.tau{
        color: yellow;
    }
</style>

<a href="/">{"< " + "HOME"}</a>
<div>
    <h1>What are  <span class="smackeroo">SMACKEROOS</span>?</h1>

    <div class="info">
        <p><span class="smackeroo">SMACKEROOS</span> are gained by smacking the BIG RED button.</p>

        <p>Each LOSS from the Smack That! DAPP gains you a certain amount of <span class="smackeroo">SMACKEROOS</span>. These tokens represent an ownership of the <span class="tau">{config.currencySymbol}</span> developer rewards accumulated by the Smack That! DAPP.</p>

        <p>Follow the directions below to turn your <span class="smackeroo">SMACKEROOS</span> into <span class="tau">{config.currencySymbol}</span>.</p>

        <p>
            <strong>NOTE: </strong> 
            <span class="smackeroo">SMACKEROOS</span> can only be redeemed ONCE. After redemption they are burned and the total supply of <span class="smackeroo">SMACKEROOS</span> is decreased.  
            This means everytime someone redeems their <span class="smackeroo">SMACKEROOS</span>, all other holders increase their ownership percentage.
        </p>
    </div>


    <h2>Redeem your <span class="smackeroo">SMACKEROOS</span> for <span class="tau">{config.currencySymbol}</span></h2>
    <img src="img/redeem_1.png" alt="redeem_1" />
    <p>Click on your <strong>Smack That!</strong> Linked Account in the Lamden Wallet</p>
    <img src="img/redeem_2.png" alt="redeem_2" />
    <p>Click the <strong>Send Tx</strong> button</p>
    <img src="img/redeem_3.png" alt="redeem_3" />
    <ol>
        <li>In the <strong>Enter Contract Name</strong> field enter <strong>con_smackeroos_2</strong></li>
        <li>From the <strong>Choose Function to Run</strong> dropdown box choose <strong>redeem</strong></li>
        <li>In the <strong>AMOUNT (Decimal)</strong> field enter the amount of <span class="smackeroo">SMACKEROOS</span> to redeem</li>
    </ol>

    <img src="img/redeem_4.png" alt="redeem_4" />

    <p>Click the <strong>CONFIRM TRANSACTION</strong> button</p>
    <p>Click <strong>OK</strong> on the broswer popup which asks you to send the transaction.</p>

    <h2>Done!</h2>
</div>