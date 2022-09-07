// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get approved(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class LoverLinked extends ethereum.Event {
  get params(): LoverLinked__Params {
    return new LoverLinked__Params(this);
  }
}

export class LoverLinked__Params {
  _event: LoverLinked;

  constructor(event: LoverLinked) {
    this._event = event;
  }

  get linker(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get linked(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get collectionId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class NftMinted extends ethereum.Event {
  get params(): NftMinted__Params {
    return new NftMinted__Params(this);
  }
}

export class NftMinted__Params {
  _event: NftMinted;

  constructor(event: NftMinted) {
    this._event = event;
  }

  get collectionId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get tokenId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get collectionName(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class LoveToken extends ethereum.SmartContract {
  static bind(address: Address): LoveToken {
    return new LoveToken("LoveToken", address);
  }
}
