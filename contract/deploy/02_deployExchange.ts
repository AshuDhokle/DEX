export default async function ({getNamedAccounts, deployments} : {getNamedAccounts: any, deployments:any}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    
    const antAddress = (await deployments.get('Ant')).address
    const LpAddress = (await deployments.get('LPToken')).address
    
    const args = [LpAddress, antAddress];

    const contract = await deploy('Exchange', {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: 2
    })

    console.log(`Exchange deployed at ${contract.address}`);
}

