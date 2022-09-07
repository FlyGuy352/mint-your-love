import { ethers, BigNumber } from 'ethers';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default async function (ownedTokenIds, linkedCollectionIds) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://api.studio.thegraph.com/query/34130/love-token-collections-v3/0.0.1',
  });

  const { /*loading, error,*/ data: { nftMinteds } } = await client.query({
    query: gql`{
    nftMinteds(where: { tokenId_in: [${ownedTokenIds}] }) {
      collectionId
    }
  }`});
  const ownedCollectionIds = nftMinteds.map(({ collectionId }) => ethers.utils.hexValue(BigNumber.from(collectionId).toHexString()));
  const { /*loading, error,*/ data: { collections: ownedCollections } } = await client.query({
    query: gql`{
    collections(where: { id_in: [${ownedCollectionIds.map(val => `"${val}"`)}] }) {
      id
      tokenIds
      collectionName
    }
  }`});

  const linkedCollectionHexedIds = linkedCollectionIds.map(id => ethers.utils.hexValue(BigNumber.from(id).toHexString()));
  const { /*loading, error,*/ data: { collections: linkedCollections } } = await client.query({
    query: gql`{
    collections(where: { id_in: [${linkedCollectionHexedIds.map(val => `"${val}"`)}] }) {
      id
      tokenIds
      collectionName
    }
  }`});

  return ownedCollections.concat(linkedCollections);
};