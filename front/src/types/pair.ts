export type Relation = {
  relation_type: string,
  relation_user_id: number,
  relation_user_name: string,
  created_at: Date,
};

export type SelectedRelation = {
  parentUserId: number,
  parentUserName: string,
}

export type GiftRequest = {
  id: number,
  parent_user_id: number,
  child_user_id: number,
  pair_user_name: string,
  coin: number,
  approved_at: Date | undefined,
  rejected_at: Date | undefined,
  created_at: Date,
  requestStatus?: RequestStatus,
}

export type GiftRequests = {
  myParents: GiftRequest[],
  myChildren: GiftRequest[],
}

export enum RequestType {
  forParents = "ちょうだい！",
  fromChildren = "あげる",
};

export enum RequestStatus {
  request = "お願い中",
  approved = "支払済",
  rejected = "却下",
}

export const SelectedGroup = {
  ...RequestStatus,
  all: "ALL"
} as const;
export type SelectedGroup = typeof SelectedGroup[keyof typeof SelectedGroup];
