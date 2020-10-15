/* /frontend/src/wallet_approval.js   */
import { config } from './config.js'

const approvalRequest = {
    appName: 'Smack That!',
    version: '0.5.2',
    contractName: config.smartcontact,
    networkType: config.networkType
}

approvalRequest.logo = 'logo-192.png'
approvalRequest.background = 'background.png'

export { approvalRequest };
