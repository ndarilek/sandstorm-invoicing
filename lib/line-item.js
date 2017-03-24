export const total = (item) => {
  console.log(item)
  const code = item.rate.code
  let amount = item.rate.amount
  if(!amount)
    amount = 0
  amount = amount*parseFloat(item.hours)
  return {code, amount}
}
