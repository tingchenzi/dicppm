export function getTableData (page = 1, pageSize = 10, totalData = []) {
  const { length } = totalData
  const tableData = {
    data: [],
    page,
    pageSize,
    length,
  }
  if (pageSize >= length) {
    tableData.data = totalData
    tableData.page = 1
  } else {
    const num = pageSize * (page - 1)
    if (num < length) {
      const startIndex = num
      const endIndex = num + pageSize - 1
      tableData.data = totalData.filter((_, index) => index >= startIndex && index <= endIndex)
    } else {
      const size = parseInt(length / pageSize)
      const rest = length % pageSize
      if (rest > 0) {
        tableData.page = size + 1
        tableData.data = totalData.filter((_, index) => index >= pageSize * size && index <= length)
      } else if (rest === 0) {
        tableData.page = size
        tableData.data = totalData.filter((_, index) => index >= pageSize * (size - 1) && index <= length)
      }
    }
  }
  return tableData
}