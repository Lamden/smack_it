/* /frontend/src/wallet_approval.js   */
import { config } from './config.js'

const approvalRequest = {
    appName: 'Smack That!',
    version: '0.0.2',
    contractName: config.smartcontact,
    networkType: 'testnet'
}

approvalRequest.logo = 'logo-192.png'
approvalRequest.background = 'wallet/background.png'

export { approvalRequest };
