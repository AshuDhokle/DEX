export default async function ({getNamedAccounts, deployments} : {getNamedAccounts: any, deployments:any}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    
    const contract = await deploy('Ant', {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 2
    })

    console.log(`Ant deployed at ${contract.address}`);
}

