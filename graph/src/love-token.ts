import {
  NftMinted as NftMintedEvent, Transfer as TransferEvent, LoverLinked as LoverLinkedEvent,
  CollectionCreated as CollectionCreatedEvent, CollectionBurned as CollectionBurnedEvent
} from "../generated/LoveToken/LoveToken";
import { Collection, Token } from "../generated/schema";

export function handleNftMinted(event: NftMintedEvent): void {
  const token = Token.load(event.params.tokenId.toString());
  token!.timestamp = event.params.timestamp;
  token!.tags = event.params.tags;
  token!.uri = event.params.uri;
  token!.save();

  const collection = Collection.load(event.params.collectionId.toString());
  collection!.tokens = collection!.tokens!.concat([event.params.collectionId.toString()]);
  collection!.save();
}

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
  }
  token.ownerAddress = event.params.to;
  token.save();
}

export function handleLoverLinked(event: LoverLinkedEvent): void {
  const collection = Collection.load(event.params.collectionId.toString());
  collection!.linkedPartnerAddress = event.params.linked;
  collection!.save();
}

export function handleCollectionCreated(event: CollectionCreatedEvent): void {
  const collection = new Collection(event.params.collectionId.toString());
  collection.name = event.params.name;
  collection.tokens = [];
  collection.profile = ['STRAIGHT', 'SAME_SEX', 'OTHERS'][event.params.profile];
  collection.ownerAddress = event.params.owner;
  collection.active = true;
  collection.save();
}

export function handleCollectionBurned(event: CollectionBurnedEvent): void {
  const collection = Collection.load(event.params.collectionId.toString());
  collection!.active = false;
  collection!.save();
}