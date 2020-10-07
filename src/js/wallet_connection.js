/* /frontend/src/wallet_approval.js   */
import { config } from './config.js'

const approvalRequest = {
    appName: 'Smack That!',
    version: '0.0.1',
    contractName: config.smartcontact,
    networkType: 'mainnet'
}

approvalRequest.logo = 'logo-192.png'
approvalRequest.background = 'background.png'

export { approvalRequest };
