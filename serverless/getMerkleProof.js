const { MerkleTree } = require("merkletreejs");
const ethers = require("ethers");

const { BigNumber } = ethers;

const getHashForLeaf = (baseNode) => {
  return ethers.utils.solidityKeccak256(
    ["address", "uint256"],
    [baseNode[0], BigNumber.from(baseNode[1])]
  );
};
exports.handler = async function(event, context) {
  const { rawData, index } = JSON.parse(event.body);

  const leaves = rawData.map(getHashForLeaf);

  const merkleTree = new MerkleTree(leaves, keccak_256, {
    sort: true,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      proof: merkleTree.getProof(getHashForLeaf(rawData[index])),
    }),
  };
};
