export const total = (item) => {
  const code = item.rate.code
  let amount = parseInt(item.rate.amount)
  if(!amount)
    amount = 0
  amount = amount*parseFloat(item.hours)
  if(!amount)
    amount = 0
  const rv = {code, amount}
  return rv
}
