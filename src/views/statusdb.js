
const status = {
  1: { title: 'Active', color: 'light-success ' },
  0: { title: 'Pending', color: 'light-primary' },
  5: { title: 'Stopped', color: 'light-danger' },
  11: { title: 'Unpaid', color: 'light-primary' }
}

const voucherstatus = {
  1: { title: 'Active', color: 'light-success ' },
  0: { title: 'In-Active', color: 'light-primary' }
}

const operationstatus = {
  Insert: { title: 'Insert', color: 'light-success ' },
  Update: { title: 'Update', color: 'light-primary' },
  Delete: { title: 'Delete', color: 'light-danger' },

  INSERT: { title: 'INSERT', color: 'light-success ' },
  UPDATE: { title: 'UPDATE', color: 'light-primary' },
  DELETE: { title: 'DELETE', color: 'light-danger' },
  CodeRelease: { title: 'CodeRelease', color: 'light-danger' },
  NewCodeAdded: { title: 'NewCodeAdded', color: 'light-primary' }
}
export const StatusSet = (statusid) => {
   return status[statusid] || { title: 'N/A', color: 'light-danger' }
}

export const VoucherStatusSet = (statusid) => {
  return voucherstatus[statusid] || { title: 'N/A', color: 'light-danger' }
}

export const OperationStatusSet = (statusid) => {
  return operationstatus[statusid] || { title: 'N/A', color: 'light-danger' }
}