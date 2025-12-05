const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy MockUSDC
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    const mockUSDCAddress = await mockUSDC.getAddress();
    console.log("MockUSDC deployed to:", mockUSDCAddress);

    // 2. Deploy QuickPay
    const QuickPay = await hre.ethers.getContractFactory("QuickPay");
    const quickPay = await QuickPay.deploy(mockUSDCAddress);
    await quickPay.waitForDeployment();
    console.log("QuickPay deployed to:", await quickPay.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
