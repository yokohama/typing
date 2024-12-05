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
  point: number,
  approved_at: Date | undefined,
  rejected_at: Date | undefined,
  created_at: Date
}

export type GiftRequests = {
  myParents: GiftRequest[],
  myChildren: GiftRequest[],
}
