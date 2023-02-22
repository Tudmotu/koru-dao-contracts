import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../hardhat/utils";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await hre.getNamedAccounts();

  const koruDaoAddress = (await hre.ethers.getContract("KoruDao")).address;
  const koruDaoNftAddress = (await hre.ethers.getContract("KoruDaoNFT"))
    .address;

  let actionInterval;
  if (hre.network.name === "matic") {
    actionInterval = 12 * 60 * 60; // 12 hrs
  } else {
    actionInterval = 5 * 60; // 5 min
  }

  if (hre.network.name !== "hardhat") {
    console.log(
      `Deploying TimeRestrictionForPosting to ${hre.network.name}. Hit ctrl + c to abort`
    );
    console.log("actionInterval: ", actionInterval);
    await sleep(10000);
  }

  await deploy("TimeRestrictionForPosting", {
    from: deployer,
    proxy: {
      owner: deployer,
    },
    args: [actionInterval, koruDaoAddress, koruDaoNftAddress],
  });
};

export default func;

//func.skip = async (hre: HardhatRuntimeEnvironment) => {
  //const shouldSkip = hre.network.name !== "hardhat";
  //return shouldSkip;
//};

func.tags = ["TimeRestrictionForPosting"];
