import {
  NftMinted as NftMintedEvent
} from "../generated/LoveToken/LoveToken"
import { Collection, NftMinted } from "../generated/schema";

export function handleNftMinted(event: NftMintedEvent): void {
  const tokenId = event.params.tokenId;
  const collectionId = event.params.collectionId;
  const nftMinted = new NftMinted(`${collectionId.toHexString()}-${tokenId.toHexString()}`);
  nftMinted.tokenId = tokenId;
  nftMinted.collectionId = collectionId;

  let collection = Collection.load(collectionId.toHexString());
  if (!collection) {
    collection = new Collection(collectionId.toHexString());
    collection.tokenIds = [tokenId];
  } else {
    collection.tokenIds.push(tokenId);
  }

  nftMinted.save();
  collection.save();
}