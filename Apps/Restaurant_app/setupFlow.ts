// setupFlow.ts

export enum SetupGroup {
  VerifyBusiness = 1,
  CompleteProfile,
  SetupPayments,
  SetupOperations,
  AddMenuItems,
}

export const groupToPageMap: Record<SetupGroup, number> = {
  [SetupGroup.VerifyBusiness]: 1,
  [SetupGroup.CompleteProfile]: 4,
  [SetupGroup.SetupPayments]: 5,
  [SetupGroup.SetupOperations]: 6,
  [SetupGroup.AddMenuItems]: 7,
};
